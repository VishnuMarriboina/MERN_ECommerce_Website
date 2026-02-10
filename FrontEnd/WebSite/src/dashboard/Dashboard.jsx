import React, { useState, useEffect, useRef } from "react";
import Shirts from "../pages/cloths/Shirts";
import Tshirts from "../pages/cloths/Tshirts";
import Belts from "../pages/accessories/Belts";
import Watches from "../pages/accessories/Watches";
import Shoes from "../pages/footwears/Shoes";
import Sandals from "../pages/footwears/Sandals";
import Cart from "../components/Cart";
import Profile from "../components/Profile";
import Login from "../components/Login";
import Orders from "../components/Orders";
import { Routes, Route } from "react-router-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./Home";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectCurrentUser } from "../Redux/slices/AuthSlice";
import { persistor } from "../Redux/Store";
import Footer from "./Footer";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("activeTab");
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Store category until tab closes
  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const saved = sessionStorage.getItem("activeTab");
    if (saved) setActiveTab(saved);
  }, []);

  useEffect(() => {
    const path = location.pathname.replace("/", "");

    // If current path is NOT a category tab → clear active tab
    const validTabs = [
      "shirts",
      "tshirts",
      "belts",
      "watches",
      "shoes",
      "sandals",
    ];

    if (validTabs.includes(path)) {
      setActiveTab(path);
    } else {
      setActiveTab(""); // Clear the highlight for home, cart, profile etc
    }
  }, [location.pathname]);

  const handleCartClick = () => {
    navigate("/cart");
    setShowDropdown(false);
  };
  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };
  const handleOrdersClick = () => {
    navigate("/orders");
    setShowDropdown(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    persistor.purge();
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  // Check if current route should hide sidebar
  const noSidebarRoutes = ["/cart", "/profile", "/login"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  // Add hover effects and improve interactivity
  const addHoverEffects = () => {
    const style = document.createElement("style");
    style.textContent = `
      .logout-btn:hover {
        background-color: #b91c1c !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3) !important;
      }
      
      .nav-link:hover {
        background-color: #f1f5f9 !important;
        color: #334155 !important;
        transform: translateX(4px);
      }
      
      .nav-link:not(.active):hover {
        border-left: 3px solid #e2e8f0 !important;
      }
      
      .nav-link.active:hover {
        background-color: #dbeafe !important;
        transform: translateX(2px);
      }
    /* Cart button hover */
    .cart-btn:hover {
      background-color: #facc15 !important; /* yellow shade */
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(250, 204, 21, 0.3) !important;
    }

    /* Profile button hover */
    .profile-btn:hover {
      background-color: #3b82f6 !important; /* blue shade */
      color: #fff !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3) !important;
    }

    `;
    document.head.appendChild(style);
  };

  // Add hover effects on component mount
  React.useEffect(() => {
    addHoverEffects();
  }, []);

  return (
    <>
      <div>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.welcomeText}>Welcome {user.name} 👋</h2>
          <div style={styles.headerRight}>
            <button
              style={styles.iconButton}
              onClick={handleCartClick}
              className="cart-btn"
            >
              🛒 Cart
            </button>

            {/* Profile Dropdown */}
            <div style={styles.profileContainer} ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                style={styles.iconButton}
                className="profile-btn"
              >
                👤 Profile
              </button>
              {showDropdown && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownItem} onClick={handleHomeClick}>
                    🏠 Home
                  </div>
                  <div style={styles.dropdownItem} onClick={handleProfileClick}>
                    👤 User Details
                  </div>
                  <div style={styles.dropdownItem} onClick={handleOrdersClick}>
                    📦 Orders
                  </div>
                  <div style={styles.dropdownItem} onClick={handleLogout}>
                    🔓 Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Routes */}
        <Routes>
          {/* Full-page routes (no sidebar) */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />

          {/* Sidebar layout */}
          <Route
            path="/*"
            element={
              <div style={styles.container}>
                {showSidebar && (
                  <nav style={styles.nav}>
                    <div style={styles.navHeader}>
                      <h3 style={styles.navTitle}>Categories</h3>
                    </div>
                    <ul style={styles.navList}>
                      <li style={styles.navItem}>
                        <Link
                          to="/shirts"
                          className={`nav-link ${
                            activeTab === "shirts" ? "active" : ""
                          }`}
                          style={
                            activeTab === "shirts"
                              ? styles.activeNavLink
                              : styles.navLink
                          }
                          onClick={() => setActiveTab("shirts")}
                        >
                          👔 Shirts
                        </Link>
                      </li>
                      <li style={styles.navItem}>
                        <Link
                          to="/tshirts"
                          className={`nav-link ${
                            activeTab === "tshirts" ? "active" : ""
                          }`}
                          style={
                            activeTab === "tshirts"
                              ? styles.activeNavLink
                              : styles.navLink
                          }
                          onClick={() => setActiveTab("tshirts")}
                        >
                          👕 T-Shirts
                        </Link>
                      </li>
                      <li style={styles.navItem}>
                        <Link
                          to="/belts"
                          className={`nav-link ${
                            activeTab === "belts" ? "active" : ""
                          }`}
                          style={
                            activeTab === "belts"
                              ? styles.activeNavLink
                              : styles.navLink
                          }
                          onClick={() => setActiveTab("belts")}
                        >
                          {/* 👝 Belts */}➖ Belts
                        </Link>
                      </li>
                      <li style={styles.navItem}>
                        <Link
                          to="/watches"
                          className={`nav-link ${
                            activeTab === "watches" ? "active" : ""
                          }`}
                          style={
                            activeTab === "watches"
                              ? styles.activeNavLink
                              : styles.navLink
                          }
                          onClick={() => setActiveTab("watches")}
                        >
                          ⌚ Watches
                        </Link>
                      </li>
                      <li style={styles.navItem}>
                        <Link
                          to="/shoes"
                          className={`nav-link ${
                            activeTab === "shoes" ? "active" : ""
                          }`}
                          style={
                            activeTab === "shoes"
                              ? styles.activeNavLink
                              : styles.navLink
                          }
                          onClick={() => setActiveTab("shoes")}
                        >
                          👞 Shoes
                        </Link>
                      </li>
                      <li style={styles.navItem}>
                        <Link
                          to="/sandals"
                          className={`nav-link ${
                            activeTab === "sandals" ? "active" : ""
                          }`}
                          style={
                            activeTab === "sandals"
                              ? styles.activeNavLink
                              : styles.navLink
                          }
                          onClick={() => setActiveTab("sandals")}
                        >
                          🩴 Sandals
                        </Link>
                      </li>
                    </ul>
                  </nav>
                )}

                <div style={styles.content}>
                  <Routes>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route index element={<Home />} />
                    <Route path="/shirts" element={<Shirts />} />
                    <Route path="/tshirts" element={<Tshirts />} />
                    <Route path="/belts" element={<Belts />} />
                    <Route path="/watches" element={<Watches />} />
                    <Route path="/shoes" element={<Shoes />} />
                    <Route path="/sandals" element={<Sandals />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;

// Modern, clean styles object
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#1e293b",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  welcomeText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#f8fafc",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
  },
  container: {
    display: "flex",
    height: "calc(100vh - 69px)",
    backgroundColor: "#f8fafc",
    // backgroundColor: "#6b95b1ff",
  },

  nav: {
    width: "260px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
    overflowY: "auto",
    // backgroundColor: "#3680caff",
  },
  navHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  navTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  // nav: {
  //   width: "260px",
  //   background: "rgba(15, 23, 42, 0.85)", // clean dark-transparent slate
  //   borderRight: "1px solid rgba(255, 255, 255, 0.08)",
  //   boxShadow: "2px 0 12px rgba(0, 0, 0, 0.3)",
  //   overflowY: "auto",
  //   backdropFilter: "blur(6px)",
  // },

  // navHeader: {
  //   padding: "20px 24px",
  //   borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  //   backgroundColor: "rgba(30, 41, 59, 0.7)", // clean slate color
  //   backdropFilter: "blur(4px)",
  // },

  // navTitle: {
  //   margin: 0,
  //   fontSize: "16px",
  //   fontWeight: "600",
  //   color: "#e2e8f0",
  //   textTransform: "uppercase",
  //   letterSpacing: "0.5px",
  // },

  navList: {
    listStyle: "none",
    padding: "16px 0",
    margin: 0,
    display: "flex",
    flexDirection: "column",
  },
  navItem: {
    margin: "4px 16px",
  },
  navLink: {
    display: "block",
    padding: "12px 16px",
    textDecoration: "none",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    position: "relative",
  },
  activeNavLink: {
    display: "block",
    padding: "12px 16px",
    textDecoration: "none",
    color: "#2563eb",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "8px",
    backgroundColor: "#eff6ff",
    borderLeft: "3px solid #2563eb",
    transition: "all 0.2s ease",
    position: "relative",
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "auto",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  iconButton: {
    backgroundColor: "#33b0cfff",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  },

  profileContainer: {
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginTop: "5px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 100,
  },
  dropdownItem: {
    padding: "8px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #eee",
  },

  footer: {
    backgroundColor: "#2d3748",
    color: "#fff",
    padding: "3rem 2rem 1rem",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
  },
  footerTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  footerText: {
    color: "#cbd5e0",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
  footerList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  footerListItem: {
    color: "#cbd5e0",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
    cursor: "pointer",
  },
  footerBottom: {
    borderTop: "1px solid #4a5568",
    paddingTop: "1.5rem",
    textAlign: "center",
  },
  footerCopyright: {
    color: "#cbd5e0",
    fontSize: "0.85rem",
  },
};
