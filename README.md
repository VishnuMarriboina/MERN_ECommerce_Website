# MERN E-Commerce Website

A full-stack fashion e-commerce platform built with the **MERN stack** using a **microservices architecture**.

---

## Project Overview

A fashion store selling clothes, accessories, footwear, and any custom product category. Two user roles:

- **User** — browse products, add to cart, place orders, rate purchased variants, view order history
- **Admin** — manage products and variants, define custom category schemas, track orders, view users, manage contact messages

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Redux Toolkit, Redux Persist, Axios, React Router v7, Vite 7 |
| Backend | Node.js 20, Express 5, npm workspaces monorepo |
| Database | MongoDB 7 + Mongoose 8 |
| Auth | JWT (access token 1 h + refresh token 7 d via httpOnly cookie) |
| Gateway | express-http-proxy |
| Containers | Docker + Docker Compose |

---

## Repository Structure

```
MERN_ECommerce_Website/
│
├── Frontend/                    # React + Vite app (port 5173)
│   ├── src/
│   │   ├── components/          # Cart, Login, Orders (variant rating), Profile …
│   │   ├── dashboard/           # Dashboard, Navbar, Footer, Admin views
│   │   ├── pages/               # Product category pages + shared ProductDetail
│   │   ├── hooks/               # useProductVariants — variant selection logic
│   │   ├── Redux/               # Store + slices (Auth, Cart, Order, GenericProduct, CategorySchema)
│   │   └── utils/               # APIKit (Axios), ProtectedRoute, RefreshToken, endpoints
│   ├── index.html
│   └── package.json
│
└── Backend/                     # npm workspaces monorepo
    ├── gateway/                 # API Gateway          (port 3000)
    ├── services/
    │   ├── auth-service/        # Auth, Users & Contact (port 3001)
    │   ├── product-service/     # Product Catalog + Generic Products + Ratings (port 3002)
    │   ├── cart-service/        # Cart & Checkout      (port 3003)
    │   └── order-service/       # Orders               (port 3004)
    ├── packages/
    │   └── shared/              # @ecommerce/shared — common code
    ├── seed.js                  # Database seeder
    ├── docker-compose.yml
    └── package.json             # Workspace root — single npm install
```

---

## Architecture

All frontend traffic hits the API Gateway. Services communicate directly with each other for internal operations (stock checks, order creation, purchase count increments) — never through the gateway.

```
Frontend (5173)
     │
     ▼
API Gateway  :3000
│  (CORS · rate limit · round-robin load balancer)
     │
     ├── /api/auth/*         → Auth Service     :3001 (or multiple instances)
     ├── /api/users/*        → Auth Service     :3001
     ├── /api/contact/*      → Auth Service     :3001
     ├── /api/clothes/*      → Product Service  :3002 (or multiple instances)
     ├── /api/accessories/*  → Product Service  :3002
     ├── /api/footwear/*     → Product Service  :3002
     ├── /api/products/*     → Product Service  :3002  (ratings + generic products + schemas)
     ├── /api/cart/*         → Cart Service     :3003 (or multiple instances)
     └── /api/orders/*       → Order Service    :3004 (or multiple instances)

Cart Service :3003 ──► Product Service :3002  (stock decrement + purchase count increment)
                  └──► Order Service   :3004  (create order on checkout)
```

The gateway uses a built-in **round-robin load balancer** (`gateway/src/utils/loadBalancer.js`). Set any `*_SERVICE_URLS` env var to a comma-separated list of instance URLs and the gateway distributes requests across them automatically.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| MongoDB | Running locally on port 27017, or Docker |

---

## Setup & Running

### 1. Install backend dependencies

A single `npm install` from `Backend/` links all services and `@ecommerce/shared` via npm workspaces:

```bash
cd Backend
npm install
```

### 2. Configure environment variables

The `.env` files are pre-created from `.env.example`. Fill in real values:

```
Backend/.env.shared                      ← shared MongoDB URI + JWT secrets
Backend/gateway/.env                     ← CORS origins + service URLs (supports comma-separated for load balancing)
Backend/services/auth-service/.env       ← auth secrets + AWS S3 (optional)
Backend/services/product-service/.env    ← MongoDB URI + JWT secret
Backend/services/cart-service/.env       ← MongoDB URI + JWT + service URLs
Backend/services/order-service/.env      ← MongoDB URI + JWT secret
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Seed the database (optional)

```bash
cd Backend
npm run seed
```

The seed is **idempotent** — safe to run multiple times. Creates sample users, products, and orders.

**Sample accounts after seeding:**

| Role | Email | Password |
|---|---|---|
| Admin | arjun.admin@store.com | Admin@123 |
| Admin | sneha.admin@store.com | Admin@456 |
| User | priya.mehta@gmail.com | User@123 |
| User | rahul.verma@gmail.com | User@456 |
| User | ananya.k@gmail.com | User@789 |

### 4. Start the backend

**All services at once:**
```bash
cd Backend
npm run dev:all
```

**Individual services (separate terminals):**
```bash
cd Backend
npm run start:gateway   # port 3000
npm run start:auth      # port 3001
npm run start:product   # port 3002
npm run start:cart      # port 3003
npm run start:order     # port 3004
```

**Docker Compose (all services + MongoDB):**
```bash
cd Backend
docker-compose up --build
```

### 5. Start the frontend

```bash
cd Frontend
npm install
npm run dev
# → http://localhost:5173
```

The frontend talks to the API Gateway at `http://localhost:3000/api`.

### 6. Verify services are running

```
http://localhost:3000/health  → Gateway
http://localhost:3001/health  → Auth Service
http://localhost:3002/health  → Product Service
http://localhost:3003/health  → Cart Service
http://localhost:3004/health  → Order Service
```

---

## User Roles & Features

### User
- Register / Login / Forgot password / Update profile
- Browse all products across every category
- View per-variant rating, review count, and units sold on the product detail page
- Add items to cart, update quantity, remove items
- Checkout (buy all cart items at once)
- Rate each purchased variant (1–5 stars) after order is Confirmed, Shipped, or Delivered
- View personal order history with status filters and cancel orders
- Submit contact messages through the Contact page

### Admin
- Everything a User can do
- **Built-in categories** (Shirts, Tshirts, Belts, Watches, Shoes, Sandals): add products with variants, edit/delete products and individual variants
- **Custom category products** (via Product Catalog panel): define a schema for any new category (e.g. Perfume, Eyewear, Toys), then add/edit/delete products and variants using that schema's structured fields
- **Schema Builder**: define product-level and variant-level fields per category — text, number, select, textarea — with required flags and dropdown options
- View per-variant **Sold**, **Rating**, and **Stock** in the variant sub-table
- View aggregate stats (Total Stock, Total Sold, Avg Rating) per category
- View and update all order statuses
- View all registered users
- Read and manage contact form submissions (New / Read / Resolved status)

---

## API Reference

All routes are relative to `http://localhost:3000`.

### Auth — `/api/auth` and `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login — returns access token + sets refresh cookie; creates a Session document |
| POST | `/api/auth/refresh-token` | No | New access token via refresh cookie; validates against Session store |
| POST | `/api/auth/forgot-password` | No | Reset password via OTP email |
| PUT | `/api/users/update-profile` | Yes | Update profile |
| GET | `/api/users/allUsers` | Admin | List all users |

### Contact — `/api/contact`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/contact/submit` | No | Submit a contact form message |
| GET | `/api/contact/all` | Admin | List all contact messages |
| PATCH | `/api/contact/:id/status` | Admin | Update message status (New / Read / Resolved) |

### Built-in Products — `/api/clothes`, `/api/accessories`, `/api/footwear`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/{category}/get{Product}` | Yes | List products |
| POST | `/{category}/addNew{Product}` | Admin | Add product with variants |
| PUT | `/{category}/update-{Product}/:id` | Admin | Update product |
| DELETE | `/{category}/delete-{Product}/:id` | Admin | Delete product |
| POST | `/{category}/:id/add-variant` | Admin | Add variant |
| PUT | `/{category}/:id/update-variant/:variantid` | Admin | Update variant |
| DELETE | `/{category}/:id/delete-variant/:variantid` | Admin | Delete variant |

| Category | Products |
|---|---|
| `/api/clothes` | Shirts, Tshirts |
| `/api/accessories` | Belts, Watches |
| `/api/footwear` | Shoes, Sandals |

### Generic Products — `/api/products`

For any category not in the built-in list. Requires a category schema to be defined first.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/products/regProduct` | Admin | Register a product (any category) |
| GET | `/api/products/getProducts?category=X` | Yes | Fetch products by category name |
| PUT | `/api/products/update/:id` | Admin | Update a generic product |
| DELETE | `/api/products/delete/:id` | Admin | Delete a generic product |
| POST | `/api/products/:id/add-variant` | Admin | Add a variant |
| PUT | `/api/products/:id/update-variant/:variantId` | Admin | Update a variant |
| DELETE | `/api/products/:id/delete-variant/:variantId` | Admin | Delete a variant |

### Category Schemas — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/products/defineCategory` | Admin | Create or update a category schema |
| GET | `/api/products/categorySchemas` | Admin | List all category schemas |
| GET | `/api/products/categorySchema/:name` | Yes | Get schema for a specific category |
| DELETE | `/api/products/categorySchema/:name` | Admin | Delete a category schema |

### Ratings — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/products/rate` | Yes | Submit or update a variant rating (1–5 stars) |
| GET | `/api/products/my-rating` | Yes | Get the current user's rating for a specific variant |

### Cart — `/api/cart`

| Method | Path | Description |
|---|---|---|
| POST | `/add` | Add item (validates stock) |
| GET | `/` | Get cart with product details |
| PUT | `/update-qty` | Update item quantity |
| DELETE | `/remove` | Remove one item |
| DELETE | `/clear` | Clear entire cart |
| POST | `/buy-all` | Checkout — decrements stock, creates order, increments per-variant purchase count |

### Orders — `/api/orders`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/my-orders` | User | Personal order history |
| GET | `/all` | Admin | All orders |
| PUT | `/update-status/:id` | Admin | Update order status |
| PUT | `/cancel-order/:orderId` | User | Cancel own order |

---

## Data Models

### Variant-Level Stats

All built-in product schemas (Shirts, T-Shirts, Belts, Watches, Shoes, Sandals) store `rating`, `ratingCount`, and `purchaseCount` **inside each variant subdocument** — not at the product level. This enables accurate per-variant tracking when the same product comes in different sizes, colours, or styles.

```js
// Each built-in variant contains:
{
  size, color, cost, count, image_url,
  rating:        Number | null,  // running average (null until first rating)
  ratingCount:   Number,         // total ratings submitted for this variant
  purchaseCount: Number,         // total units purchased for this variant
}
```

### Generic Product (custom categories)

```js
// GenericProduct document:
{
  category:    String,   // e.g. "Perfume", "Eyewear"
  name:        String,
  brand:       String,
  description: String,
  attributes:  Object,   // schema-defined product-level fields
  variants: [{
    cost:       Number,
    count:      Number,
    image_url:  String,
    attributes: Object,  // schema-defined variant-level fields
    purchaseCount, rating, ratingCount
  }]
}
```

### CategorySchema

```js
{
  categoryName:  String,  // unique, e.g. "Perfume"
  fields:        [{ name, label, type, required, options, placeholder }],  // product-level
  variantFields: [{ name, label, type, required, options, placeholder }],  // variant-level
}
```

The `ProductRating` collection enforces a unique index on `{ productId, variantId, userId }` — one rating per user per variant. Updating a rating recalculates the running average atomically without changing the count.

---

## Load Balancing

The API Gateway has a built-in round-robin load balancer. Each service URL env var accepts a comma-separated list — the gateway picks the next URL on every incoming request.

### How it works

```
gateway/src/utils/loadBalancer.js   — RoundRobin class with .next()
gateway/src/services/proxy.service.js — proxy(() => balancer.next(), opts)
gateway/src/routes/*.routes.js      — createBalancer(process.env.*_SERVICE_URLS)
```

### Enabling load balancing

Start multiple instances of whichever service needs to scale (product-service handles the most traffic):

```bash
# Terminal 1 — instance on default port
npm run start:product                          # PORT=3002

# Terminal 2 — second instance
PORT=3012 node services/product-service/src/server.js

# Terminal 3 — third instance
PORT=3022 node services/product-service/src/server.js
```

Then tell the gateway about all three in `Backend/gateway/.env`:

```
PRODUCT_SERVICE_URLS=http://localhost:3002,http://localhost:3012,http://localhost:3022
```

Restart the gateway — done. No code changes needed.

### Scale priority

| Service | Why scale first |
|---|---|
| Product Service | Highest traffic — all product browsing, ratings |
| Cart Service | Write on every add-to-cart |
| Auth Service | Login spikes during sales |
| Order Service | Admin-only reads — scale last |

---

## Security Practices

- Passwords hashed with `bcryptjs` (10 salt rounds)
- JWT access tokens expire in 1 hour; refresh tokens in 7 days
- Refresh token stored in an `httpOnly` cookie (not accessible from JavaScript)
- Each service validates JWT independently — no round-trip to auth-service per request
- CORS restricted to declared origins via `ALLOWED_ORIGINS`; allowed methods include `PATCH`
- `.env` files never committed — only `.env.example` and `.env.shared` are tracked
- Internal service-to-service routes (`/internal/*`) not exposed through the API Gateway

---

## License

MIT
