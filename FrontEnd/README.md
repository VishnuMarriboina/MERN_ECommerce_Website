# Frontend

React + Vite frontend for the MERN eCommerce platform. Talks to the backend API Gateway on port 3000.

---

## Tech Stack

|                  |                                             |
| ---------------- | ------------------------------------------- |
| Framework        | React 19                                    |
| Build tool       | Vite 7                                      |
| State management | Redux Toolkit + Redux Persist               |
| Routing          | React Router v7                             |
| HTTP client      | Axios                                       |
| UI               | Custom inline styles (no component library) |

---

## Project Structure

```
Frontend/
├── index.html
├── vite.config.js
└── src/
    ├── App.jsx                     # Root — role-based routing (User → Dashboard, Admin → AdminDashboard)
    ├── main.jsx                    # Entry point — Redux Provider + PersistGate + BrowserRouter
    ├── App.css
    ├── index.css                   # Global CSS variables and design tokens
    │
    ├── assets/                     # Static images (belt, shirt, shoes, watches, etc.)
    │
    ├── components/                 # Shared page-level components
    │   ├── Cart.jsx                # 3-step checkout flow (cart → payment → confirmation)
    │   ├── CustomModal.jsx         # Reusable success / error / info modal
    │   ├── Loader.jsx              # Full-screen loading overlay
    │   ├── Login.jsx               # Login · Sign up · Forgot password (3-mode form)
    │   ├── Orders.jsx              # Order list with status filters, detail modal, and variant star rating
    │   ├── Profile.jsx             # Editable user profile with avatar and account info
    │   ├── DataFolder/
    │   │   └── componentsData.tsx  # Cart pricing constants (GST, delivery fee, free-shipping threshold),
    │   │                           #   checkout steps, payment types, and footer link definitions
    │   └── ui/
    │       └── VariantSelector.jsx # Variant selector pill UI using legacy productStyles constants
    │
    ├── dashboard/                  # Layout shells and page-level views
    │   ├── Dashboard.jsx           # Customer layout — sticky header, sidebar nav, all routes
    │   ├── Home.jsx                # Customer dashboard home — stats, orders, cart snapshot
    │   ├── Footer.jsx              # Site footer with links to info pages
    │   ├── DataFolder/
    │   │   └── dashboardData.ts    # Home feature cards and dashboard static content
    │   └── OrgDashboard/          # Admin dashboard
    │       ├── Admin/
    │       │   └── AdminDashboard.jsx   # Admin layout wrapper + tab router
    │       ├── components/
    │       │   ├── AdminHome.jsx        # Admin home — overview stats
    │       │   ├── ContactManagement.jsx  # View & manage contact form submissions
    │       │   ├── GenericProductPanel.jsx # Custom-category product catalog (schema builder + CRUD)
    │       │   ├── OrderManagement.jsx  # View and update all orders
    │       │   ├── ProductManagement.jsx  # Built-in category product/variant CRUD + variant sub-table
    │       │   ├── Sidebar.jsx          # Admin sidebar navigation
    │       │   └── UserManagement.jsx   # View all registered users
    │       └── DataFolder/
    │           └── orgDashboardData.ts  # Sidebar tabs, breadcrumb map, icon maps
    │
    ├── pages/
    │   ├── cloths/
    │   │   ├── Shirts.jsx
    │   │   └── Tshirts.jsx
    │   ├── accessories/
    │   │   ├── Belts.jsx
    │   │   └── Watches.jsx
    │   ├── footwears/
    │   │   ├── Shoes.jsx
    │   │   └── Sandals.jsx
    │   ├── DataFolder/
    │   │   └── pagesData.ts       # Static content for info pages — About team/values, contact channels,
    │   │                          #   shipping/returns copy, privacy policy text
    │   │
    │   ├── shared/                 # Components and utilities reused across all product pages
    │   │   ├── ProductDetail.jsx   # Full product detail — image, specs, variant picker, add-to-cart,
    │   │   │                       #   and per-variant rating / review count / units sold.
    │   │   │                       #   Handles both flat and nested variant.attributes structures.
    │   │   ├── CartIcon.jsx        # Floating cart icon with item count badge
    │   │   ├── SkeletonGrid.jsx    # Loading skeleton for product grids
    │   │   ├── VariantSelector.jsx # Size / colour / style pill selectors
    │   │   ├── pageStyles.js       # Shared style tokens for product pages
    │   │   ├── product-pages.css   # Product grid and card CSS
    │   │   ├── normalizeArray.js   # Normalises API array responses
    │   │   ├── usePageModal.js     # Hook — manages modal open/close/type state
    │   │   └── useProductsByCategory.js  # Hook — fetches and returns products for a given category
    │   │
    │   └── info/                  # Static informational pages (linked from footer)
    │       ├── About.jsx
    │       ├── Contact.jsx         # Contact channels + validated form (POST /api/contact/submit)
    │       ├── Shipping.jsx
    │       ├── Returns.jsx
    │       └── PrivacyPolicy.jsx
    │
    ├── hooks/
    │   └── useProductVariants.js   # Manages variant selection state; handles both flat variants
    │                               # and the nested variant.attributes structure used by built-in products
    │
    ├── Redux/
    │   ├── Store.jsx               # Redux store — persists cart + auth slices only
    │   ├── slices/
    │   │   ├── AuthSlice.jsx           # User auth state (jwt, user, loading, error)
    │   │   ├── CartSlice.jsx           # Cart items, loading, purchase state
    │   │   ├── OrderSlice.jsx          # User orders and admin all-orders state
    │   │   ├── GenericProductSlice.jsx # Product CRUD state for any category (built-in or custom)
    │   │   └── CategorySchemaSlice.jsx # Category schema state — active schema + all schemas list
    │   └── thunks/
    │       ├── authThunks.jsx
    │       ├── cartThunks.jsx
    │       ├── orderThunks.jsx
    │       ├── genericProductThunks.jsx    # fetchGenericProducts, regProduct, updateGenericProduct,
    │       │                               # deleteGenericProduct, addGenericVariant, updateGenericVariant,
    │       │                               # deleteGenericVariant
    │       └── categorySchemaThunks.jsx    # fetchCategorySchema, fetchAllCategorySchemas,
    │                                       # defineCategorySchema, deleteCategorySchema
    │
    ├── styles/
    │   └── productStyles.js        # Legacy product style constants
    │
    └── utils/
        ├── APIKit.jsx              # Axios instance — baseURL from VITE_API_URL env var
        ├── endpoints.js            # Centralised API endpoint constants
        ├── ProtectedRoute.jsx      # Redirects unauthenticated users to /login
        ├── RefreshToken.jsx        # Axios interceptor — auto-refreshes expired access tokens
        ├── Res.jsx                 # API response normaliser
        └── extractPhone.jsx        # Phone number formatting helper
```

---

## Routing Overview

All customer routes live inside `Dashboard.jsx`. The route tree after login:

| Path           | Component       | Layout    |
| -------------- | --------------- | --------- |
| `/`            | `Home`          | Sidebar   |
| `/shirts`      | `Shirts`        | Sidebar   |
| `/tshirts`     | `Tshirts`       | Sidebar   |
| `/belts`       | `Belts`         | Sidebar   |
| `/watches`     | `Watches`       | Sidebar   |
| `/shoes`       | `Shoes`         | Sidebar   |
| `/sandals`     | `Sandals`       | Sidebar   |
| `/product/:id` | `ProductDetail` | Full-page |
| `/cart`        | `Cart`          | Full-page |
| `/orders`      | `Orders`        | Full-page |
| `/profile`     | `Profile`       | Full-page |
| `/about`       | `About`         | Full-page |
| `/contact`     | `Contact`       | Full-page |
| `/shipping`    | `Shipping`      | Full-page |
| `/returns`     | `Returns`       | Full-page |
| `/privacy`     | `PrivacyPolicy` | Full-page |

> **Full-page** routes render without the category sidebar.
  
> `ProductDetail` receives its data via React Router `location.state` (passed by each product page's navigate call).

---

## Key Feature Details

### Variant-level Rating (Orders.jsx)

Users can rate a purchased variant (1–5 stars) directly from the order detail modal once the order status is **Confirmed**, **Shipped**, or **Delivered**. Each variant has its own independent rating.

- Rating state is keyed by `variantId` and persisted in `localStorage` across page reloads
- Submitting a rating calls `POST /api/products/rate` with `{ productId, variantId, productModel, rating }`
- The backend atomically updates `variants.$.rating` and `variants.$.ratingCount` using the Mongoose positional operator
- Re-rating the same variant recalculates the running average without changing the count
- A one-rating-per-user-per-variant constraint is enforced by a unique MongoDB index on `{ productId, variantId, userId }`

### Product Detail Page (ProductDetail.jsx)

The rating row shows the **selected variant's** `rating`, `ratingCount`, and `purchaseCount`. When no variant is selected yet, it falls back to the first variant's values.

Variant option pickers are built dynamically from the variant document. Built-in products store variant attributes inside a nested `attributes` object (e.g. `variant.attributes.size`). `useProductVariants.js` handles both flat and nested structures via a `getAttr` helper that checks `variant.attributes[key]` first, then falls back to `variant[key]`. Only primitive (string / number) values are exposed as selectable options — objects are filtered out to prevent React key/child errors.

### Admin — Product Management (ProductManagement.jsx)

Manages the **six built-in categories** (Shirts, Tshirts, Belts, Watches, Shoes, Sandals) plus any **custom categories** registered via the Generic Product Panel.

UI layout:
- **Gradient header** with page title, subtitle, and "Add Product" button
- **Stat cards** (Products, Total Stock, Units Sold, Avg Rating) — all computed from variant-level data
- **Category tabs** — built-in categories are always present; custom categories appear automatically once their schema is created
- **Products table** — expandable rows show a horizontal **variant sub-table** when clicked

Variant sub-table columns:
- `#` index
- One column per `variantField` defined in the category schema (e.g. Size, Color, Fit, Volume, Flavor)
- Cost · Stock (color-coded green/orange/red) · Sold · Rating · Image link
- Edit and Delete actions per row

Schema field filtering: fields whose names match `name`, `brand`, `description`, or `category` are stripped from the schema-rendered sections — they are already covered by the hardcoded Product Details form fields, so showing them twice is avoided.

### Admin — Product Catalog / Generic Products (GenericProductPanel.jsx)

Allows admins to register products for **any category** not in the built-in list.

Workflow:
1. **Search** for a category name (e.g. "Perfume", "Eyewear")
2. If no schema exists, click **Define Schema** to open the Schema Builder modal and specify product-level and variant-level fields (name, label, type, required, options)
3. Click **Add Product** — the form renders exactly the fields defined in the schema
4. Products and variants are stored as flexible key-value `attributes` objects, so no code changes are needed to support a new category

The schema banner shows the number of product fields and variant fields currently defined. The Edit Schema and Remove buttons let admins update or delete the schema at any time (existing product data is not affected).

### Contact Management (ContactManagement.jsx)

Admin-only tab in the org dashboard. Fetches all submissions from `GET /api/contact/all`. Shows a split layout — message list on the left, detail panel on the right — with filter tabs for All / New / Read / Resolved. Status can be updated via `PATCH /api/contact/:id/status`.

---

## Redux State

| Slice | Persisted | Key state |
|---|---|---|
| `auth` | Yes | `jwt`, `user` |
| `cart` | Yes | `cartItems`, `purchaseSuccess` |
| `orders` | No | `orders`, `allOrders` |
| `genericProduct` | No | `products[]`, `loading`, `error` |
| `categorySchema` | No | `schema`, `allSchemas[]`, `loading`, `error` |

Persistence uses `redux-persist` with `localStorage` as the storage adapter.  
Variant rating state is stored separately in `localStorage` under the key `productRatings` (keyed by `variantId`).

> **Note:** Category-specific slices (ShirtSlice, TshirtSlice, BeltSlice, WatchSlice, ShoeSlice, SandalSlice) were consolidated into `GenericProductSlice`, which handles any category using a single `products` array and a `category` parameter on each thunk call.

---

## Available Scripts

```bash
npm run dev       # Start dev server → http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## Connecting to the Backend

The Axios instance in `src/utils/APIKit.jsx` reads `import.meta.env.VITE_API_URL` (set in the active env file) to determine the API Gateway URL. Start the backend before running the frontend.

`RefreshToken.jsx` automatically intercepts `401` responses and retries requests with a refreshed access token — no manual token management needed.

See [Backend setup instructions](../Backend/README.md) for how to start all services.

---

## Environment

Vite loads `.env.development` for `npm run dev` and `.env.production` for `npm run build`.

| File | `VITE_API_URL` |
|---|---|
| `.env.development` | `http://localhost:3000/api` |
| `.env.production` | `https://yourdomain.com/api` |

Neither file is committed to git. Update `FrontEnd/.env.production` with your real production domain before building for deployment.

```bash
npm run dev      # → http://localhost:5173, uses .env.development
npm run build    # → dist/, uses .env.production
npm run preview  # preview the production build locally
```
