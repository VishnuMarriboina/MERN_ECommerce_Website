import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBelt } from "../../Redux/slices/BeltSlice";
import { addToCart } from "../../Redux/slices/CartSlice";
import CustomModal from "../../components/CustomModal";
import defaultBelt from "../../assets/Belt.jpg";

export default function Belts() {
  const dispatch = useDispatch();
  const { data: belts, loading, error } = useSelector((state) => state.belt);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    dispatch(fetchBelt());
  }, [dispatch]);

  // Get all unique values for a specific attribute across all variants
  const getUniqueValues = (variants, attribute) => {
    const values = variants?.map((v) => v[attribute]).filter(Boolean) || [];
    return [...new Set(values)];
  };

  // Get available options based on current selections
  const getAvailableOptions = (product, attribute, currentSelections) => {
    const productId = product._id || product.id;
    const selections = currentSelections || selectedVariants[productId] || {};

    // Filter variants based on other selected attributes
    let filteredVariants = product.variants || [];

    Object.keys(selections).forEach((key) => {
      if (key !== attribute && selections[key]) {
        filteredVariants = filteredVariants.filter(
          (v) => v[key] === selections[key]
        );
      }
    });

    return getUniqueValues(filteredVariants, attribute);
  };

  // Find the matching variant based on selections
  const getMatchingVariant = (product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};

    if (!product.variants || product.variants.length === 0) {
      return null;
    }

    // If no selections, return first variant
    if (Object.keys(selections).length === 0) {
      // return product.variants[0];
          return null;
    }

    // Find variant that matches all selections
    const matchingVariant = product.variants.find((variant) => {
      return Object.keys(selections).every(
        (key) => !selections[key] || variant[key] === selections[key]
      );
    });

    return matchingVariant || null;
  };





  // Handle selection change with toggle functionality
  const handleSelectionChange = (productId, attribute, value) => {
    setSelectedVariants((prev) => {
      const currentSelections = prev[productId] || {};

      // Toggle: if clicking the same value, deselect it
      const newValue = currentSelections[attribute] === value ? null : value;

      const newSelections = {
        ...currentSelections,
        [attribute]: newValue,
      };

      // Remove null values
      Object.keys(newSelections).forEach((key) => {
        if (newSelections[key] === null) {
          delete newSelections[key];
        }
      });

      // Find the product
      const product = getBeltArray().find((p) => (p._id || p.id) === productId);

      if (!product) return prev;

      // If deselecting, just return the new selections
      if (newValue === null) {
        return {
          ...prev,
          [productId]: newSelections,
        };
      }

      // Check if this combination exists
      const matchingVariant = product.variants.find((variant) => {
        return Object.keys(newSelections).every(
          (key) => variant[key] === newSelections[key]
        );
      });

      // If no matching variant, reset dependent selections
      if (!matchingVariant) {
        // Keep only the current attribute selection
        return {
          ...prev,
          [productId]: {
            [attribute]: value,
          },
        };
      }

      return {
        ...prev,
        [productId]: newSelections,
      };
    });
  };

  // Get display data for a product card
  const getDisplayDataold = (product) => {
    const variant = getMatchingVariant(product);
    return {
      ...product,
      ...(variant || {}),
    };
  };


    const getDisplayData = (product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};
    const variant = getMatchingVariant(product);

    const hasAllSelections =
      selections.size && selections.dial_color && selections.strap_material;

    // ⛔ No complete selection → hide variant stock
    if (!hasAllSelections || !variant) {
      return {
        ...product,
        count: null,
        cost: null,
        image_url: product.image_url || null,
      };
    }

    // ✅ Selected variant only
    return {
      ...product,
      ...variant,
    };
  };

  // Check if a specific option is available
  const isOptionAvailable = (product, attribute, value) => {
    const availableOptions = getAvailableOptions(product, attribute);
    return availableOptions.includes(value);
  };

  const getBeltArray = () => {
    if (Array.isArray(belts)) {
      return belts;
    } else if (belts && typeof belts === "object") {
      if (belts.belts && Array.isArray(belts.belts)) return belts.belts;
      if (belts.data && Array.isArray(belts.data)) return belts.data;
      if (belts.items && Array.isArray(belts.items)) return belts.items;
      if (belts.results && Array.isArray(belts.results)) return belts.results;
    }
    return [];
  };

  const handleCart = async (displayData, product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};

    // Check required fields for belts: size and color
    const hasAllSelections = selections.size && selections.color;

    if (!hasAllSelections) {
      setModalTitle("⚠️ Selection Required");
      setModalMessage("Please select Size and Color before adding to cart.");
      setModalType("error");
      setModalOpen(true);
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
      return;
    }

    const variantId = displayData._id || displayData.id;
    const productModel = product.category || "Belts";

    const result = await dispatch(
      addToCart(productId, variantId, productModel)
    );

    if (result?.success) {
      setModalTitle("✅ Added to Cart");
      setModalMessage(
        `${product.brand || "Item"} (${displayData.size || "Size N/A"}, ${
          displayData.color || "Color N/A"
        }) has been added to your cart.\n\nQuantity in cart: ${1}`
      );
      setModalType("success");

      setSelectedVariants((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    } else {
      setModalTitle("❌ Failed to Add");
      setModalMessage("Unable to add this item to the cart. Please try again.");
      setModalType("error");
    }

    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
    }, 2500);
  };

  const beltArray = getBeltArray();

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading Belts...</p>
        </div>
      ) : error && beltArray.length === 0 ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Belt Collection</h1>
            <p style={styles.pageSubtitle}>
              Explore our premium collection of stylish and durable belts
            </p>
          </div>

          {error && beltArray.length > 0 && (
            <div style={styles.warningBanner}>
              <strong>⚠️ Warning:</strong> {error} (but data loaded
              successfully)
            </div>
          )}

          {beltArray.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📦</div>
              <h3 style={styles.emptyTitle}>No Belts Available</h3>
              <p style={styles.emptyMessage}>
                Check back later for new arrivals!
              </p>
            </div>
          ) : (
            <div style={styles.cardGrid}>
              {beltArray.map((product, index) => {
                const productId = product._id || product.id || index;
                const displayData = getDisplayData(product);
                const selections = selectedVariants[productId] || {};

                // Get all available options for each attribute
                const availableSizes = getUniqueValues(
                  product.variants,
                  "size"
                );
                const availableColors = getAvailableOptions(
                  product,
                  "color",
                  selections
                );

                // Check if all selections are made
                const hasAllSelections = selections.size && selections.color;

                return (
                  <div key={productId} style={styles.card}>
                    <div style={styles.imageContainer}>
                      <img
                        src={displayData.image_url || defaultBelt}
                        alt={`${product.brand || "Belt"}`}
                        style={styles.image}
                        onError={(e) => {
                          e.target.src = defaultBelt;
                        }}
                      />
                      {displayData.count !== null && displayData.count < 5 && displayData.count > 0 && (
                        <div style={styles.lowStockBadge}>
                          Only {displayData.count} left
                        </div>
                      )}
                      {displayData.count === 0 && (
                        <div style={styles.outOfStockBadge}>Out of Stock</div>
                      )}
                    </div>

                    <div style={styles.cardContent}>
                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                          {product.brand || "Unknown Brand"}
                        </h3>
                        <span style={styles.price}>
                          ₹{displayData.cost || product?.variants[0]?.cost}
                        </span>
                      </div>

                      {/* Variant Selectors */}
                      <div style={styles.variantSection}>
                        {/* Size Selector */}
                        {availableSizes.length > 0 && (
                          <div style={styles.selectorGroup}>
                            <label style={styles.selectorLabel}>
                              Size:{" "}
                              {!selections.size && (
                                <span style={styles.requiredText}>
                                  *Required
                                </span>
                              )}
                            </label>
                            <div style={styles.optionButtons}>
                              {availableSizes.map((size) => {
                                const isAvailable = isOptionAvailable(
                                  product,
                                  "size",
                                  size
                                );
                                const isSelected = selections.size === size;

                                return (
                                  <button
                                    key={size}
                                    style={{
                                      ...styles.optionButton,
                                      ...(isSelected &&
                                        styles.optionButtonSelected),
                                      ...(!isAvailable &&
                                        styles.optionButtonDisabled),
                                    }}
                                    onClick={() =>
                                      isAvailable &&
                                      handleSelectionChange(
                                        productId,
                                        "size",
                                        size
                                      )
                                    }
                                    disabled={!isAvailable}
                                    title={
                                      isSelected
                                        ? "Click to deselect"
                                        : "Click to select"
                                    }
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Color Selector */}
                        {availableColors.length > 0 && (
                          <div style={styles.selectorGroup}>
                            <label style={styles.selectorLabel}>
                              Color:{" "}
                              {!selections.color && (
                                <span style={styles.requiredText}>
                                  *Required
                                </span>
                              )}
                            </label>
                            <div style={styles.optionButtons}>
                              {getUniqueValues(product.variants, "color").map(
                                (color) => {
                                  const isAvailable =
                                    availableColors.includes(color);
                                  const isSelected = selections.color === color;

                                  return (
                                    <button
                                      key={color}
                                      style={{
                                        ...styles.colorButton,
                                        ...(!isAvailable &&
                                          styles.colorButtonDisabled),
                                      }}
                                      onClick={() =>
                                        isAvailable &&
                                        handleSelectionChange(
                                          productId,
                                          "color",
                                          color
                                        )
                                      }
                                      disabled={!isAvailable}
                                      title={
                                        isSelected ? "Click to deselect" : color
                                      }
                                    >
                                      <div
                                        style={{
                                          ...styles.colorCircle,
                                          backgroundColor:
                                            color?.toLowerCase() || "#ccc",
                                          ...(isSelected &&
                                            styles.colorCircleSelected),
                                        }}
                                      />
                                      <span style={styles.colorName}>
                                        {color}
                                      </span>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Width</span>
                          <span style={styles.detailValue}>
                            {product.width || "N/A"}
                          </span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Material</span>
                          <span style={styles.detailValue}>
                            {product.type_of_material || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div style={styles.extraDetails}>
                        <span style={styles.extraText}>
                          <strong>Buckle:</strong>{" "}
                          {product.buckle_type || "N/A"}
                        </span>
                      </div>

                      <button
                        style={{
                          ...styles.addButton,
                          ...((displayData.count === 0 || !hasAllSelections) &&
                            styles.addButtonDisabled),
                        }}
                        onClick={() => handleCart(displayData, product)}
                        disabled={displayData.count === 0 || !hasAllSelections}
                      >
                        <svg
                          style={styles.cartIcon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {displayData.count === 0
                          ? "Out of Stock"
                          : !hasAllSelections
                          ? "Select Options First"
                          : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <CustomModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "1rem",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #8b5cf6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "1.1rem",
    color: "#64748b",
    fontWeight: 500,
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "2rem",
  },
  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  errorTitle: {
    fontSize: "1.5rem",
    color: "#1e293b",
    marginBottom: "0.5rem",
    fontWeight: 600,
  },
  errorMessage: {
    fontSize: "1rem",
    color: "#64748b",
    textAlign: "center",
    maxWidth: "500px",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "0.5rem",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    fontWeight: 400,
    marginTop: "0.5rem",
  },
  warningBanner: {
    padding: "1rem",
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeaa7",
    borderRadius: "10px",
    marginBottom: "2rem",
    color: "#856404",
    fontSize: "0.95rem",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40vh",
    padding: "2rem",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    color: "#1e293b",
    marginBottom: "0.5rem",
    fontWeight: 600,
  },
  emptyMessage: {
    fontSize: "1rem",
    color: "#64748b",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "250px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  lowStockBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#ff9800",
    color: "white",
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  outOfStockBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#f44336",
    color: "white",
    padding: "0.4rem 0.8rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  cardContent: {
    padding: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardTitle: {
    margin: "0",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#333",
  },
  price: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#8b5cf6",
  },
  variantSection: {
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e0e0e0",
  },
  selectorGroup: {
    marginBottom: "1rem",
  },
  selectorLabel: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#555",
    marginBottom: "0.5rem",
  },
  requiredText: {
    fontSize: "0.75rem",
    color: "#f44336",
    fontWeight: "500",
    marginLeft: "0.5rem",
  },
  optionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  optionButton: {
    padding: "0.5rem 1rem",
    border: "2px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "white",
    color: "#333",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  optionButtonSelected: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
    color: "white",
  },
  optionButtonDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
    color: "#999",
    cursor: "not-allowed",
    textDecoration: "line-through",
    opacity: "0.5",
  },
  colorButton: {
    padding: "0.5rem 0.75rem",
    border: "2px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "white",
    color: "#333",
    fontSize: "0.85rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  colorButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: "#f5f5f5",
  },
  colorCircle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid #ddd",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  colorCircleSelected: {
    border: "3px solid #8b5cf6",
    boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.2)",
  },
  colorName: {
    fontSize: "0.85rem",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  detailLabel: {
    fontSize: "0.8rem",
    color: "#888",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: "0.95rem",
    color: "#333",
    fontWeight: "500",
  },
  extraDetails: {
    marginBottom: "1rem",
  },
  extraText: {
    fontSize: "0.9rem",
    color: "#666",
  },
  addButton: {
    width: "100%",
    padding: "0.875rem",
    backgroundColor: "#8b5cf6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "background-color 0.2s",
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  cartIcon: {
    width: "20px",
    height: "20px",
  },
};
