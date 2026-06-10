/// <reference types="vite/client" />
import React from "react";

import shirt from "../../assets/shirt_icon.png";
import Shoe from "../../assets/shoe.jpg";
import Belt from "../../assets/Belt.jpg";
import Watch from "../../assets/watch.jpg";
import Sandal from "../../assets/slippers.webp";
import tshirt from "../../assets/Tshirt.jpg";

/* ─── Cart ───────────────────────────────────────────────────────────── */
export const CHECKOUT_STEPS = ["Cart", "Payment", "Confirmed"];

export const FREE_SHIPPING_THRESHOLD = 499;
export const DELIVERY_FEE = 49;
export const GST_PERCENT = 18;

export const PAYMENT_TYPES = [
  {
    id: "Online",
    title: "Online Payment",
    desc: "UPI, Net Banking, or Credit Card",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "COD",
    title: "Cash on Delivery",
    desc: "Pay when you receive your order",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
      </svg>
    ),
  },
];

export const PAYMENT_MODES = [
  {
    id: "UPI",
    label: "UPI",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "NetBanking",
    label: "Net Banking",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: "CreditCard",
    label: "Credit Card",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

/* ─── Orders ─────────────────────────────────────────────────────────── */
export const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const ORDER_STATUS_COLORS: Record<string, string> = {
  Confirmed: "#10b981",
  Pending: "#f59e0b",
  Shipped: "#3b82f6",
  Delivered: "#6366f1",
  Cancelled: "#ef4444",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  tshirt: tshirt,
  shirt: shirt,
  shirts: shirt,
  t_shirt: tshirt,
  "t-shirt": tshirt,
  belt: Belt,
  watch: Watch,
  watches: Watch,
  shoe: Shoe,
  shoes: Shoe,
  sandal: Sandal,
  sandals: Sandal,
};

/* ─── Profile / UserManagement ───────────────────────────────────────── */
export const AVATAR_COLORS = [
  "#6366f1",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];
