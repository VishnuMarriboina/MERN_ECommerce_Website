import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShirt } from "../../Redux/slices/ShirtSlice";
import { addToCart } from "../../Redux/slices/CartSlice";
import defaultShirt from "../../assets/shirt_icon.png";
import CustomModal from "../../components/CustomModal";

export default function Shirts() {
  const dispatch = useDispatch();
  const {
    data: shirts,
    loading,
    error,
    errorMsg,
    successMsg,
  } = useSelector((state) => state.shirt);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    dispatch(fetchShirt());
  }, [dispatch, successMsg, errorMsg]);

  const handleCart = async (displayData, product) => {
    // Get the variant ID from the selected variant
    const variantId = displayData._id || displayData.id;
    const productId = product._id || product.id;
    const productModel = product.category || displayData.category;

    // Check if all required selections are made
    const productIdKey = product._id || product.id;
    const selections = selectedVariants[productIdKey] || {};
    const hasAllSelections =
      selections.size && selections.color && selections.fit;

    if (!hasAllSelections) {
      setModalTitle("⚠️ Selection Required");
      setModalMessage(
        "Please select Size, Color, and Fit before adding to cart."
      );
      setModalType("error");
      setModalOpen(true);
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
      return;
    }
    // Pass data to the backend
    const result = await dispatch(
      addToCart(productId, variantId, productModel)
    );

    if (result?.success) {
      setModalTitle("✅ Added to Cart");
      setModalMessage(
        `${product.brand || "Item"} (${displayData.size || "Size N/A"}, ${
          displayData.color || "Color N/A"
        }, ${
          displayData.fit || "Fit N/A"
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

  const getShirtArray = () => {
    if (Array.isArray(shirts)) {
      return shirts;
    } else if (shirts && typeof shirts === "object") {
      if (shirts.shirts && Array.isArray(shirts.shirts)) return shirts.shirts;
      if (shirts.data && Array.isArray(shirts.data)) return shirts.data;
      if (shirts.items && Array.isArray(shirts.items)) return shirts.items;
      if (shirts.results && Array.isArray(shirts.results))
        return shirts.results;
    }
    return [];
  };

  const shirtArray = getShirtArray();

  // Get all unique values for a specific attribute across all variants
  const getUniqueValues = (variants, attribute) => {
    const values = variants.map((v) => v[attribute]).filter(Boolean);
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
      const product = shirtArray.find((p) => (p._id || p.id) === productId);

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
  const getDisplayData = (product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};
    // const variant = getMatchingVariant(product);
    console.log("selections", selections);
    // const hasAllSelections =
    //   selections.size && selections.dial_color && selections.strap_material;

    // // ⛔ No complete selection → hide variant stock
    // if (!hasAllSelections || !variant) {
    //   return {
    //     ...product,
    //     count: null,
    //     // cost: null,
    //     // image_url: product.image_url || null,
    //   };
    // }

    // // ✅ Selected variant only
    // return {
    //   ...product,
    //   ...variant,
    // };

    const variant = getMatchingVariant(product);
    return {
      ...product,
      ...(variant || {}),
    };
  };

  // Check if a specific option is available
  const isOptionAvailable = (product, attribute, value) => {
    const availableOptions = getAvailableOptions(product, attribute);
    return availableOptions.includes(value);
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading Shirts...</p>
        </div>
      ) : error && shirtArray.length === 0 ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Shirt Collection</h1>
            <p style={styles.pageSubtitle}>
              Explore our comfortable and stylish shirt collection
            </p>
          </div>

          {error && shirtArray.length > 0 && (
            <div style={styles.warningBanner}>
              <strong>⚠️ Warning:</strong> {error} (but data loaded
              successfully)
            </div>
          )}

          {shirtArray.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}> 👔</div>
              <h3 style={styles.emptyTitle}>No Shirts Available</h3>
              <p style={styles.emptyMessage}>
                Check back later for new arrivals!
              </p>
            </div>
          ) : (
            <div style={styles.cardGrid}>
              {shirtArray.map((product, index) => {
                const productId = product._id || product.id || index;
                const displayData = getDisplayData(product);
                const selections = selectedVariants[productId] || {};

                console.log("Shirts", displayData);

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
                const availableFits = getAvailableOptions(
                  product,
                  "fit",
                  selections
                );

                // Check if all selections are made
                const hasAllSelections =
                  selections.size && selections.color && selections.fit;

                return (
                  <div key={productId} style={styles.card}>
                    <div style={styles.imageContainer}>
                      <img
                        src={displayData.image_url || defaultShirt}
                        alt={`${product.brand || "Product"}`}
                        style={styles.image}
                        onError={(e) => {
                          e.target.src = defaultShirt;
                        }}
                      />
                      {displayData.count !== null &&
                        displayData.count < 5 &&
                        displayData.count > 0 && (
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
                                        ...(isSelected &&
                                          styles.optionButtonSelected),
                                        ...(!isAvailable &&
                                          styles.optionButtonDisabled),
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
                                      {color}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}

                        {/* Fit Selector */}
                        {availableFits.length > 0 && (
                          <div style={styles.selectorGroup}>
                            <label style={styles.selectorLabel}>
                              Fit:{" "}
                              {!selections.fit && (
                                <span style={styles.requiredText}>
                                  *Required
                                </span>
                              )}
                            </label>
                            <div style={styles.optionButtons}>
                              {getUniqueValues(product.variants, "fit").map(
                                (fit) => {
                                  const isAvailable =
                                    availableFits.includes(fit);
                                  const isSelected = selections.fit === fit;

                                  return (
                                    <button
                                      key={fit}
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
                                          "fit",
                                          fit
                                        )
                                      }
                                      disabled={!isAvailable}
                                      title={
                                        isSelected
                                          ? "Click to deselect"
                                          : "Click to select"
                                      }
                                    >
                                      {fit}
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
                          <span style={styles.detailLabel}>Material</span>
                          <span style={styles.detailValue}>
                            {product.type_of_material || "N/A"}
                          </span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Sleeve</span>
                          <span style={styles.detailValue}>
                            {product.sleeve_type || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div style={styles.extraDetails}>
                        <span style={styles.extraText}>
                          <strong>Collar:</strong>{" "}
                          {product.collar_type || "N/A"}
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
    padding: "2rem",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
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
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "320px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
  },
  lowStockBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#ff9800",
    color: "white",
    padding: "0.5rem 0.9rem",
    borderRadius: "24px",
    fontSize: "0.8rem",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  outOfStockBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#f44336",
    color: "white",
    padding: "0.5rem 0.9rem",
    borderRadius: "24px",
    fontSize: "0.8rem",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  cardContent: {
    padding: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.2rem",
  },
  cardTitle: {
    margin: "0",
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  price: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#10b981",
  },
  variantSection: {
    marginBottom: "1.2rem",
    paddingBottom: "1.2rem",
    borderBottom: "1px solid #e2e8f0",
  },
  selectorGroup: {
    marginBottom: "1rem",
  },
  selectorLabel: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "0.5rem",
  },
  requiredText: {
    fontSize: "0.75rem",
    color: "#ef4444",
    fontWeight: "500",
    marginLeft: "0.5rem",
  },
  optionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    // backgroundColor:"red"
  },
  optionButton: {
    padding: "0.5rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#334155",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  optionButtonSelected: {
    backgroundColor: "#3b82f6",
    // borderColor: "#3b82f6",
    color: "white",
    transform: "scale(1.05)",
  },
  optionButtonDisabled: {
    backgroundColor: "#f8fafc",
    // borderColor: "#e2e8f0",
    color: "#94a3b8",
    cursor: "not-allowed",
    textDecoration: "line-through",
    opacity: "0.6",
  },
  colorButton: {
    padding: "0.5rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#334155",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1rem",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  detailLabel: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "0.05em",
  },
  detailValue: {
    fontSize: "0.925rem",
    color: "#334155",
    fontWeight: "500",
  },
  extraDetails: {
    marginBottom: "1.2rem",
    paddingTop: "0.5rem",
  },
  extraText: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  addButton: {
    width: "100%",
    padding: "0.9rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    transition: "background-color 0.2s, transform 0.1s",
  },
  addButtonDisabled: {
    backgroundColor: "#cbd5e1",
    cursor: "not-allowed",
    transform: "none",
  },
  cartIcon: {
    width: "20px",
    height: "20px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  modalBody: {
    padding: "1.5rem",
  },
  modalMessage: {
    margin: 0,
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: "1.6",
  },
  modalFooter: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
  },
  modalButton: {
    padding: "0.6rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};
