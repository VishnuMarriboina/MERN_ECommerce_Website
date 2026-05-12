import React, { useState } from "react";
import { fetchBelt } from "../../../Redux/slices/BeltSlice";
import { fetchSandal } from "../../../Redux/slices/SandalSlice";
import { fetchShoe } from "../../../Redux/slices/ShoeSlice";
import { fetchTshirt } from "../../../Redux/slices/TshirtSlice";
import { fetchWatch } from "../../../Redux/slices/WatchSlice";
import { fetchShirt } from "../../../Redux/slices/ShirtSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomModal from "../../../components/CustomModal";
import { selectCurrentUser } from "../../../Redux/slices/AuthSlice";

// Icon components
const Plus = () => (
  <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
);
const Edit2 = () => <span style={{ fontSize: "16px" }}>✏️</span>;
const Trash2 = () => <span style={{ fontSize: "16px" }}>🗑️</span>;
const Package = () => <span style={{ fontSize: "20px" }}>📦</span>;
const ShoppingCart = () => <span style={{ fontSize: "20px" }}>🛒</span>;
const Users = () => <span style={{ fontSize: "20px" }}>👥</span>;
const X = () => <span style={{ fontSize: "24px", fontWeight: "bold" }}>×</span>;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState("products");
  const [selectedCategory, setSelectedCategory] = useState("Shirts");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Sample data
  const [products, setProducts] = useState({
    Shirts: [
      {
        id: 1,
        brand: "AA",
        name: "Formal Shirt",
        size: ["S", "M", "L", "XL"],
        color: "White",
        price: 1299,
        stock: 45,
      },
      {
        id: 2,
        brand: "BB",
        name: "Casual Shirt",
        size: ["M", "L", "XL"],
        color: "Blue",
        price: 999,
        stock: 30,
      },
    ],
    "T-Shirts": [
      {
        id: 3,
        brand: "Nike",
        name: "Sports Tee",
        size: ["S", "M", "L"],
        color: "Black",
        price: 799,
        stock: 60,
      },
    ],
    Shoes: [
      {
        id: 4,
        brand: "Adidas",
        name: "Running Shoes",
        size: ["8", "9", "10"],
        color: "Black",
        price: 3999,
        stock: 25,
      },
    ],
    Sandals: [
      {
        id: 5,
        brand: "Puma",
        name: "Casual Sandals",
        size: ["7", "8", "9"],
        color: "Brown",
        price: 1499,
        stock: 40,
      },
    ],
  });

  // Process shirt data
  const {
    data: shirts,
    loading,
    error,
    errorMsg,
    successMsg,
  } = useSelector((state) => state.shirt);
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

  // Process sandal data
const {
    data: sandals,
    // loading,
    // error,
  } = useSelector((state) => state.sandal);

  const getSandalArray = () => {
    if (Array.isArray(sandals)) {
      return sandals;
    } else if (sandals && typeof sandals === "object") {
      if (sandals.sandals && Array.isArray(sandals.sandals))
        return sandals.sandals;
      if (sandals.data && Array.isArray(sandals.data)) return sandals.data;
      if (sandals.items && Array.isArray(sandals.items)) return sandals.items;
      if (sandals.results && Array.isArray(sandals.results))
        return sandals.results;
    }
    return [];
  };

  const sandalArray = getSandalArray();

  const [orders] = useState([
    {
      id: 1,
      customer: "Rahul Kumar",
      product: "Formal Shirt",
      amount: 1299,
      status: "Pending",
    },
    {
      id: 2,
      customer: "Priya Sharma",
      product: "Sports Tee",
      amount: 799,
      status: "Delivered",
    },
    {
      id: 3,
      customer: "Amit Patel",
      product: "Running Shoes",
      amount: 3999,
      status: "Shipped",
    },
  ]);

  const [users] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      email: "rahul@email.com",
      orders: 5,
      joined: "Jan 2024",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@email.com",
      orders: 3,
      joined: "Feb 2024",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit@email.com",
      orders: 8,
      joined: "Dec 2023",
    },
  ]);

  const categories = [
    "Shirts",
    "T-Shirts",
    "Shoes",
    "Sandals",
    "Belts",
    "Watches",
  ];

  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    size: "",
    color: "",
    price: "",
    stock: "",
  });

  const handleAddProduct = () => {
    if (
      !formData.brand ||
      !formData.name ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newProduct = {
      id: Date.now(),
      brand: formData.brand,
      name: formData.name,
      size: formData.size.split(",").map((s) => s.trim()),
      color: formData.color,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
    };

    setProducts({
      ...products,
      [selectedCategory]: [...(products[selectedCategory] || []), newProduct],
    });

    setFormData({
      brand: "",
      name: "",
      size: "",
      color: "",
      price: "",
      stock: "",
    });
    setShowAddModal(false);
  };

  const handleEditProduct = () => {
    if (
      !formData.brand ||
      !formData.name ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Please fill all required fields");
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      brand: formData.brand,
      name: formData.name,
      size: formData.size.split(",").map((s) => s.trim()),
      color: formData.color,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
    };

    setProducts({
      ...products,
      [selectedCategory]: products[selectedCategory].map((p) =>
        p.id === editingProduct.id ? updatedProduct : p
      ),
    });

    setFormData({
      brand: "",
      name: "",
      size: "",
      color: "",
      price: "",
      stock: "",
    });
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts({
        ...products,
        [selectedCategory]: products[selectedCategory].filter(
          (p) => p.id !== id
        ),
      });
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      brand: product.brand,
      name: product.name,
      size: product.size.join(", "),
      color: product.color,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setShowEditModal(true);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.orgInfo}>
          <h2 style={styles.orgName}>Vishnu's Store</h2>
        </div>
        <div style={styles.adminInfo}>
          <span style={styles.adminName}>Admin: Vishnu</span>
          <div style={styles.avatar}>V</div>
        </div>
      </header>

      <div style={styles.main}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <nav style={styles.nav}>
            <button
              style={
                activeTab === "products"
                  ? { ...styles.navBtn, ...styles.navBtnActive }
                  : styles.navBtn
              }
              onClick={() => setActiveTab("products")}
            >
              <Package size={20} />
              <span>Products</span>
            </button>
            <button
              style={
                activeTab === "orders"
                  ? { ...styles.navBtn, ...styles.navBtnActive }
                  : styles.navBtn
              }
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart size={20} />
              <span>Orders</span>
            </button>
            <button
              style={
                activeTab === "users"
                  ? { ...styles.navBtn, ...styles.navBtnActive }
                  : styles.navBtn
              }
              onClick={() => setActiveTab("users")}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main style={styles.content}>
          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div style={styles.contentHeader}>
                <h1 style={styles.pageTitle}>Product Management</h1>
                <button
                  style={styles.addBtn}
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>

              {/* Category Pills */}
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

              {/* Products Table */}
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Brand</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Sizes</th>
                      <th style={styles.th}>Color</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>Stock</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(products[selectedCategory] || []).map((product) => (
                      <tr key={product.id} style={styles.tableRow}>
                        <td style={styles.td}>{product.brand}</td>
                        <td style={styles.td}>{product.name}</td>
                        <td style={styles.td}>{product.size.join(", ")}</td>
                        <td style={styles.td}>{product.color}</td>
                        <td style={styles.td}>₹{product.price}</td>
                        <td style={styles.td}>{product.stock}</td>
                        <td style={styles.td}>
                          <div style={styles.actionBtns}>
                            <button
                              style={styles.editBtn}
                              onClick={() => openEditModal(product)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              style={styles.deleteBtn}
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h1 style={styles.pageTitle}>Order Management</h1>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={styles.tableRow}>
                        <td style={styles.td}>#{order.id}</td>
                        <td style={styles.td}>{order.customer}</td>
                        <td style={styles.td}>{order.product}</td>
                        <td style={styles.td}>₹{order.amount}</td>
                        <td style={styles.td}>
                          <span
                            style={
                              order.status === "Delivered"
                                ? styles.statusDelivered
                                : order.status === "Shipped"
                                ? styles.statusShipped
                                : styles.statusPending
                            }
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <h1 style={styles.pageTitle}>User Management</h1>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Total Orders</th>
                      <th style={styles.th}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={styles.tableRow}>
                        <td style={styles.td}>{user.name}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>{user.orders}</td>
                        <td style={styles.td}>{user.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Add New Product to {selectedCategory}</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <input
                style={styles.input}
                placeholder="Brand (e.g., AA)"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
              <input
                style={styles.input}
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                style={styles.input}
                placeholder="Sizes (comma separated: S, M, L)"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
              <input
                style={styles.input}
                placeholder="Color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button style={styles.submitBtn} onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <input
                style={styles.input}
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
              <input
                style={styles.input}
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                style={styles.input}
                placeholder="Sizes (comma separated)"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
              <input
                style={styles.input}
                placeholder="Color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              <input
                style={styles.input}
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button style={styles.submitBtn} onClick={handleEditProduct}>
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "system-ui, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f7fafc",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  orgInfo: {},
  orgName: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#2d3748",
    margin: 0,
  },
  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  adminName: {
    fontSize: "0.95rem",
    color: "#4a5568",
    fontWeight: "500",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#667eea",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "1.1rem",
  },
  main: {
    display: "flex",
    minHeight: "calc(100vh - 73px)",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#fff",
    borderRight: "1px solid #e2e8f0",
    padding: "2rem 0",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0 1rem",
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    border: "none",
    backgroundColor: "transparent",
    color: "#4a5568",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  navBtnActive: {
    backgroundColor: "#667eea",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: "2rem",
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#2d3748",
    margin: 0,
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  categoryContainer: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  categoryBtn: {
    padding: "0.5rem 1.25rem",
    border: "2px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#4a5568",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  categoryBtnActive: {
    backgroundColor: "#667eea",
    color: "#fff",
    borderColor: "#667eea",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f7fafc",
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#4a5568",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#2d3748",
  },
  actionBtns: {
    display: "flex",
    gap: "0.5rem",
  },
  editBtn: {
    padding: "0.5rem",
    backgroundColor: "#edf2f7",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#667eea",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
  },
  deleteBtn: {
    padding: "0.5rem",
    backgroundColor: "#fff5f5",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#f56565",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s",
  },
  statusDelivered: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#c6f6d5",
    color: "#2f855a",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  statusShipped: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#bee3f8",
    color: "#2c5282",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  statusPending: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#feebc8",
    color: "#c05621",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
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
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: "#718096",
    padding: "0.25rem",
    display: "flex",
    alignItems: "center",
  },
  modalBody: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
  },
  modalFooter: {
    padding: "1.5rem",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
  },
  cancelBtn: {
    padding: "0.75rem 1.5rem",
    border: "2px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#4a5568",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  submitBtn: {
    padding: "0.75rem 1.5rem",
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
};
