import React, { useState } from "react";
import { logoutUser } from "../../../Redux/slices/AuthSlice";
import { persistor } from "../../../Redux/Store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "home", label: "Home", icon: "🏠" },
    { key: "products", label: "Products", icon: "📦" },
    { key: "orders", label: "Orders", icon: "🛒" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    persistor.purge();
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside style={styles.sidebar}>
        <nav style={styles.nav}>
          {tabs.map((tab) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                ...styles.navItem,
                ...(activeTab === tab.key
                  ? { ...styles.navBtn, ...styles.navBtnActive }
                  : styles.navBtn),
              }}
            >
              <span style={styles.icon}>{tab.icon}</span>
              <span style={styles.label}>{tab.label}</span>
            </div>
          ))}

          <div
            onClick={handleLogout}
            style={{
              ...styles.navItem,
              ...styles.navBtn,
              color: "red",
              cursor: "pointer",
            }}
          >
            <span style={styles.icon}>🚪</span>
            <span style={styles.label}>Logout</span>
          </div>
        </nav>
      </aside>

      {showLogoutConfirm && (
        <div style={logoutStyles.overlay}>
          <div style={logoutStyles.modal}>
            <div style={logoutStyles.icon}>🔓</div>
            <h3 style={logoutStyles.title}>Logout</h3>
            <p style={logoutStyles.message}>Are you sure you want to logout?</p>
            <div style={logoutStyles.actions}>
              <button style={logoutStyles.stayBtn} onClick={() => setShowLogoutConfirm(false)}>
                Stay
              </button>
              <button style={logoutStyles.confirmBtn} onClick={confirmLogout}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const logoutStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "32px 28px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  },
  icon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
  },
  message: {
    margin: "0 0 24px",
    fontSize: "14px",
    color: "#64748b",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  stayBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    backgroundColor: "#f1f5f9",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

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
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#d1d5db",
    transition: "all 0.2s ease",
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
