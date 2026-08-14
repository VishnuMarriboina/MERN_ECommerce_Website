import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../Redux/features/cart";
import { useProductVariants } from "../../hooks/useProductVariants";
import { usePageModal } from "./usePageModal";
import CustomModal from "../../components/CustomModal";
import { PS } from "./pageStyles";

// Fields to skip when showing product-level specs
const SKIP_FIELDS = new Set([
  "_id", "__v", "category", "brand", "variants", "addedBy", "createdAt", "updatedAt",
]);

// Fields to skip when building variant selectors
const VARIANT_META = new Set(["_id", "__v", "cost", "count", "image_url", "rating", "ratingCount", "purchaseCount"]);

// Convert snake_case / camelCase keys to Title Case labels
const toLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { product, defaultImage, backPath } = location.state || {};

  const { modal, showModal, closeModal } = usePageModal();
  const {
    selectedVariants,
    getUniqueValues,
    getAvailableOptions,
    handleSelectionChange,
    getDisplayData,
    clearSelections,
  } = useProductVariants();

  const [addingToCart, setAddingToCart] = useState(false);

  // Guard: no product passed via state
  if (!product) {
    return (
      <div style={S.errorPage}>
        <div style={S.errorBox}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ margin: "0 0 8px", color: "#1e293b" }}>Product not found</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            No product data was provided. Please navigate from a product listing.
          </p>
          <button style={S.backBtn} onClick={() => navigate(backPath || -1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const productId = product._id || product.id;
  const selections = selectedVariants[productId] || {};

  // Dynamically detect selectable variant keys from first variant (support nested attributes)
  const firstVariant = product.variants?.[0];
  const variantSource = firstVariant?.attributes || firstVariant || {};
  const variantKeys = Object.keys(variantSource).filter(
    (k) => !VARIANT_META.has(k) && typeof variantSource[k] !== "object"
  );

  const hasAllSelections =
    variantKeys.length === 0 || variantKeys.every((k) => selections[k]);

  const displayData = getDisplayData(product);

  // Current image: prefer selected variant image, else first variant, else default
  const currentImage =
    displayData.image_url ||
    product.variants?.[0]?.image_url ||
    defaultImage;

  // Stock from selected variant or first variant
  const stockCount =
    displayData.count !== undefined
      ? displayData.count
      : product.variants?.[0]?.count;

  const isOutOfStock = stockCount === 0;

  // Price: selected variant cost, or lowest from variants
  const lowestCost = product.variants?.reduce((min, v) => {
    const c = Number(v.cost);
    return !isNaN(c) && c < min ? c : min;
  }, Infinity);

  const displayCost =
    displayData.cost !== undefined
      ? displayData.cost
      : lowestCost !== Infinity
      ? lowestCost
      : "N/A";

  // Collect product-level spec fields (skip meta + variant fields)
  const specEntries = Object.entries(product).filter(
    ([key, val]) =>
      !SKIP_FIELDS.has(key) &&
      val !== null &&
      val !== undefined &&
      val !== "" &&
      typeof val !== "object"
  );

  // Category breadcrumb label
  const category = product.category || "Products";

  const handleAddToCart = async () => {
    if (variantKeys.length > 0 && !hasAllSelections) {
      showModal(
        "error",
        "⚠️ Selection Required",
        "Please select all options before adding to cart."
      );
      return;
    }

    setAddingToCart(true);
    const result = await addItem({
      productId,
      variantId: displayData._id || displayData.id,
      productModel: product.category,
    });
    setAddingToCart(false);

    if (result.meta.requestStatus === "fulfilled") {
      showModal(
        "success",
        "✅ Added to Cart",
        `${product.brand || "Item"} has been added to your cart.`
      );
      clearSelections(productId);
    } else {
      showModal(
        "error",
        "❌ Failed to Add",
        "Unable to add this item to the cart. Please try again."
      );
    }
  };

  return (
    <div style={S.page}>
      {/* Top bar: back + breadcrumb */}
      <div style={S.topBar}>
        <button style={S.backButton} onClick={() => navigate(backPath || -1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <nav style={S.breadcrumb}>
          <span style={S.breadcrumbLink} onClick={() => navigate("/")}>Home</span>
          <span style={S.breadcrumbSep}>›</span>
          <span style={S.breadcrumbLink} onClick={() => navigate(backPath || -1)}>
            {category}
          </span>
          <span style={S.breadcrumbSep}>›</span>
          <span style={S.breadcrumbCurrent}>{product.brand || "Product"}</span>
        </nav>
      </div>

      {/* Main content */}
      <div style={S.contentWrap} className="pd-content-wrap">
        {/* LEFT: Image panel */}
        <div style={S.imagePanel}>
          <div style={S.imageBg}>
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.brand || "Product"}
                style={S.productImage}
                onError={(e) => {
                  if (defaultImage) e.target.src = defaultImage;
                }}
              />
            ) : (
              <div style={S.imagePlaceholder}>
                <span style={{ fontSize: 64 }}>🛍️</span>
              </div>
            )}

            {/* Stock badge overlay */}
            {isOutOfStock && (
              <div style={PS.outOfStockOverlay}>
                <span style={PS.outOfStockText}>Out of Stock</span>
              </div>
            )}

            {!isOutOfStock && stockCount !== undefined && stockCount < 5 && stockCount > 0 && (
              <div style={S.lowStockBadgeDetail}>Only {stockCount} left!</div>
            )}
          </div>
        </div>

        {/* RIGHT: Details panel */}
        <div style={S.detailsPanel}>
          {/* Brand */}
          <h1 style={S.brandName}>{product.brand || "Unknown Brand"}</h1>

          {/* Category pill */}
          <span style={S.categoryPill}>{category}</span>

          {/* Price + stock row */}
          <div style={S.priceStockRow}>
            <div style={S.priceBlock}>
              <span style={S.priceLabel}>Price</span>
              <span style={S.priceValue}>
                ₹{displayCost}
                {lowestCost !== Infinity && variantKeys.length > 0 && !hasAllSelections && (
                  <span style={S.priceNote}> onwards</span>
                )}
              </span>
            </div>
            <div style={S.stockBlock}>
              {isOutOfStock ? (
                <span style={S.stockOut}>Out of Stock</span>
              ) : stockCount !== undefined ? (
                <span style={S.stockIn}>{stockCount} in stock</span>
              ) : null}
            </div>
          </div>

          {/* Rating row — shows selected variant's stats, falls back to first variant */}
          {(() => {
            const variantRating = displayData.rating ?? product.variants?.[0]?.rating ?? null;
            const variantRatingCount = displayData.ratingCount ?? product.variants?.[0]?.ratingCount ?? 0;
            const variantPurchaseCount = displayData.purchaseCount ?? product.variants?.[0]?.purchaseCount ?? 0;
            return (
              <div style={S.ratingRow}>
                <span style={S.starIcon}>★</span>
                <span style={S.ratingValue}>{variantRating != null ? variantRating : "N/A"}</span>
                <span style={S.ratingLabel}>Rating</span>
                {variantRatingCount > 0 && (
                  <span style={S.ratingCount}>({variantRatingCount} {variantRatingCount === 1 ? "review" : "reviews"})</span>
                )}
                {variantPurchaseCount > 0 && (
                  <span style={S.purchaseCount}> · {variantPurchaseCount} sold</span>
                )}
              </div>
            );
          })()}

          <div style={S.divider} />

          {/* Product specs */}
          {specEntries.length > 0 && (
            <div style={S.specsSection}>
              <h3 style={S.sectionTitle}>Specifications</h3>
              <div style={S.specsGrid}>
                {specEntries.map(([key, val]) => (
                  <div key={key} style={S.specRow}>
                    <span style={S.specKey}>{toLabel(key)}</span>
                    <span style={S.specVal}>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variant selectors */}
          {variantKeys.length > 0 && (
            <div style={S.variantSection}>
              <h3 style={S.sectionTitle}>Select Options</h3>
              {variantKeys.map((key) => {
                const allOptions = getUniqueValues(product.variants, key);
                const availableOptions = getAvailableOptions(product, key);
                const availableSet = new Set(availableOptions);
                if (!allOptions || allOptions.length === 0) return null;

                return (
                  <div key={key} style={S.variantGroup}>
                    <div style={S.variantLabelRow}>
                      <span style={S.variantLabel}>{toLabel(key)}</span>
                      {!selections[key] && (
                        <span style={S.requiredDot} />
                      )}
                    </div>
                    <div style={S.variantPillRow}>
                      {allOptions.map((val) => {
                        const strVal = String(val);
                        const isAvailable = availableSet.has(val);
                        const isSelected = selections[key] === val;
                        return (
                          <button
                            key={strVal}
                            style={{
                              ...PS.variantBtn,
                              ...(isSelected ? PS.variantBtnSelected : {}),
                              ...(!isAvailable ? PS.variantBtnDisabled : {}),
                              fontSize: "0.85rem",
                              padding: "5px 14px",
                            }}
                            onClick={() =>
                              isAvailable &&
                              handleSelectionChange(productId, key, val, product)
                            }
                            disabled={!isAvailable}
                          >
                            {strVal}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add to Cart button */}
          <button
            style={{
              ...S.addToCartBtn,
              ...(isOutOfStock || !hasAllSelections ? S.addToCartDisabled : {}),
            }}
            onClick={handleAddToCart}
            disabled={isOutOfStock || !hasAllSelections || addingToCart}
          >
            {addingToCart ? (
              "Adding..."
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : !hasAllSelections ? (
              "Select All Options First"
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <CustomModal
        isOpen={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />

      <style>{`
        @media (max-width: 768px) {
          .pd-content-wrap {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    padding: "24px",
  },
  errorPage: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  errorBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #f1f5f9",
    borderRadius: 16,
    padding: "48px 40px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(15,23,42,0.08)",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 28,
    flexWrap: "wrap",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    color: "#374151",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
    transition: "all 0.15s ease",
  },
  backBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.8rem",
    color: "#64748b",
  },
  breadcrumbLink: {
    color: "#6366f1",
    cursor: "pointer",
    fontWeight: 500,
    textDecoration: "none",
  },
  breadcrumbSep: {
    color: "#cbd5e1",
    fontSize: "0.75rem",
  },
  breadcrumbCurrent: {
    color: "#0f172a",
    fontWeight: 600,
  },
  contentWrap: {
    display: "flex",
    gap: 32,
    alignItems: "flex-start",
    maxWidth: 1200,
    margin: "0 auto",
  },
  imagePanel: {
    flex: "0 0 40%",
    maxWidth: "40%",
  },
  imageBg: {
    position: "relative",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #f1f5f9",
    aspectRatio: "1 / 1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "24px",
    boxSizing: "border-box",
  },
  imagePlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  lowStockBadgeDetail: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(255,247,237,0.95)",
    color: "#c2410c",
    border: "1px solid #fed7aa",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.3px",
    backdropFilter: "blur(6px)",
  },
  detailsPanel: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    border: "1px solid #f1f5f9",
    padding: "32px",
    boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  brandName: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
  },
  categoryPill: {
    display: "inline-block",
    padding: "4px 14px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 20,
    color: "#1d4ed8",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  priceStockRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  priceBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  priceLabel: {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  priceValue: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.5px",
    lineHeight: 1,
  },
  priceNote: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#94a3b8",
  },
  stockBlock: {
    display: "flex",
    alignItems: "center",
  },
  stockIn: {
    padding: "5px 14px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 20,
    color: "#15803d",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  stockOut: {
    padding: "5px 14px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 20,
    color: "#dc2626",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  starIcon: {
    color: "#f59e0b",
    fontSize: "1.1rem",
    lineHeight: 1,
  },
  ratingValue: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0f172a",
  },
  ratingLabel: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    fontWeight: 500,
  },
  ratingCount: {
    fontSize: "0.8rem",
    color: "#64748b",
  },
  purchaseCount: {
    fontSize: "0.8rem",
    color: "#10b981",
    fontWeight: 600,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    flexShrink: 0,
  },
  specsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },
  specsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  specRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid #f8fafc",
  },
  specKey: {
    fontSize: "0.82rem",
    color: "#64748b",
    fontWeight: 500,
    flex: "0 0 45%",
  },
  specVal: {
    fontSize: "0.82rem",
    color: "#0f172a",
    fontWeight: 600,
    flex: "0 0 55%",
    textAlign: "right",
  },
  variantSection: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  variantGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  variantLabelRow: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  variantLabel: {
    fontSize: "0.78rem",
    fontWeight: 700,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  requiredDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "#f87171",
    flexShrink: 0,
  },
  variantPillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  addToCartBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "14px 20px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.2px",
    marginTop: "auto",
    boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
    transition: "all 0.15s ease",
  },
  addToCartDisabled: {
    background: "#e2e8f0",
    color: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
  },
};
