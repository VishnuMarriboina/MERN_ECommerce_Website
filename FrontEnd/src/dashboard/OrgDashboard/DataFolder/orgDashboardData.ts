/* ─── AdminDashboard ─────────────────────────────────────────────────── */
export const BREADCRUMB_MAP: Record<string, string[]> = {
  products: ["Dashboard", "Product Management"],
  catalog:  ["Dashboard", "Product Catalog"],
  orders:   ["Dashboard", "Order Management"],
  users:    ["Dashboard", "User Management"],
  contacts: ["Dashboard", "Contact Messages"],
  profile:  ["Dashboard", "Profile"],
};

/* ─── Sidebar ────────────────────────────────────────────────────────── */
export const SIDEBAR_TABS = [
  { key: "home",     label: "Home",            icon: "🏠" },
  { key: "products", label: "Products",         icon: "📦" },
  { key: "catalog",  label: "Product Catalog",  icon: "🗂️" },
  { key: "orders",   label: "Orders",           icon: "🛒" },
  { key: "users",    label: "Users",            icon: "👥" },
  { key: "contacts", label: "Contacts",         icon: "📨" },
  { key: "profile",  label: "Profile",          icon: "👤" },
];

/* ─── AdminHome ──────────────────────────────────────────────────────── */
export const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export const ADMIN_STATUS_COLORS: Record<string, string> = {
  Pending:   "#f59e0b",
  Confirmed: "#6366f1",
  Shipped:   "#3b82f6",
  Delivered: "#10b981",
  Cancelled: "#ef4444",
};

export const CATEGORY_COLORS = [
  "#6366f1","#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899",
];

/* ─── OrderManagement ────────────────────────────────────────────────── */
export const ORDER_STATUS_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

export const ORDER_FILTER_OPTIONS = [
  "All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled",
];

/* ─── ProductManagement ──────────────────────────────────────────────── */
export const CAT_ICONS: Record<string, string> = {
  Shirts:    "👔",
  "T-Shirts": "👕",
  Shoes:     "👟",
  Sandals:   "🩴",
  Belts:     "🪢",
  Watches:   "⌚",
};

export const OP_LABELS: Record<string, { success: string; failure: string }> = {
  addProduct:    { success: "Product Added!",   failure: "Add Failed"    },
  updateProduct: { success: "Product Updated!", failure: "Update Failed" },
  deleteProduct: { success: "Product Deleted!", failure: "Delete Failed" },
  addVariant:    { success: "Variant Added!",   failure: "Add Failed"    },
  updateVariant: { success: "Variant Updated!", failure: "Update Failed" },
  deleteVariant: { success: "Variant Deleted!", failure: "Delete Failed" },
};
