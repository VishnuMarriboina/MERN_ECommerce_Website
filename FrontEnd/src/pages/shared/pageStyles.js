/* Premium product page style system — used by all pages inside pages/ */

export const PS = {
  /* ── Page shell ─────────────────────────────────────────────── */
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },

  /* ── Hero header ─────────────────────────────────────────────── */
  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a5f 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  heroInner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "1.1rem 2rem 1.4rem",
  },
  heroBreadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.7rem",
    fontWeight: 500,
    color: "#475569",
    marginBottom: "0.9rem",
    letterSpacing: "0.3px",
  },
  heroBreadcrumbSep: {
    color: "#2d3f55",
    fontSize: "0.75rem",
    lineHeight: 1,
  },
  heroBreadcrumbLink: {
    cursor: "pointer",
    color: "#475569",
    transition: "color 0.15s",
  },
  heroContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  heroIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroTitleRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  heroTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#f1f5f9",
    letterSpacing: "-0.3px",
    lineHeight: 1.15,
  },
  heroSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.8rem",
    lineHeight: 1.5,
  },
  heroCount: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "20px",
    color: "#94a3b8",
    fontSize: "0.78rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  /* ── Main content area ────────────────────────────────────────── */
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
  },

  /* ── Warning banner ───────────────────────────────────────────── */
  warningBanner: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    borderLeft: "4px solid #f59e0b",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "1.5rem",
    fontSize: "0.875rem",
    color: "#92400e",
    lineHeight: 1.5,
  },

  /* ── Product card ─────────────────────────────────────────────── */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(15,23,42,0.07), 0 6px 20px rgba(15,23,42,0.04)",
    border: "1px solid #f0f4f8",
    display: "flex",
    flexDirection: "column",
  },

  /* ── Card image — square 1:1 ──────────────────────────────────── */
  imageContainer: {
    position: "relative",
    width: "100%",
    paddingBottom: "78%",
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
    flexShrink: 0,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  /* ── Stock badges ─────────────────────────────────────────────── */
  lowStockBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(255,251,235,0.92)",
    color: "#b45309",
    border: "1px solid #fde68a",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.67rem",
    fontWeight: 700,
    letterSpacing: "0.3px",
    backdropFilter: "blur(6px)",
  },
  outOfStockOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(15,23,42,0.58)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockText: {
    color: "#f8fafc",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    padding: "7px 18px",
    border: "1.5px solid rgba(248,250,252,0.40)",
    borderRadius: "4px",
  },

  /* ── Card body — compact ──────────────────────────────────────── */
  cardBody: {
    padding: "0.875rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",
    flex: 1,
  },

  /* ── Brand + price row ────────────────────────────────────────── */
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  brand: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.1px",
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
    minWidth: 0,
  },
  priceBadge: {
    padding: "3px 9px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "7px",
    fontSize: "0.85rem",
    fontWeight: 800,
    color: "#065f46",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  /* ── Subtle separator line ────────────────────────────────────── */
  divider: {
    height: "1px",
    backgroundColor: "#f4f6f9",
    flexShrink: 0,
  },

  /* ── Variant section ─────────────────────────────────────────── */
  variantSection: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  /* Inline row: label sits on the same line as pills */
  variantRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "7px",
  },
  variantInlineLabel: {
    fontSize: "0.62rem",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    whiteSpace: "nowrap",
    paddingTop: "5px",
    minWidth: "34px",
    flexShrink: 0,
    lineHeight: 1,
  },
  requiredDot: {
    display: "inline-block",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    backgroundColor: "#f87171",
    verticalAlign: "middle",
    marginLeft: "3px",
    flexShrink: 0,
  },
  variantBtnRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    flex: 1,
  },
  variantBtn: {
    padding: "3px 9px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    color: "#475569",
    fontSize: "0.75rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    lineHeight: 1.5,
  },
  variantBtnSelected: {
    border: "1.5px solid #3b82f6",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
  },
  variantBtnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
    backgroundColor: "#f8fafc",
  },

  /* ── Spec line — single compact text row ─────────────────────── */
  specLine: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    lineHeight: 1.4,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  /* ── Add to Cart button ──────────────────────────────────────── */
  addBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    width: "100%",
    padding: "10px 14px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.2px",
    marginTop: "auto",
  },
  addBtnDisabled: {
    background: "#e2e8f0",
    color: "#94a3b8",
    cursor: "not-allowed",
  },
  cartIconStyle: {
    width: "14px",
    height: "14px",
    flexShrink: 0,
  },

  /* ── Skeleton ────────────────────────────────────────────────── */
  skeletonCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #f0f4f8",
    boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
  },
  skeletonBody: {
    padding: "0.875rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  skeletonLine: {
    borderRadius: "6px",
  },

  /* ── Error state ─────────────────────────────────────────────── */
  errorState: {
    maxWidth: "480px",
    margin: "3rem auto",
    backgroundColor: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: "18px",
    padding: "3rem 2rem",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(239,68,68,0.06)",
  },
  errorIconWrap: {
    width: "68px",
    height: "68px",
    backgroundColor: "#fef2f2",
    border: "2px solid #fecaca",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.25rem",
    fontSize: "1.75rem",
  },
  errorTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#991b1b",
    margin: "0 0 0.5rem",
  },
  errorText: {
    fontSize: "0.875rem",
    color: "#b91c1c",
    margin: 0,
    lineHeight: 1.55,
  },

  /* ── Empty state ─────────────────────────────────────────────── */
  emptyState: {
    textAlign: "center",
    padding: "5rem 2rem",
  },
  emptyIconWrap: {
    width: "80px",
    height: "80px",
    backgroundColor: "#f1f5f9",
    border: "2px solid #e2e8f0",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    fontSize: "2.25rem",
  },
  emptyTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 0.5rem",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    margin: 0,
    lineHeight: 1.6,
  },
};
