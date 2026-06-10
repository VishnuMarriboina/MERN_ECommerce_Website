// ===============================new code===============================

import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../Redux/slices/AuthSlice";
import { BREADCRUMB_MAP } from "../DataFolder/orgDashboardData";
import Sidebar from "../components/Sidebar";
import ProductManagement from "../components/ProductManagement";
import GenericProductPanel from "../components/GenericProductPanel";
import OrderManagement from "../components/OrderManagement";
import UserManagement from "../components/UserManagement";
import ContactManagement from "../components/ContactManagement";
import Footer from "../../Footer";
import Profile from "../../../components/Profile";
import AdminHome from "../components/AdminHome";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("activeTab") || "home";
  });
  const user = useSelector(selectCurrentUser);
  const userName = user?.name || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  // Store category until tab closes
  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const saved = sessionStorage.getItem("activeTab");
    if (saved) setActiveTab(saved);
  }, []);

  const breadcrumbMap = BREADCRUMB_MAP;

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductManagement />;
      case "catalog":
        return <GenericProductPanel />;
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      case "contacts":
        return <ContactManagement />;
      case "profile":
        return <Profile />;
      case "home":
        return <AdminHome />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <>
      <div style={styles.container}>
        {/* Header - Fixed */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.orgName}>Vishnu's Store</h2>
          </div>
          <div style={styles.adminInfo}>
            <span style={styles.adminName}>Admin: {userName}</span>
            <div style={styles.avatar}>{userInitial}</div>
          </div>
        </header>

        <div style={styles.main}>
          {/* Sidebar - Fixed */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Area - Scrollable */}
          <div style={styles.contentWrapper}>
            {/* Breadcrumbs */}

            {activeTab !== "home" && (
              <div style={styles.breadcrumbContainer}>
                {breadcrumbMap[activeTab]?.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <span
                      style={
                        index === breadcrumbMap[activeTab].length - 1
                          ? styles.breadcrumbActive
                          : styles.breadcrumbItem
                      }
                    >
                      {crumb}
                    </span>
                    {index < breadcrumbMap[activeTab].length - 1 && (
                      <span style={styles.breadcrumbSeparator}>/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Main Content - Scrollable */}
            <div style={styles.content}>{renderContent()}</div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}

// Styles
const styles = {
  container: {
    fontFamily: "system-ui, sans-serif",
    height: "100vh",
    backgroundColor: "#f7fafc",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    // backgroundColor: "#fff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    flexShrink: 0,
    backgroundColor: "#1e293b",
  },

  orgName: {
    fontSize: "1.5rem",
    fontWeight: "700",
    // color: "#2d3748",
    color: "#fff",
    margin: 0,
  },
  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  adminName: {
    fontSize: "0.95rem",
    // color: "#4a5568",
    color: "#fff",
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
    flex: 1,
    overflow: "hidden",
  },
  contentWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    backgroundColor: "#f7fafc",
  },
  breadcrumbContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 0.5rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e2e8f0",
    flexShrink: 0,
  },
  breadcrumbItem: {
    fontSize: "0.9rem",
    color: "#667eea",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  breadcrumbActive: {
    fontSize: "0.9rem",
    color: "#2d3748",
    fontWeight: "600",
  },
  breadcrumbSeparator: {
    fontSize: "0.9rem",
    color: "#a0aec0",
    margin: "0 0.25rem",
  },
  content: {
    flex: 1,
    // padding: "2rem",
  },
};
