import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSandal } from "../../Redux/slices/SandalSlice";
import { addToCart } from "../../Redux/slices/CartSlice";
import CustomModal from "../../components/CustomModal";
import defaultSandal from "../../assets/slippers.webp";

export default function Sandals() {
  const dispatch = useDispatch();
  const {
    data: sandals,
    loading,
    error,
  } = useSelector((state) => state.sandal);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    dispatch(fetchSandal());
  }, [dispatch]);

  const getUniqueValues = (variants, attribute) => {
    const values = variants?.map((v) => v[attribute]).filter(Boolean) || [];
    return [...new Set(values)];
  };

  const getAvailableOptions = (product, attribute, currentSelections) => {
    const productId = product._id || product.id;
    const selections = currentSelections || selectedVariants[productId] || {};

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

  const getMatchingVariant = (product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};

    if (!product.variants || product.variants.length === 0) return null;
    if (Object.keys(selections).length === 0) return product.variants[0];

    const matchingVariant = product.variants.find((variant) => {
      return Object.keys(selections).every(
        (key) => !selections[key] || variant[key] === selections[key]
      );
    });

    return matchingVariant || product.variants[0];
  };

  const handleSelectionChange = (productId, attribute, value) => {
    setSelectedVariants((prev) => {
      const currentSelections = prev[productId] || {};
      const newValue = currentSelections[attribute] === value ? null : value;

      const newSelections = {
        ...currentSelections,
        [attribute]: newValue,
      };

      Object.keys(newSelections).forEach((key) => {
        if (newSelections[key] === null) delete newSelections[key];
      });

      const product = getSandalArray().find(
        (p) => (p._id || p.id) === productId
      );
      if (!product) return prev;

      if (newValue === null) {
        return { ...prev, [productId]: newSelections };
      }

      const matchingVariant = product.variants.find((variant) => {
        return Object.keys(newSelections).every(
          (key) => variant[key] === newSelections[key]
        );
      });

      if (!matchingVariant) {
        return { ...prev, [productId]: { [attribute]: value } };
      }

      return { ...prev, [productId]: newSelections };
    });
  };

  const getDisplayData = (product) => {
    const variant = getMatchingVariant(product);
    return { ...product, ...(variant || {}) };
  };

  const isOptionAvailable = (product, attribute, value) => {
    const availableOptions = getAvailableOptions(product, attribute);
    return availableOptions.includes(value);
  };

  const getSandalArray = () => {
    if (Array.isArray(sandals)) return sandals;
    else if (sandals && typeof sandals === "object") {
      if (sandals.sandals && Array.isArray(sandals.sandals))
        return sandals.sandals;
      if (sandals.data && Array.isArray(sandals.data)) return sandals.data;
      if (sandals.items && Array.isArray(sandals.items)) return sandals.items;
      if (sandals.results && Array.isArray(sandals.results))
        return sandals.results;
    }
    return [];
  };

  const handleCart = async (displayData, product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};
    const hasAllSelections =
      selections.size && selections.sandal_type && selections.heel_height;

    if (!hasAllSelections) {
      setModalTitle("⚠️ Selection Required");
      setModalMessage(
        "Please select Size, Sandal Type, and Heel Height before adding to cart."
      );
      setModalType("error");
      setModalOpen(true);
            setTimeout(() => {
        setModalOpen(false);
      }, 2500);
      return;
    }

    const variantId = displayData._id || displayData.id;
    const productModel = product.category || "Sandals";
    const result = await dispatch(
      addToCart(productId, variantId, productModel)
    );

    if (result?.success) {
      setModalTitle("✅ Added to Cart");
      setModalMessage(
        `${product.brand || "Item"} (${displayData.size || "Size N/A"}, ${
          displayData.sandal_type || "Type N/A"
        }, ${
          displayData.heel_height || "Heel N/A"
        }) has been added to your cart.\n\nQuantity in cart: ${1}`
      );
      setModalType("success");

      // Clear selected variants for this product after successful addition
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

  const sandalArray = getSandalArray();

  return (
    <div style={styles.container}>



      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading Sandals...</p>
        </div>
      ) : error && sandalArray.length === 0 ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <div style={styles.content}>

          
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Sandal Collection</h1>
            <p style={styles.pageSubtitle}>
              Explore our comfortable and stylish sandal collection
            </p>
          </div>

          {error && sandalArray.length > 0 && (
            <div style={styles.warningBanner}>
              <strong>⚠️ Warning:</strong> {error} (but data loaded
              successfully)
            </div>
          )}

          {sandalArray.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🩴</div>
              <h3 style={styles.emptyTitle}>No Sandals Available</h3>
              <p style={styles.emptyMessage}>
                Check back later for new arrivals!
              </p>
            </div>
          ) : (
            <div style={styles.cardGrid}>
              {sandalArray.map((product, index) => {
                const productId = product._id || product.id || index;
                const displayData = getDisplayData(product);
                const selections = selectedVariants[productId] || {};

                const availableSizes = getUniqueValues(
                  product.variants,
                  "size"
                );
                const availableSandalTypes = getAvailableOptions(
                  product,
                  "sandal_type",
                  selections
                );
                const availableHeelHeights = getAvailableOptions(
                  product,
                  "heel_height",
                  selections
                );
                const hasAllSelections =
                  selections.size &&
                  selections.sandal_type &&
                  selections.heel_height;

                return (
                  <div key={productId} style={styles.card}>
                    <div style={styles.imageContainer}>
                      <img
                        src={displayData.image_url || defaultSandal}
                        alt={`${product.brand || "Sandal"}`}
                        style={styles.image}
                        onError={(e) => {
                          e.target.src = defaultSandal;
                        }}
                      />
                      {displayData.count < 5 && displayData.count > 0 && (
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
                          ₹{displayData.cost || "N/A"}
                        </span>
                      </div>

                      <div style={styles.variantSection}>
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

                        {availableSandalTypes.length > 0 && (
                          <div style={styles.selectorGroup}>
                            <label style={styles.selectorLabel}>
                              Sandal Type:{" "}
                              {!selections.sandal_type && (
                                <span style={styles.requiredText}>
                                  *Required
                                </span>
                              )}
                            </label>
                            <div style={styles.optionButtons}>
                              {getUniqueValues(
                                product.variants,
                                "sandal_type"
                              ).map((type) => {
                                const isAvailable =
                                  availableSandalTypes.includes(type);
                                const isSelected =
                                  selections.sandal_type === type;
                                return (
                                  <button
                                    key={type}
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
                                        "sandal_type",
                                        type
                                      )
                                    }
                                    disabled={!isAvailable}
                                  >
                                    {type}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {availableHeelHeights.length > 0 && (
                          <div style={styles.selectorGroup}>
                            <label style={styles.selectorLabel}>
                              Heel Height:{" "}
                              {!selections.heel_height && (
                                <span style={styles.requiredText}>
                                  *Required
                                </span>
                              )}
                            </label>
                            <div style={styles.optionButtons}>
                              {getUniqueValues(
                                product.variants,
                                "heel_height"
                              ).map((height) => {
                                const isAvailable =
                                  availableHeelHeights.includes(height);
                                const isSelected =
                                  selections.heel_height === height;
                                return (
                                  <button
                                    key={height}
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
                                        "heel_height",
                                        height
                                      )
                                    }
                                    disabled={!isAvailable}
                                  >
                                    {height}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Color</span>
                          <span style={styles.detailValue}>
                            {product.color || "N/A"}
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
                          <strong>Sole:</strong> {product.sole_type || "N/A"}
                        </span>
                        <span style={styles.extraText}>
                          <strong>Strap:</strong> {product.strap_type || "N/A"}
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
    borderTop: "4px solid #a3547b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: { fontSize: "1.1rem", color: "#64748b", fontWeight: 500 },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "2rem",
  },
  errorIcon: { fontSize: "4rem", marginBottom: "1rem" },
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
  content: { maxWidth: "1400px", margin: "0 auto", padding: "2rem" },
  header: { textAlign: "center", marginBottom: "3rem" },
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
  emptyIcon: { fontSize: "4rem", marginBottom: "1rem" },
  emptyTitle: {
    fontSize: "1.5rem",
    color: "#1e293b",
    marginBottom: "0.5rem",
    fontWeight: 600,
  },
  emptyMessage: { fontSize: "1rem", color: "#64748b" },
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
  image: { width: "100%", height: "100%", objectFit: "cover" },
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
  cardContent: { padding: "1.5rem" },
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
  price: { fontSize: "1.5rem", fontWeight: "700", color: "#a3547b" },
  variantSection: {
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e0e0e0",
  },
  selectorGroup: { marginBottom: "1rem" },
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
  optionButtons: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
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
    backgroundColor: "#a3547b",
    borderColor: "#a3547b",
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
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  detailItem: { display: "flex", flexDirection: "column", gap: "0.25rem" },
  detailLabel: {
    fontSize: "0.8rem",
    color: "#888",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  detailValue: { fontSize: "0.95rem", color: "#333", fontWeight: "500" },
  extraDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  extraText: { fontSize: "0.9rem", color: "#666" },
  addButton: {
    width: "100%",
    padding: "0.875rem",
    backgroundColor: "#a3547b",
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
  addButtonDisabled: { backgroundColor: "#ccc", cursor: "not-allowed" },
  cartIcon: { width: "20px", height: "20px" },
};
