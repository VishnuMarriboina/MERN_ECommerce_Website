import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productConfig, categories } from "../config/productConfig";
import CustomModal from "../../../components/CustomModal";

const Plus = () => (
  <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
);
const Edit2 = () => <span style={{ fontSize: "16px" }}>✏️</span>;
const Trash2 = () => <span style={{ fontSize: "16px" }}>🗑️</span>;
const X = () => <span style={{ fontSize: "24px", fontWeight: "bold" }}>×</span>;
const ChevronDown = () => <span style={{ fontSize: "16px" }}>▼</span>;
const ChevronRight = () => <span style={{ fontSize: "16px" }}>▶</span>;

export default function ProductManagement() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return sessionStorage.getItem("selectedCategory") || "Shirts";
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [expandedProducts, setExpandedProducts] = useState({});

  // states for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [checkAfterUpdate, setCheckAfterUpdate] = useState(false);

  const config = productConfig[selectedCategory];
  const reduxState = useSelector((state) => state[config.reduxKey]);
  const productsData = config.dataExtractor(reduxState);
  const products = Array.isArray(productsData) ? productsData : [];

  // console.log("productsData comming from the config file", productsData);

  const totalCount = products.reduce((sum, product) => {
    const variantCount = product.variants?.reduce(
      (s, v) => s + (v.count || 0),
      0
    );
    return sum + variantCount;
  }, 0);
  // Store category until tab closes
  useEffect(() => {
    sessionStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const saved = sessionStorage.getItem("selectedCategory");
    if (saved) setSelectedCategory(saved);
  }, []);

  useEffect(() => {
    //console.log("page triggered with each dispatch was called");
    dispatch(config.fetchAction());
  }, [selectedCategory]);

  const [modalHandled, setModalHandled] = useState(false);

  const afterModalClose = () => {
    console.log("afterModalClose called");
    dispatch(config.fetchAction());
  };

  const handleModalClose = () => {
    console.log("handleModalClose called", modalHandled);
    if (!modalHandled) {
      setModalHandled(true);
      setModalOpen(false);
      afterModalClose();
    }
  };

  useEffect(() => {
    if (!checkAfterUpdate) return;

    console.log("🔥 useEffect firing with updated productsData:", productsData);

    if (productsData.error) {
      setModalTitle("Failed!");
      setModalMessage(productsData.error);
      setModalType("error");
    } else {
      setModalTitle("Success!");
      setModalMessage(productsData.message || "Product updated successfully.");
      setModalType("success");
    }

    setModalOpen(true);

    setTimeout(() => handleModalClose(), 2500);

    setCheckAfterUpdate(false); // reset
  }, [productsData]);

  const dispatchWithRefetch = async (action) => {
    try {
      await dispatch(action);

      // tell React to wait for updated Redux data
      setCheckAfterUpdate(true);
    } catch (err) {
      setModalTitle("Error!");
      setModalMessage("Something went wrong.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  const initializeFormData = (existingData = {}) => {
    const initialData = {};

    // Initialize product fields
    config.fields.forEach((field) => {
      if (field.type === "multiselect") {
        initialData[field.name] = existingData[field.name] || [];
      } else {
        initialData[field.name] = existingData[field.name] || "";
      }
    });

    // Initialize variant fields
    config.variantFields.forEach((field) => {
      if (field.type === "multiselect") {
        initialData[field.name] = existingData[field.name] || [];
      } else {
        initialData[field.name] = existingData[field.name] || "";
      }
    });
    return initialData;
  };

  const toggleProductExpansion = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleAddProduct = async () => {
    const productData = {};
    const variantData = {};

    // Separate product fields and variant fields
    config.fields.forEach((field) => {
      productData[field.name] = formData[field.name] || "";
    });

    config.variantFields.forEach((field) => {
      variantData[field.name] = formData[field.name] || "";
    });

    const payload = {
      ...productData,
      variants: [variantData],
    };

    //console.log("handleAddProduct payload", payload);
    await dispatchWithRefetch(config.addProductAction(payload));
    setShowAddModal(false);
    setFormData({});
    setModalMode("add");
  };

  const openAddVariantModal = (product) => {
    setEditingProduct(product);
    setEditingVariant(null);
    setModalMode("addVariant");

    const formDataInit = {};

    // Set product fields as non-editable (from existing product)
    config.fields.forEach((field) => {
      formDataInit[field.name] = product[field.name] || "";
    });

    // Initialize empty variant fields
    config.variantFields.forEach((field) => {
      formDataInit[field.name] = "";
    });

    setFormData(formDataInit);
    setShowEditModal(true);
  };

  const openEditVariantModal = (product, variant) => {
    setEditingProduct(product);
    setEditingVariant(variant);
    setModalMode("updateVariant");

    const editData = {};

    // Set product fields (non-editable)
    config.fields.forEach((field) => {
      editData[field.name] = product[field.name] || "";
    });

    // Set variant fields (editable)
    config.variantFields.forEach((field) => {
      editData[field.name] = variant[field.name] || "";
    });

    setFormData(editData);
    setShowEditModal(true);
  };

  const openUpdateProductModal = (product) => {
    setEditingProduct(product);
    setEditingVariant(null);
    setModalMode("updateProduct");

    const formDataInit = {};

    // Set product fields (editable)
    config.fields.forEach((field) => {
      formDataInit[field.name] = product[field.name] || "";
    });

    // Set first variant fields if exists
    if (product.variants && product.variants.length > 0) {
      config.variantFields.forEach((field) => {
        formDataInit[field.name] = product.variants[0][field.name] || "";
      });
    } else {
      config.variantFields.forEach((field) => {
        formDataInit[field.name] = "";
      });
    }

    setFormData(formDataInit);
    setShowAddModal(true);
  };

  const handleAddVariant = async () => {
    const variantData = {};

    config.variantFields.forEach((field) => {
      variantData[field.name] = formData[field.name] || "";
    });

    const payload = {
      id: editingProduct._id || editingProduct.id,
      variantData,
    };

    //console.log("handleAddVariant payload", payload);
    await dispatchWithRefetch(config.addVariantAction(payload));
    setShowEditModal(false);
    setEditingProduct(null);
    setEditingVariant(null);
    setFormData({});
    setModalMode("add");
  };

  const handleUpdateVariant = async () => {
    const variantData = {
      id: editingVariant._id || editingVariant.id,
    };

    config.variantFields.forEach((field) => {
      variantData[field.name] = formData[field.name] || "";
    });

    const payload = {
      id: editingProduct._id || editingProduct.id,
      variantData,
    };

    //console.log("handleUpdateVariant payload", payload);
    await dispatchWithRefetch(config.updateVariantAction(payload));
    setShowEditModal(false);
    setEditingProduct(null);
    setEditingVariant(null);
    setFormData({});
    setModalMode("add");
  };

  const handleUpdateProduct = async () => {
    const productData = {
      id: editingProduct._id || editingProduct.id,
    };
    const variantData = {};

    // Get product fields
    config.fields.forEach((field) => {
      productData[field.name] = formData[field.name] || "";
    });

    // Get variant fields
    config.variantFields.forEach((field) => {
      variantData[field.name] = formData[field.name] || "";
    });

    const payload = {
      ...productData,
      variants: [variantData],
    };

    //console.log("handleUpdateProduct payload 236", payload);
    await dispatchWithRefetch(config.updateProductAction(payload));
    setShowAddModal(false);
    setEditingProduct(null);
    setFormData({});
    setModalMode("add");
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatchWithRefetch(config.deleteProductAction(id));
    }
  };

  const handleDeleteVariant = async (productId, variantId) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      const payload = {
        id: productId,
        variantData: { id: variantId },
      };
      await dispatchWithRefetch(config.deleteVariantAction(payload));
    }
  };

  // CRITICAL LOGIC: Determine if a field is editable based on modal mode
  const isFieldEditable = (field) => {
    const isProductField = config.fields.some((f) => f.name === field.name);
    const isVariantField = config.variantFields.some(
      (f) => f.name === field.name
    );

    // Mode: "add" - Adding a new product (all fields editable)
    if (modalMode === "add") {
      return true;
    }

    // Mode: "updateProduct" - Updating an existing product (all fields editable)
    if (modalMode === "updateProduct") {
      return true;
    }

    // Mode: "addVariant" - Adding a variant to existing product
    if (modalMode === "addVariant") {
      // Product fields are NOT editable (read-only)
      if (isProductField) {
        return false;
      }
      // Variant fields ARE editable
      if (isVariantField) {
        return true;
      }
    }

    // Mode: "updateVariant" - Editing an existing variant
    if (modalMode === "updateVariant") {
      // Product fields are NOT editable (read-only)
      if (isProductField) {
        return false;
      }
      // Variant fields: check the 'editable' property from config
      // If editable is explicitly set to false, field is NOT editable
      // Otherwise, field IS editable
      if (isVariantField) {
        return field.editable !== false;
      }
    }

    return false;
  };

  const renderFormField = (field) => {
    const value = formData[field.name] || "";
    const editable = isFieldEditable(field);
    const fieldStyle = editable
      ? styles.input
      : { ...styles.input, ...styles.inputDisabled };

    switch (field.type) {
      case "select":
        return (
          <select
            style={fieldStyle}
            value={value}
            onChange={(e) =>
              editable &&
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            required={field.required}
            disabled={!editable}
          >
            <option value="">Select {field.label}</option>
            {field.options &&
              field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        );

      case "multiselect":
        return (
          <input
            style={fieldStyle}
            placeholder={
              field.placeholder || `${field.label} (comma separated)`
            }
            value={value}
            onChange={(e) =>
              editable &&
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            required={field.required}
            disabled={!editable}
            readOnly={!editable}
          />
        );

      case "textarea":
        return (
          <textarea
            style={{ ...fieldStyle, minHeight: "80px" }}
            placeholder={field.placeholder || field.label}
            value={value}
            onChange={(e) =>
              editable &&
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            required={field.required}
            disabled={!editable}
            readOnly={!editable}
          />
        );

      case "number":
        return (
          <input
            style={fieldStyle}
            type="number"
            placeholder={field.placeholder || field.label}
            value={value}
            onChange={(e) =>
              editable &&
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            required={field.required}
            disabled={!editable}
            readOnly={!editable}
          />
        );

      default:
        return (
          <input
            style={fieldStyle}
            type="text"
            placeholder={field.placeholder || field.label}
            value={value}
            onChange={(e) =>
              editable &&
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            required={field.required}
            disabled={!editable}
            readOnly={!editable}
          />
        );
    }
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case "add":
        return `Add New Product to ${selectedCategory}`;
      case "updateProduct":
        return "Update Product";
      case "addVariant":
        return "Add New Variant";
      case "updateVariant":
        return "Update Variant";
      default:
        return "Edit Product";
    }
  };

  const getModalSubmitButton = () => {
    switch (modalMode) {
      case "add":
        return { text: "Add Product", handler: handleAddProduct };
      case "updateProduct":
        return { text: "Update Product", handler: handleUpdateProduct };
      case "addVariant":
        return { text: "Add Variant", handler: handleAddVariant };
      case "updateVariant":
        return { text: "Update Variant", handler: handleUpdateVariant };
      default:
        return { text: "Submit", handler: handleAddProduct };
    }
  };

  return (
    <div style={styles.container}>
      <main style={styles.content}>
        <div>
          <div style={styles.contentHeader}>
            <h1 style={styles.pageTitle}>Product Management</h1>
            <button
              style={styles.addBtn}
              onClick={() => {
                setModalMode("add");
                setFormData(initializeFormData());
                setShowAddModal(true);
              }}
            >
              <Plus />
              Add Product
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "end",
              width: "100%",
              // backgroundColor: "red",
              marginBottom: "0.5rem",
            }}
          >
            {/* LEFT SIDE: HORIZONTAL SCROLL BUTTONS */}
            <div style={styles.categoryContainer}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  style={
                    selectedCategory === cat
                      ? { ...styles.categoryBtn, ...styles.categoryBtnActive }
                      : styles.categoryBtn
                  }
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* RIGHT SIDE: FIXED STAT CARD */}
            <div
              style={{ ...styles.statCard, marginLeft: "15px", flexShrink: 0 }}
            >
              <span style={styles.statLabel}>Total {selectedCategory}</span>
              <span style={styles.statValue}>{totalCount}</span>
            </div>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}></th>
                  {config.fields.map((field) => (
                    <th key={field.name} style={styles.th}>
                      {field.label}
                    </th>
                  ))}
                  <th style={styles.th}>Variants</th>
                  <th style={styles.th}>Product Count</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.fields.length + 3}
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        padding: "4rem 4rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "1rem",
                          color: "#6b7280",
                        }}
                      >
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          style={{ opacity: 0.5 }}
                        >
                          <path d="M20 7h-9M14 17H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v4" />
                          <circle cx="17" cy="17" r="3" />
                          <path d="M17 14v6M14 17h6" />
                        </svg>
                        <div>
                          <div
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "600",
                              color: "#374151",
                              marginBottom: "0.5rem",
                            }}
                          >
                            No products found
                          </div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                          >
                            Get started by adding your first product to the
                            inventory
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const productId = product._id || product.id;
                    const isExpanded = expandedProducts[productId];

                    return (
                      <React.Fragment key={productId}>
                        <tr style={styles.tableRow}>
                          <td style={styles.td}>
                            <button
                              style={styles.expandBtn}
                              onClick={() => toggleProductExpansion(productId)}
                            >
                              {isExpanded ? <ChevronDown /> : <ChevronRight />}
                            </button>
                          </td>
                          {config.fields.map((field) => (
                            <td key={field.name} style={styles.td}>
                              {product[field.name] || "—"}
                            </td>
                          ))}
                          <td style={styles.td}>
                            <span style={styles.variantCount}>
                              {product.variants?.length || 0}
                            </span>
                          </td>

                          <td style={styles.pd}>
                            <span style={styles.productCount}>
                              {/* {product?.variants?.count || 0} */}

                              {product?.variants?.reduce(
                                (total, v) => total + (v.count || 0),
                                0
                              ) || 0}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.actionBtns}>
                              <button
                                style={styles.addVariantBtn}
                                onClick={() => openAddVariantModal(product)}
                                title="Add Variant"
                              >
                                <Plus />
                              </button>
                              <button
                                style={styles.editBtn}
                                onClick={() => openUpdateProductModal(product)}
                                title="Edit Product"
                              >
                                <Edit2 />
                              </button>
                              <button
                                style={styles.deleteBtn}
                                onClick={() => handleDeleteProduct(productId)}
                                title="Delete Product"
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded &&
                          product.variants &&
                          product.variants.length > 0 && (
                            <tr>
                              <td
                                colSpan={config.fields.length + 3}
                                style={styles.variantContainer}
                              >
                                <div style={styles.variantTable}>
                                  <table style={styles.table}>
                                    <thead>
                                      <tr style={styles.variantHeader}>
                                        {config.variantFields.map((field) => (
                                          <th
                                            key={field.name}
                                            style={styles.variantTh}
                                          >
                                            {field.label}
                                          </th>
                                        ))}
                                        <th style={styles.variantTh}>
                                          Actions
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {product.variants.map((variant) => (
                                        <tr
                                          key={variant._id || variant.id}
                                          style={styles.variantRow}
                                        >
                                          {config.variantFields.map((field) => (
                                            <td
                                              key={field.name}
                                              style={styles.variantTd}
                                            >
                                              {field.name === "cost"
                                                ? `₹${variant[field.name] || 0}`
                                                : variant[field.name] || "—"}
                                            </td>
                                          ))}
                                          <td style={styles.variantTd}>
                                            <div
                                              style={styles.variantActionBtns}
                                            >
                                              <button
                                                style={styles.variantEditBtn}
                                                onClick={() =>
                                                  openEditVariantModal(
                                                    product,
                                                    variant
                                                  )
                                                }
                                                title="Edit Variant"
                                              >
                                                <Edit2 />
                                              </button>
                                              <button
                                                style={styles.variantDeleteBtn}
                                                onClick={() =>
                                                  handleDeleteVariant(
                                                    productId,
                                                    variant._id || variant.id
                                                  )
                                                }
                                                title="Delete Variant"
                                              >
                                                <Trash2 />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>{getModalTitle()}</h2>
              <button
                style={styles.closeBtn}
                onClick={() => {
                  setShowAddModal(false);
                  setModalMode("add");
                  setEditingProduct(null);
                }}
              >
                <X />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Product Details</h3>
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label style={styles.label}>
                      {field.label}
                      {field.required && <span style={styles.required}>*</span>}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>
              {modalMode === "add" && (
                <div style={styles.formSection}>
                  <h3 style={styles.sectionTitle}>Variant Details</h3>
                  {config.variantFields.map((field) => (
                    <div key={field.name}>
                      <label style={styles.label}>
                        {field.label}
                        {field.required && (
                          <span style={styles.required}>*</span>
                        )}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setShowAddModal(false);
                  setModalMode("add");
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
              <button
                style={styles.submitBtn}
                onClick={getModalSubmitButton().handler}
              >
                {getModalSubmitButton().text}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>{getModalTitle()}</h2>
              <button
                style={styles.closeBtn}
                onClick={() => {
                  setShowEditModal(false);
                  setModalMode("add");
                  setEditingVariant(null);
                }}
              >
                <X />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  Product Details{" "}
                  {(modalMode === "addVariant" ||
                    modalMode === "updateVariant") &&
                    "(Read-only)"}
                </h3>
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label style={styles.label}>
                      {field.label}
                      {modalMode !== "add" && modalMode !== "updateProduct" && (
                        <span style={styles.nonEditableLabel}>
                          {" "}
                          (Read-only)
                        </span>
                      )}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>Variant Details</h3>
                {config.variantFields.map((field) => {
                  const editable = isFieldEditable(field);
                  return (
                    <div key={field.name}>
                      <label style={styles.label}>
                        {field.label}
                        {field.required && (
                          <span style={styles.required}>*</span>
                        )}
                        {!editable && (
                          <span style={styles.nonEditableLabel}>
                            {" "}
                            (Read-only)
                          </span>
                        )}
                      </label>
                      {renderFormField(field)}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setShowEditModal(false);
                  setModalMode("add");
                  setEditingVariant(null);
                }}
              >
                Cancel
              </button>
              <button
                style={styles.submitBtn}
                onClick={getModalSubmitButton().handler}
              >
                {getModalSubmitButton().text}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for  api response */}
      <CustomModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={handleModalClose} // <-- IMPORTANT
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "0",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
    // backgroundColor: "#5ad829ff",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    margin: "0",
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(76, 175, 80, 0.3)",
  },
  categoryContainer: {
    overflowX: "auto",
    whiteSpace: "nowrap",
    display: "flex",
    gap: "12px",
    flexGrow: 1,
    paddingBottom: "6px",
  },
  categoryBtn: {
    padding: "0.6rem 1.2rem",
    border: "2px solid #ddd",
    borderRadius: "25px",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.2s",
    color: "#666",
    // backgroundColor: "blue",
  },
  categoryBtnActive: {
    backgroundColor: "#2196F3",
    color: "white",
    // borderColor: "#2196F3",
  },
  statCard: {
    backgroundColor: "white",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#718096",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#2d3748",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    fontWeight: "600",
    color: "#333",
    borderBottom: "2px solid #e0e0e0",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "1rem",
    color: "#555",
    fontSize: "0.95rem",
  },
  pd: {
    // justifyContent: "center",
    // alignItems: "center",
    textAlign: "center",
    //  backgroundColor: "#e7eef0ff",
  },
  productCount: {
    backgroundColor: "#c3e5eeff",
    padding: "0.5rem 3.0rem",
    borderRadius: "12px",
    fontSize: "1.25rem",
    color: "#06090cff",
    fontWeight: "500",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  expandBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.25rem",
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  },
  variantCount: {
    backgroundColor: "#e3f2fd",
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.85rem",
    color: "#1976d2",
    fontWeight: "500",
  },

  variantContainer: {
    padding: "0",
    backgroundColor: "#fafafa",
  },
  variantTable: {
    padding: "1rem",
    marginLeft: "3rem",
  },
  variantHeader: {
    backgroundColor: "#e8eaf6",
  },
  variantTh: {
    padding: "0.75rem",
    textAlign: "left",
    fontWeight: "600",
    color: "#333",
    borderBottom: "2px solid #c5cae9",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  variantRow: {
    backgroundColor: "white",
    borderBottom: "1px solid #e0e0e0",
  },
  variantTd: {
    padding: "0.75rem",
    color: "#555",
    fontSize: "0.9rem",
  },
  actionBtns: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  editBtn: {
    padding: "0.5rem 0.9rem",
    backgroundColor: "#fff",
    color: "#2196F3",
    border: "1.5px solid #2196F3",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 3px rgba(33, 150, 243, 0.2)",
  },
  addVariantBtn: {
    padding: "0.5rem 0.9rem",
    backgroundColor: "#fff",
    color: "#FF9800",
    border: "1.5px solid #FF9800",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 3px rgba(255, 152, 0, 0.2)",
  },
  deleteBtn: {
    padding: "0.5rem 0.9rem",
    backgroundColor: "#fff",
    color: "#f44336",
    border: "1.5px solid #f44336",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 3px rgba(244, 67, 54, 0.2)",
  },
  variantActionBtns: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  variantEditBtn: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
    border: "1px solid #90CAF9",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(25, 118, 210, 0.15)",
  },
  variantDeleteBtn: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#FFEBEE",
    color: "#D32F2F",
    border: "1px solid #EF9A9A",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(211, 47, 47, 0.15)",
  },
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    fontSize: "1.5rem",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease",
  },
  modalBody: {
    padding: "1.5rem",
    overflowY: "auto",
    flex: "1",
  },
  formSection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "2px solid #e0e0e0",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#333",
    fontSize: "0.95rem",
  },
  nonEditableLabel: {
    fontSize: "0.85rem",
    color: "#999",
    fontWeight: "normal",
    fontStyle: "italic",
  },
  required: {
    color: "#f44336",
    marginLeft: "0.25rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
    boxSizing: "border-box",
    backgroundColor: "white",
    transition: "border-color 0.2s ease",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
    cursor: "not-allowed",
    opacity: "0.7",
  },
  modalFooter: {
    padding: "1.5rem",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
  },
  cancelBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f5f5f5",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  submitBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(76, 175, 80, 0.3)",
  },
};
