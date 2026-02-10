import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShoe } from "../../Redux/slices/ShoeSlice";
import { addToCart } from "../../Redux/slices/CartSlice";
import CustomModal from "../../components/CustomModal";
import defaultShoe from "../../assets/Shoe.jpg";

export default function Shoes() {
  const dispatch = useDispatch();
  const { data: shoes, loading, error } = useSelector((state) => state.shoe);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    dispatch(fetchShoe());
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

      const product = getShoeArray().find((p) => (p._id || p.id) === productId);
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

  const getShoeArray = () => {
    if (Array.isArray(shoes)) return shoes;
    else if (shoes && typeof shoes === "object") {
      if (shoes.shoes && Array.isArray(shoes.shoes)) return shoes.shoes;
      if (shoes.data && Array.isArray(shoes.data)) return shoes.data;
      if (shoes.items && Array.isArray(shoes.items)) return shoes.items;
      if (shoes.results && Array.isArray(shoes.results)) return shoes.results;
    }
    return [];
  };

  const handleCart = async (displayData, product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};
    const hasAllSelections =
      selections.size && selections.lacing_type && selections.shoe_type;

    if (!hasAllSelections) {
      setModalTitle("⚠️ Selection Required");
      setModalMessage(
        "Please select Size, Lacing Type, and Shoe Type before adding to cart."
      );
      setModalType("error");
      setModalOpen(true);
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
      return;
    }

    const variantId = displayData._id || displayData.id;
    const productModel = product.category || "Shoes";
    const result = await dispatch(
      addToCart(productId, variantId, productModel)
    );

    if (result?.success) {
      setModalTitle("✅ Added to Cart");
      setModalMessage(
        `${product.brand || "Item"} (${displayData.size || "Size N/A"}, ${
          displayData.lacing_type || "Lacing N/A"
        }, ${
          displayData.shoe_type || "Type N/A"
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

  const shoeArray = getShoeArray();

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading Shoes...</p>
        </div>
      ) : error && shoeArray.length === 0 ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Shoe Collection</h1>
            <p style={styles.pageSubtitle}>
              Discover our premium collection of comfortable and stylish shoes
            </p>
          </div>

          {shoeArray.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👟</div>
              <h3 style={styles.emptyTitle}>No Shoes Available</h3>
              <p style={styles.emptyMessage}>
                Check back later for new arrivals!
              </p>
            </div>
          ) : (
            <div style={styles.cardGrid}>
              {shoeArray.map((product, index) => {
                const productId = product._id || product.id || index;
                const displayData = getDisplayData(product);
                const selections = selectedVariants[productId] || {};

                const availableSizes = getUniqueValues(
                  product.variants,
                  "size"
                );
                const availableLacingTypes = getAvailableOptions(
                  product,
                  "lacing_type",
                  selections
                );
                const availableShoeTypes = getAvailableOptions(
                  product,
                  "shoe_type",
                  selections
                );
                const hasAllSelections =
                  selections.size &&
                  selections.lacing_type &&
                  selections.shoe_type;

                return (
                  <div key={productId} style={styles.card}>
                    <div style={styles.imageContainer}>
                      <img
                        src={displayData.image_url || defaultShoe}
                        alt={`${product.brand || "Shoe"}`}
                        style={styles.image}
                        onError={(e) => {
                          e.target.src = defaultShoe;
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

                        {availableLacingTypes.length > 0 && (
                          <div style={styles.selectorGroup}>
                            <label style={styles.selectorLabel}>
                              Lacing Type:{" "}
                              {!selections.lacing_type && (
                                <span style={styles.requiredText}>
                                  *Required
                                </span>
                              )}
                            </label>
                            <div style={styles.optionButtons}>
                              {getUniqueValues(
                                product.variants,
                                "lacing_type"
                              ).map((type) => {
                                const isAvailable =
                                  availableLacingTypes.includes(type);
                                const isSelected =
                                  selections.lacing_type === type;
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
                                        "lacing_type",
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

                        {availableShoeTypes.length > 0 && (
                          <div style={styles.selectorGroup}>
                            <label style={styles.selectorLabel}>
                              Shoe Type:{" "}
                              {!selections.shoe_type && (
                                <span style={styles.requiredText}>
                                  *Required
                                </span>
                              )}
                            </label>
                            <div style={styles.optionButtons}>
                              {getUniqueValues(
                                product.variants,
                                "shoe_type"
                              ).map((type) => {
                                const isAvailable =
                                  availableShoeTypes.includes(type);
                                const isSelected =
                                  selections.shoe_type === type;
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
                                        "shoe_type",
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
    borderTop: "4px solid #10b981",
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
  price: { fontSize: "1.5rem", fontWeight: "700", color: "#10b981" },
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
    backgroundColor: "#10b981",
    borderColor: "#10b981",
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
  extraDetails: { marginBottom: "1rem" },
  extraText: { fontSize: "0.9rem", color: "#666" },
  addButton: {
    width: "100%",
    padding: "0.875rem",
    backgroundColor: "#10b981",
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
