# eCommerce Backend — Microservices

Node.js + Express + MongoDB backend built as an **npm workspaces monorepo**. All external traffic enters through a single API Gateway which proxies requests to the appropriate microservice.

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
MDB_URI=mongodb://localhost:27017/myStore
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
MDB_URI=mongodb://localhost:27017/myStore
JWT_SECRET=...
```

### services/cart-service/.env.development
```
PORT=3003
NODE_ENV=development
MDB_URI=mongodb://localhost:27017/myStore
JWT_SECRET=...
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3004
PRODUCT_GRPC_URL=localhost:50052
```

### services/order-service/.env.development
```
PORT=3004
NODE_ENV=development
MDB_URI=mongodb://localhost:27017/myStore
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
