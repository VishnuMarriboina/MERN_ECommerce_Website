import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../Redux/slices/AuthSlice";

export default function UserManagement() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [usersData, setUsersData] = useState([]);

  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await dispatch(fetchUsers());
      if (res.success) {
        setUsersData(res?.allUsers);
      }
    };

    loadUsers();
  }, [dispatch]);

  const getUsersArray = () => {
    if (Array.isArray(usersData)) return usersData;
    if (Array.isArray(usersData?.data)) return usersData.data;
    if (Array.isArray(usersData?.users)) return usersData.users;
    return [];
  };
  const users = getUsersArray();
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm);

    const matchesRole = roleFilter === "All" || user.User_Role === roleFilter;

    return matchesSearch && matchesRole;
  });
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const roleA = a.User_Role?.toLowerCase();
    const roleB = b.User_Role?.toLowerCase();
    if (roleA === "admin" && roleB !== "admin") return -1;
    if (roleA !== "admin" && roleB === "admin") return 1;
    return 0;
  });
  const getRoleBadgeStyle = (role) => {
    return role === "Admin" ? styles.roleAdmin : styles.roleUser;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentHeader}>
        <h1 style={styles.pageTitle}>User Management</h1>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Users</span>
            <span style={styles.statValue}>{users.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Admins</span>
            <span style={styles.statValue}>
              {users.filter((u) => u.User_Role === "Admin").length}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.roleFilters}>
          {["All", "Admin", "User"].map((role) => (
            <button
              key={role}
              style={{
                ...styles.filterBtn,
                ...(roleFilter === role && styles.filterBtnActive),
              }}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Gender</th>
              <th style={styles.th}>Age</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>User ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ ...styles.td, textAlign: "center", padding: "2rem" }}
                >
                  No users found
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.userName}>{user.name || "N/A"}</span>
                  </td>
                  <td style={styles.td}>{user.email || "N/A"}</td>
                  <td style={styles.td}>{user.phoneNumber || "N/A"}</td>
                  <td style={styles.td}>{user.gender || "N/A"}</td>
                  <td style={styles.td}>{user.age || "N/A"}</td>
                  <td style={styles.td}>
                    <span style={getRoleBadgeStyle(user.User_Role)}>
                      {user.User_Role || "User"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.userId}>
                      {user._id?.slice(-8).toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f7fafc",
    minHeight: "100vh",
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
    border: "5px solid #e2e8f0",
    borderTop: "5px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    padding: "2rem",
    textAlign: "center",
  },
  errorText: {
    color: "#f56565",
    fontSize: "1.1rem",
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#2d3748",
    margin: 0,
  },
  statsContainer: {
    display: "flex",
    gap: "1rem",
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
  filterContainer: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  filterBtn: {
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
  filterBtnActive: {
    backgroundColor: "#667eea",
    color: "#fff",
    // borderColor: "#667eea",
  },
  searchContainer: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: "250px",
    padding: "0.75rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
  },
  roleFilters: {
    display: "flex",
    gap: "0.5rem",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
    overflowX: "auto",
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
    transition: "background 0.2s",
  },
  td: {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#2d3748",
  },
  orderId: {
    fontFamily: "monospace",
    fontWeight: "600",
    color: "#667eea",
  },
  userId: {
    fontFamily: "monospace",
    fontSize: "0.85rem",
    color: "#718096",
  },
  userName: {
    fontWeight: "600",
    color: "#2d3748",
  },
  amount: {
    fontWeight: "700",
    color: "#48bb78",
  },
  paymentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  paymentMode: {
    fontSize: "0.85rem",
    color: "#718096",
  },
  statusConfirmed: {
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
  statusDelivered: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#b2f5ea",
    color: "#234e52",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  statusCancelled: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#fed7d7",
    color: "#c53030",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  roleAdmin: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#fbb6ce",
    color: "#97266d",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  roleUser: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#e6fffa",
    color: "#234e52",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  viewBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#2d3748",
    margin: 0,
  },
  closeBtn: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: "#718096",
    fontSize: "2rem",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: "1.5rem",
    overflowY: "auto",
    flex: 1,
  },
  modalSection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "1rem",
    borderBottom: "2px solid #667eea",
    paddingBottom: "0.5rem",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  infoLabel: {
    fontSize: "0.85rem",
    color: "#718096",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: "0.95rem",
    color: "#2d3748",
    fontWeight: "600",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  itemCard: {
    padding: "1rem",
    backgroundColor: "#f7fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  itemBrand: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#2d3748",
  },
  itemPrice: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#48bb78",
  },
  variantBadges: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.75rem",
    flexWrap: "wrap",
  },
  badge: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#e6fffa",
    color: "#234e52",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  itemDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.9rem",
    color: "#4a5568",
    paddingTop: "0.75rem",
    borderTop: "1px solid #e2e8f0",
  },
  itemSubtotal: {
    fontWeight: "700",
    color: "#667eea",
    fontSize: "1rem",
  },
  totalSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    backgroundColor: "#f7fafc",
    borderRadius: "8px",
    marginTop: "1rem",
  },
  totalLabel: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#2d3748",
  },
  totalValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#48bb78",
  },
  modalFooter: {
    padding: "1.5rem",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
  },
  closeModalBtn: {
    padding: "0.75rem 1.5rem",
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
};
