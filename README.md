# MERN E-Commerce Website

A full-stack e-commerce platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) using a **microservices architecture**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [User Roles & Features](#user-roles--features)
6. [Setup & Running](#setup--running)
7. [How Services Communicate](#how-services-communicate)
8. [API Reference](#api-reference)
9. [Environment Variables](#environment-variables)
10. [Seed Data](#seed-data)
11. [Security Practices](#security-practices)

---

## Project Overview

A fashion e-commerce store selling clothes, accessories, and footwear. Two user roles exist:

- **User** — browses products, adds to cart, places orders, views order history
- **Admin** — manages products (add/update/delete variants), tracks orders, sees all users

---

## Prerequisites

Make sure the following are installed before you begin:

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18 or above | [nodejs.org](https://nodejs.org) |
| npm | 9 or above | Comes with Node.js |
| MongoDB | 6 or above | Must be running locally on port `27017` |

Verify your setup:

```bash
node -v
npm -v
mongod --version
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Redux Toolkit, Redux Persist, Axios, React Router v7, Vite |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB, Mongoose 8 |
| Auth | JWT (access token 1 h + refresh token 7 d via httpOnly cookie) |
| Gateway | express-http-proxy |

---

## Architecture

The backend is split into **5 independent services** behind a single API Gateway:

```
Frontend (5173)
     │
     ▼
API Gateway  :3000   ← single entry point for the frontend
     │
     ├── /api/users/*       → Auth Service     :3001
     ├── /api/clothes/*     → Product Service  :3002
     ├── /api/accessories/* → Product Service  :3002
     ├── /api/footwear/*    → Product Service  :3002
     ├── /api/cart/*        → Cart Service     :3003
     └── /api/orders/*      → Order Service    :3004
```

| Service | Port | Responsibility | Collections |
|---|---|---|---|
| api-gateway | 3000 | Routing only, no business logic | — |
| auth-service | 3001 | Users, JWT issuance, token refresh | `users` |
| product-service | 3002 | Product catalogue and stock management | `shirts`, `t-shirts`, `belts`, `watches`, `shoes`, `sandals` |
| cart-service | 3003 | Shopping cart operations | `carts` |
| order-service | 3004 | Orders and status tracking | `orders` |

---

## Folder Structure

```
MERN_ECommerce_Website/
│
├── FrontEnd/                       # React + Vite frontend (port 5173)
│   ├── src/
│   │   ├── components/             # Cart, Login, Orders, Profile, ShirtList …
│   │   ├── dashboard/              # Dashboard, Footer, Navbar, Sidebar …
│   │   ├── pages/                  # Product category pages
│   │   ├── Redux/
│   │   │   ├── Store.jsx
│   │   │   └── slices/             # AuthSlice, CartSlice, OrderSlice, product slices …
│   │   └── utils/
│   │       ├── APIKit.jsx          # Axios instance — baseURL points to API Gateway
│   │       ├── ProtectedRoute.jsx
│   │       └── RefreshToken.jsx
│   └── package.json
│
├── services/                       # Microservices — 5 independent Express apps
│   ├── api-gateway/                # Port 3000 — reverse proxy, single entry point
│   ├── auth-service/               # Port 3001 — signup, login, token refresh, profile
│   ├── product-service/            # Port 3002 — all product CRUD + internal stock APIs
│   ├── cart-service/               # Port 3003 — cart operations + checkout
│   ├── order-service/              # Port 3004 — orders and status tracking
│   └── package.json                # Convenience scripts to start all services
│
├── Backend/                        # Seed script only (not a running server)
│   ├── seed.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## User Roles & Features

### User
- Register / Login / Forgot password
- Browse all products across every category
- Add items to cart, update quantity, remove items
- Checkout (buy all cart items at once)
- View personal order history

### Admin
- Everything a User can do
- Add new product collections with variants
- Update or delete products and individual variants
- View and update order statuses
- View all registered users

---

## Setup & Running

### 1. Install service dependencies

Run the single convenience script from the `services/` folder:

```bash
cd services
npm run install:all
```

Or install each service individually if preferred:

```bash
cd services/api-gateway     && npm install
cd services/auth-service    && npm install
cd services/product-service && npm install
cd services/cart-service    && npm install
cd services/order-service   && npm install
```

### 2. Configure environment variables

Each service has its own `.env` file. Create them from the examples and fill in the secrets:

**`services/api-gateway/.env`**
```
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173
AUTH_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
CART_SERVICE_URL=http://localhost:3003
ORDER_SERVICE_URL=http://localhost:3004
```

**`services/auth-service/.env`**
```
PORT=3001
MDB_URI=mongodb://localhost:27017/myStore
JWT_SECRET=<generate below>
JWT_REFRESH_SECRET=<generate below>
```

**`services/product-service/.env`**
```
PORT=3002
MDB_URI=mongodb://localhost:27017/myStore
JWT_SECRET=<same secret>
```

**`services/cart-service/.env`**
```
PORT=3003
MDB_URI=mongodb://localhost:27017/myStore
JWT_SECRET=<same secret>
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3004
```

**`services/order-service/.env`**
```
PORT=3004
MDB_URI=mongodb://localhost:27017/myStore
JWT_SECRET=<same secret>
```

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run it twice — once for `JWT_SECRET`, once for `JWT_REFRESH_SECRET`.

> All services share the same `MDB_URI` and `JWT_SECRET` so they read/write the same database and validate the same tokens.

### 3. Seed the database (run once)

```bash
cd Backend
npm install
npm run seed
```

The seed is **idempotent** — running it multiple times will not create duplicates.

### 4. Start all 5 services (5 terminals)

```bash
# Terminal 1
cd services/api-gateway && npm start

# Terminal 2
cd services/auth-service && npm start

# Terminal 3
cd services/product-service && npm start

# Terminal 4
cd services/cart-service && npm start

# Terminal 5
cd services/order-service && npm start
```

### 5. Start the frontend

```bash
cd FrontEnd
npm install
npm run dev
# → http://localhost:5173
```

The frontend is pre-configured to talk to the API Gateway at `http://localhost:3000/api`.

---

## How Services Communicate

Each service owns its domain and talks to others only when necessary via **synchronous HTTP** (no message broker) using Node's built-in `fetch`.

### Internal APIs (service-to-service only)

Internal routes are mounted at `/internal/*` and are **not** exposed through the API Gateway — reachable only between services on localhost.

#### Product Service exposes:

| Method | Path | Used by | Purpose |
|---|---|---|---|
| `GET` | `/internal/stock/:model/:productId/:variantId` | cart-service | Check stock before adding/updating cart |
| `GET` | `/internal/products/:model/:id` | cart-service | Fetch product details to enrich cart view |
| `PUT` | `/internal/stock/decrement` | cart-service | Atomically decrement stock during checkout |

#### Order Service exposes:

| Method | Path | Used by | Purpose |
|---|---|---|---|
| `POST` | `/internal/orders` | cart-service | Create an order record after checkout |

### Checkout flow

When a user clicks **Buy All**:

```
Browser
  │  POST /api/cart/buy-all
  ▼
API Gateway :3000
  │  proxy → cart-service :3003
  ▼
Cart Service
  │
  ├─ For each cart item:
  │    PUT http://product-service:3002/internal/stock/decrement
  │    ← { success, price, product }   (atomic — fails if out of stock)
  │
  ├─ Collects purchased items + total
  │
  ├─ POST http://order-service:3004/internal/orders
  │    ← order record created
  │
  ├─ Clears local cart
  │
  └─ Returns { message, order } to browser
```

### Authentication flow

Each service validates JWT **independently** using the shared `JWT_SECRET` — no round-trip to auth-service per request.

```
Browser → sends Authorization: Bearer <token>
       → API Gateway proxies it to the target service
       → Target service verifies the JWT locally
```

---

## API Reference

All routes below are relative to `http://localhost:3000/api`.

### Auth — `/api/users`

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/signup` | No | Any | Register new user |
| POST | `/login` | No | Any | Login, returns access token + sets refresh cookie |
| POST | `/refresh-token` | No | Any | Get new access token using refresh cookie |
| POST | `/forgot-password` | No | Any | Reset password directly |
| PUT | `/update-profile` | Yes | Any | Update name, age, gender, address, phone, photo |
| GET | `/allUsers` | Yes | Admin | List all non-admin users |

### Products — `/api/clothes`, `/api/accessories`, `/api/footwear`

Every product category follows the same pattern:

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/{category}/get{Product}` | Yes | Any | List products |
| POST | `/{category}/add{Product}` | Yes | Admin | Add new product with variants |
| PUT | `/{category}/update-{Product}/:id` | Yes | Admin | Update product metadata |
| DELETE | `/{category}/delete-{Product}/:id` | Yes | Admin | Delete product |
| POST | `/{category}/:id/add-variant` | Yes | Admin | Add variant to product |
| PUT | `/{category}/:id/update-variant/:variantid` | Yes | Admin | Update specific variant |
| DELETE | `/{category}/:id/delete-variant/:variantid` | Yes | Admin | Delete specific variant |

| Category path | Product name | Example |
|---|---|---|
| `/api/clothes` | `Shirts` / `Tshirts` | `/api/clothes/getShirts` |
| `/api/accessories` | `Belts` / `Watches` | `/api/accessories/getBelts` |
| `/api/footwear` | `Shoes` / `Sandals` | `/api/footwear/getShoes` |

### Cart — `/api/cart`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/add` | Yes | Add item to cart (validates stock) |
| GET | `/` | Yes | Get cart with enriched product details |
| PUT | `/update-qty` | Yes | Update item quantity (validates stock) |
| DELETE | `/remove` | Yes | Remove one item from cart |
| DELETE | `/clear` | Yes | Clear entire cart |
| POST | `/buy-all` | Yes | Checkout — decrement stock and create order |

### Orders — `/api/orders`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/my-orders` | Yes | Get logged-in user's orders |
| GET | `/all` | Yes (Admin) | Get all orders for products added by this admin |
| PUT | `/update-status/:id` | Yes (Admin) | Update order status |
| PUT | `/cancel-order/:orderId` | Yes | Cancel own order (not if Delivered) |

---

## Environment Variables

| Variable | Gateway | Auth | Product | Cart | Order |
|---|---|---|---|---|---|
| `PORT` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `MDB_URI` | | ✓ | ✓ | ✓ | ✓ |
| `JWT_SECRET` | | ✓ | ✓ | ✓ | ✓ |
| `JWT_REFRESH_SECRET` | | ✓ | | | |
| `ALLOWED_ORIGINS` | ✓ | | | | |
| `AUTH_SERVICE_URL` | ✓ | | | | |
| `PRODUCT_SERVICE_URL` | ✓ | | | ✓ | |
| `CART_SERVICE_URL` | ✓ | | | | |
| `ORDER_SERVICE_URL` | ✓ | | | ✓ | |

---

## Seed Data

```bash
cd Backend
npm run seed
```

### Sample accounts

| Role | Email | Password |
|---|---|---|
| Admin | arjun.admin@store.com | Admin@123 |
| Admin | sneha.admin@store.com | Admin@456 |
| User | priya.mehta@gmail.com | User@123 |
| User | rahul.verma@gmail.com | User@456 |
| User | ananya.k@gmail.com | User@789 |

### Seeded records

| Collection | Count |
|---|---|
| Users | 5 (2 Admin, 3 User) |
| Shirts | 5 products, 4–5 variants each |
| T-Shirts | 5 products, 4–5 variants each |
| Belts | 4 products, 4 variants each |
| Watches | 5 products, 3–5 variants each |
| Shoes | 5 products, 4–5 variants each |
| Sandals | 5 products, 4–5 variants each |
| Orders | 9 sample orders across 3 users |

---

## Security Practices

- Passwords hashed with `bcryptjs` (10 salt rounds)
- JWT access tokens expire in 1 hour; refresh tokens in 7 days
- Refresh token stored in an `httpOnly` cookie (not accessible from JavaScript)
- Role-based access control — admin-only operations checked in every controller
- CORS restricted to declared origins via `ALLOWED_ORIGINS`
- `.env` files are in `.gitignore` and never committed
- Internal service-to-service routes (`/internal/*`) are not exposed through the API Gateway

---

## License

MIT
