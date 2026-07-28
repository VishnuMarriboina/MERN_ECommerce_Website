# eCommerce Backend — Microservices

Node.js + Express + MongoDB backend built as an **npm workspaces monorepo**. All external traffic enters through a single API Gateway which proxies requests to the appropriate microservice.

---

## How It Works (start here)

This section is the "explain it on a whiteboard" version. The reference material below (routes, models, env vars) is for when you need exact details.

### The big idea

Instead of one big Express app, the backend is split into 5 independent Node processes, each with its own `package.json`, its own MongoDB database, and its own port. They only know how to talk HTTP — nothing is shared in memory between them.

- **gateway** — the only process the frontend ever talks to. It doesn't contain business logic; it just looks at the URL prefix (`/api/auth`, `/api/products`, ...) and forwards (proxies) the request to the right service, then streams the response back.
- **auth-service, product-service, cart-service, order-service** — each owns one slice of the domain and one MongoDB database (`auth_db`, `product_db`, `cart_db`, `order_db`). No service reaches into another service's database directly — if cart-service needs product data, it makes an HTTP call to product-service's `/internal/*` routes (see "Internal routes" below).
- **packages/shared** (`@ecommerce/shared`) — not a service, just a library of code every service imports: error classes, the response-shape helper, the JWT middleware, logger, etc. It exists so five services don't each reinvent "how do I send an error response."

Why split it this way at all: each service can be deployed, scaled, or restarted independently (e.g. `PRODUCT_SERVICE_URLS` can list 3 instances behind the gateway's round-robin balancer, while auth-service stays at 1), and a bug/crash in one service doesn't take the others down.

### How a request actually travels

Concretely, for `GET /api/products/getProducts?category=shirts`:

1. Browser sends the request to `gateway` on port 3000.
2. `gateway/src/app.js` runs `helmet`, CORS, and the global rate limiter, then hands off to `gateway/src/routes/product.routes.js` because the path starts with `/products`.
3. That route file built a `balancer` at startup from `PRODUCT_SERVICE_URLS` (one or more URLs) and wraps it in `createProxy(balancer)` (`gateway/src/services/proxy.service.js`). On every request, `balancer.next()` picks the next instance URL round-robin, and [`express-http-proxy`](https://www.npmjs.com/package/express-http-proxy) forwards the request there as-is (headers, body, query string).
4. `product-service` (port 3002) receives it exactly like it would from any direct client — the gateway is invisible to it.
5. The response flows straight back through the gateway to the browser. The gateway does not transform, cache, or inspect the response body.

This is why adding a brand-new route to a service (e.g. a new `/api/products/wishlist` endpoint) requires **zero gateway changes** as long as it falls under an existing prefix (`/products`) — the gateway proxies the whole prefix, not individual routes.

### Authentication — where it's actually checked

This trips people up, so it's worth being explicit:

- The **gateway does not verify JWTs**. `gateway/src/middlewares/auth.middleware.js` exports an `authCheck` that only checks "is there a `Bearer ...` header at all" — and as of now it isn't even wired into any gateway route. The gateway is auth-agnostic; it just plumbs the `Authorization` header through to whichever service is downstream.
- **Each service verifies the token itself**, independently, using the shared middleware (`packages/shared/src/middlewares/auth.middleware.js`). It calls `jwt.verify(token, process.env.JWT_SECRET)` and puts the decoded payload (which includes `User_Role`) on `req.user`.
- This only works because **every service's `.env` has the same `JWT_SECRET`** — there's no central session store the services call out to. A token signed by auth-service is trusted by product-service, cart-service, and order-service purely because they all hold the same secret. If you ever rotate `JWT_SECRET`, it must be rotated in all four service `.env` files at once, or tokens minted before the rotation will fail verification everywhere except the service that hasn't been updated yet.
- Refresh tokens are the one piece of real server-side state: `auth-service` stores them in the `Session` model (`services/auth-service/src/models/session.model.js`) so they can be revoked. Access tokens are stateless JWTs and can't be revoked before they expire — only refresh tokens can.

### Walkthrough: login → protected request

1. `POST /api/auth/login` → gateway proxies to auth-service → `AuthController.login` (`services/auth-service/src/controllers/auth.controller.js`) calls `authService.login`, which checks the password hash and signs an access token + refresh token.
2. The refresh token is set as an **httpOnly cookie**; the access token comes back in the JSON body. The frontend stores the access token (see `FrontEnd/src/utils/APIKit.jsx`) and attaches it as `Authorization: Bearer <token>` on every subsequent request.
3. `PUT /api/users/update-profile` → gateway proxies to auth-service unchanged → auth-service's own auth middleware verifies the JWT → request proceeds.
4. When the access token expires, the frontend calls `POST /api/auth/refresh-token`, which reads the httpOnly cookie (not a header) and issues a new access token — this is why that one route doesn't need a `Bearer` token at all.

### Walkthrough: checkout (the one flow that touches three services)

`POST /api/cart/buy-all` is the most "microservices-y" request in the system — cart-service acts as an orchestrator, calling two other services synchronously and one fire-and-forget:

```
Frontend → gateway → cart-service
                        │
                        ├─ 1. PUT product-service /internal/stock/decrement   (must succeed — stock is finite)
                        ├─ 2. POST order-service  /internal/orders            (creates the order record)
                        ├─ 3. clears the cart in cart_db
                        └─ 4. PUT product-service /internal/purchase/increment (fire-and-forget — checkout doesn't wait on this)
```

These `/internal/*` calls are plain HTTP (`fetchWithTimeout` from `@ecommerce/shared/src/utils/httpClient`) using `PRODUCT_SERVICE_URL` / `ORDER_SERVICE_URL` env vars set directly on cart-service — they go **service-to-service, bypassing the gateway entirely**. The gateway is only for browser-facing traffic; internal routes are never registered in any gateway route file, so they aren't reachable from the internet unless a service's port is directly exposed.

If step 1 fails (not enough stock), the whole checkout aborts before an order is ever created — there's no distributed transaction/rollback here, just careful ordering (decrement stock and create the order before touching the cart, so a failure leaves the cart intact for the user to retry).

### A loose thread worth knowing about

`services/cart-service/.env.development` defines `PRODUCT_GRPC_URL=localhost:50052` and `packages/shared/proto/` exists as a directory, but there is **no gRPC client or server code anywhere in the codebase** — every inter-service call today is plain REST/HTTP via `fetchWithTimeout`. Treat the gRPC env var and proto folder as unused scaffolding for a future optimization, not something currently in the request path.

---

## Architecture

```
Backend/
│
├── gateway/                  → API Gateway          (port 3000)
│
├── services/
│   ├── auth-service/         → Auth, Users & Contact (port 3001)
│   ├── product-service/      → Built-in Products + Generic Products + Category Schemas + Ratings (port 3002)
│   ├── cart-service/         → Cart & Checkout      (port 3003)
│   └── order-service/        → Orders               (port 3004)
│
└── packages/
    └── shared/               → @ecommerce/shared (common code)
```

Each service follows the same internal structure:

```
src/
├── app.js          → Express app setup
├── server.js       → DB connect + listen
├── config/         → env, db, jwt configs
├── constants/      → service-specific messages & enums
├── controllers/    → request handlers
├── docs/           → swagger.yaml
├── middlewares/    → auth, error, validation
├── models/         → Mongoose schemas
├── repositories/   → DB query layer
├── routes/         → Express routers
├── services/       → business logic
├── utils/          → helpers
└── validators/     → input validation functions
```

---

## Services

### Gateway — port 3000

Single entry point. Proxies all `/api/*` requests to the correct downstream service. Applies CORS (including `PATCH`) and rate limiting (200 req / 15 min per IP).

| Route prefix          | Proxied to       |
|-----------------------|-----------------|
| `/api/auth`           | auth-service     |
| `/api/users`          | auth-service     |
| `/api/contact`        | auth-service     |
| `/api/clothes`        | product-service  |
| `/api/accessories`    | product-service  |
| `/api/footwear`       | product-service  |
| `/api/products`       | product-service  |
| `/api/cart`           | cart-service     |
| `/api/orders`         | order-service    |

**Load balancing** is built into the gateway via `src/utils/loadBalancer.js`. Each service URL env var accepts a comma-separated list of instance URLs. The gateway round-robins across them on every incoming request — no code changes needed to scale.

```
# Single instance (development default)
PRODUCT_SERVICE_URLS=http://localhost:3002

# Three instances — gateway round-robins across all three
PRODUCT_SERVICE_URLS=http://localhost:3002,http://localhost:3012,http://localhost:3022
```

Gateway internal structure:
```
gateway/src/
├── utils/
│   └── loadBalancer.js   # RoundRobin class — picks next URL per request
├── services/
│   └── proxy.service.js  # createProxy(balancer) — calls balancer.next() on each request
└── routes/
    ├── auth.routes.js     # createBalancer(AUTH_SERVICE_URLS)
    ├── product.routes.js  # createBalancer(PRODUCT_SERVICE_URLS)
    ├── cart.routes.js     # createBalancer(CART_SERVICE_URLS)
    └── order.routes.js    # createBalancer(ORDER_SERVICE_URLS)
```

### Auth Service — port 3001

User registration, login, JWT access/refresh tokens, profile management, admin user listing, and contact form management.

**Routes:**
- `POST  /api/auth/signup`
- `POST  /api/auth/login`
- `POST  /api/auth/refresh-token`
- `POST  /api/auth/forgot-password`
- `GET   /api/users/allUsers` *(admin only)*
- `PUT   /api/users/update-profile`
- `POST  /api/contact/submit` *(public — stores contact message in DB)*
- `GET   /api/contact/all` *(admin only — list all messages)*
- `PATCH /api/contact/:id/status` *(admin only — update status: New / Read / Resolved)*

**Models:**
- `User` — registered users with role field
- `Contact` — contact form submissions with status field
- `Session` — refresh token sessions with `userId`, `refreshToken`, `expiresAt`, and `isRevoked`; one document per active login

**Key utilities:**
- `otp.util.js` / `mail.util.js` — OTP generation and email delivery for the forgot-password flow
- `token.util.js` / `password.util.js` — JWT signing/verification and bcrypt helpers
- `userCache.js` — in-memory user lookup cache to reduce repeat DB reads per request

### Product Service — port 3002

Handles two product systems side-by-side:

1. **Built-in categories** (Shirts, T-Shirts, Belts, Watches, Shoes, Sandals) — fixed schemas with dedicated Mongoose models
2. **Generic categories** (any category the admin defines) — flexible schema-driven products via `GenericProduct` and `CategorySchema` models

#### Built-in Product Routes

Pattern per category (`/api/clothes`, `/api/accessories`, `/api/footwear`):

| Method | Path | Description |
|---|---|---|
| GET | `/{category}/get{Product}` | List all products |
| POST | `/{category}/addNew{Product}` | Add product with variants |
| PUT | `/{category}/update-{Product}/:id` | Update product |
| DELETE | `/{category}/delete-{Product}/:id` | Delete product |
| POST | `/{category}/:id/add-variant` | Add variant |
| PUT | `/{category}/:id/update-variant/:variantid` | Update variant |
| DELETE | `/{category}/:id/delete-variant/:variantid` | Delete variant |

#### Generic Product Routes — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/products/regProduct` | Admin | Register a product for any category |
| GET | `/api/products/getProducts?category=X` | Yes | Fetch products by category name |
| PUT | `/api/products/update/:id` | Admin | Update a generic product |
| DELETE | `/api/products/delete/:id` | Admin | Delete a generic product |
| POST | `/api/products/:id/add-variant` | Admin | Add a variant |
| PUT | `/api/products/:id/update-variant/:variantId` | Admin | Update a variant |
| DELETE | `/api/products/:id/delete-variant/:variantId` | Admin | Delete a variant |

#### Category Schema Routes — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/products/defineCategory` | Admin | Create or update a category schema |
| GET | `/api/products/categorySchemas` | Admin | List all defined category schemas |
| GET | `/api/products/categorySchema/:name` | Yes | Get the schema for a specific category |
| DELETE | `/api/products/categorySchema/:name` | Admin | Delete a category schema |

A `CategorySchema` document specifies the field definitions for both product-level attributes and variant-level attributes. The schema is loaded by the frontend to render a structured Add/Edit form — no code changes are needed to support a new category.

#### Rating Routes — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/products/rate` | Yes | Submit or update a variant rating; body: `{ productId, variantId, productModel, rating }` |
| GET | `/api/products/my-rating` | Yes | Get the current user's rating; query: `?productId=&variantId=` |

#### Internal Routes (service-to-service only, not proxied through gateway)

| Method | Path | Description |
|---|---|---|
| GET | `/internal/stock/:model/:productId/:variantId` | Check current variant stock |
| GET | `/internal/products/:model/:id` | Fetch full product document |
| PUT | `/internal/stock/decrement` | Atomically decrement variant stock on checkout |
| PUT | `/internal/purchase/increment` | Increment `variants.$.purchaseCount` for purchased variants |

**Models:**
- `Shirts`, `Tshirts` — `clothes.model.js`
- `Belts`, `Watches` — `accessories.model.js`
- `Shoes`, `Sandals` — `footwear.model.js`
- `GenericProduct` — schema-flexible product for any custom category; stores `attributes` and `variants[].attributes` as plain objects keyed by the category schema field names
- `CategorySchema` — field definitions for a category; `fields[]` for product-level, `variantFields[]` for variant-level; each field has `name`, `label`, `type`, `required`, `options`, `placeholder`
- `ProductRating` — one rating per user per variant; unique index on `{ productId, variantId, userId }`

**Variant-level stats:** All product schemas (both built-in and generic) store `rating`, `ratingCount`, and `purchaseCount` inside each variant subdocument, enabling accurate tracking when a product has multiple sizes or colours.

**Additional services and utilities:**
- `inventory.service.js` — low-stock detection; returns generic products where any variant `count ≤ threshold` (default 5)
- `productSearch.service.js` — full-text search across `name`, `brand`, and `category` fields of generic products
- `imageUpload.util.js` — image upload helper
- `productFilter.util.js` — product filtering utility

### Cart Service — port 3003

Add/update/remove items, view cart with full product details, buy-all checkout. On checkout, decrements variant stock, creates the order, and fires a non-blocking request to increment per-variant purchase counts.

**Routes:**
- `POST   /api/cart/add`
- `GET    /api/cart`
- `PUT    /api/cart/update-qty`
- `DELETE /api/cart/remove`
- `DELETE /api/cart/clear`
- `POST   /api/cart/buy-all`

**Internal routes:**
- `GET    /internal/cart/:userId`
- `DELETE /internal/cart/:userId/clear`

**Checkout flow:**
1. For each cart item, call `PUT /internal/stock/decrement` on product-service
2. Call `POST /internal/orders` on order-service to create the order
3. Clear the cart
4. Fire-and-forget `PUT /internal/purchase/increment` to update per-variant `purchaseCount`

**Utilities:**
- `cartCalculator.util.js` — calculates cart total from item price × quantity
- `priceCalculator.util.js` — price calculation helpers (GST, delivery fee)

### Order Service — port 3004

Order history, admin order management, status updates, cancellation.

**Routes:**
- `GET /api/orders/my-orders`
- `GET /api/orders/all` *(admin only)*
- `PUT /api/orders/update-status/:id`
- `PUT /api/orders/cancel-order/:orderId`

**Internal routes:**
- `POST /internal/orders` *(called by cart-service on checkout)*

**Additional services:**
- `orderStatus.service.js` — validates state machine transitions; enforces Pending → Confirmed → Shipped → Delivered with cancellation paths from Pending and Confirmed only
- `invoice.service.js` — invoice generation (placeholder; returns order summary — PDF library can be plugged in)
- `invoiceGenerator.util.js` / `orderCalculator.util.js` — helpers for invoice rendering and order amount calculation

---

## Inter-service Communication

All calls are direct HTTP (no message broker). Purchase count increment is fire-and-forget — checkout never waits on it.

```
Frontend
   │
   ▼
Gateway (3000)
   │
   ├──► auth-service    (3001)
   ├──► product-service (3002)
   ├──► cart-service    (3003)  ──► product-service  (stock decrement)
   │                             ├──► order-service   (create order)
   │                             └──► product-service  (purchase count, fire-and-forget)
   └──► order-service   (3004)
```

---

## Shared Package — @ecommerce/shared

Installed as an npm workspace in all services. Import directly:

```js
const AppError     = require("@ecommerce/shared/src/exceptions/AppError");
const STATUS       = require("@ecommerce/shared/src/constants/statusCodes");
const { success }  = require("@ecommerce/shared/src/utils/responseHandler");
const logger       = require("@ecommerce/shared/src/utils/logger");
```

| Path | Contents |
|------|----------|
| `src/constants/` | `statusCodes`, `roles`, `messages` |
| `src/exceptions/` | `AppError`, `DatabaseError`, `ValidationError`, `errorTypes` |
| `src/middlewares/` | `auth`, `error`, `logger`, `validation` |
| `src/utils/` | `logger`, `responseHandler`, `asyncHandler`, `pagination` |
| `src/validators/` | `common.validator` |

---

## Environment Variables

Each service loads `.env.development` when `NODE_ENV=development` (the default). In production there is no `.env.production` file — environment variables are injected directly by the hosting platform (Docker, cloud provider, CI/CD). `dotenv` silently does nothing when the file is absent, so `process.env` is already populated by the platform.

Use the `.env.example` in each service directory as the full variable reference.

### gateway/.env.development
```
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173

AUTH_SERVICE_URLS=http://localhost:3001
PRODUCT_SERVICE_URLS=http://localhost:3002
CART_SERVICE_URLS=http://localhost:3003
ORDER_SERVICE_URLS=http://localhost:3004
```

### services/auth-service/.env.development
```
PORT=3001
NODE_ENV=development
MDB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=...
JWT_REFRESH_SECRET=...
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

### services/product-service/.env.development
```
PORT=3002
NODE_ENV=development
MDB_URI=mongodb://localhost:27017/product_db
JWT_SECRET=...
```

### services/cart-service/.env.development
```
PORT=3003
NODE_ENV=development
MDB_URI=mongodb://localhost:27017/cart_db
JWT_SECRET=...
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3004
PRODUCT_GRPC_URL=localhost:50052
```

### services/order-service/.env.development
```
PORT=3004
NODE_ENV=development
MDB_URI=mongodb://localhost:27017/order_db
JWT_SECRET=...
```

### Production

Set these same variables as environment variables on your server / Docker container / CI pipeline. No `.env.production` file is used or needed.

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB running locally, or Docker

### 1. Install all dependencies
```bash
cd Backend
npm install
```
This installs all workspace packages and links `@ecommerce/shared` across all services via npm workspaces — no manual linking needed.

### 2. Configure environment
Fill in real values in the `.env.development` file for each service:
```
gateway/.env.development
services/auth-service/.env.development
services/product-service/.env.development
services/cart-service/.env.development
services/order-service/.env.development
```
Use the `.env.example` in each directory as a reference. In production, set the same variables directly on your server or container — no `.env.production` file is used.

### 3. Seed the database (optional)
Populates MongoDB with sample users, products, and orders. Safe to run multiple times.
```bash
npm run seed
```
After seeding:
```
Admin → arjun.admin@store.com  / Admin@123
Admin → sneha.admin@store.com  / Admin@456
User  → priya.mehta@gmail.com  / User@123
User  → rahul.verma@gmail.com  / User@456
User  → ananya.k@gmail.com     / User@789
```

### 4. Start the services

**All services at once (development):**
```bash
npm run dev:all
```

**Individual services (separate terminals):**
```bash
npm run start:auth        # port 3001
npm run start:product     # port 3002
npm run start:cart        # port 3003
npm run start:order       # port 3004
npm run start:gateway     # port 3000
```

**Docker Compose (all services + MongoDB):**
```bash
docker-compose up --build
```

### 5. Verify everything is running
```
http://localhost:3000/health   → Gateway
http://localhost:3001/health   → Auth Service
http://localhost:3002/health   → Product Service
http://localhost:3003/health   → Cart Service
http://localhost:3004/health   → Order Service
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run dev:all` | Start all services concurrently with nodemon |
| `npm run start:gateway` | Start gateway only |
| `npm run start:auth` | Start auth-service only |
| `npm run start:product` | Start product-service only |
| `npm run start:cart` | Start cart-service only |
| `npm run start:order` | Start order-service only |
| `npm run seed` | Seed the database with sample data |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (access + refresh tokens) |
| Package management | npm workspaces |
| Containerisation | Docker + Docker Compose |
