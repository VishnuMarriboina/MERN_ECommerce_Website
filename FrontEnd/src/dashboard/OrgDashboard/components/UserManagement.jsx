import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Redux/features/auth";
import { AVATAR_COLORS } from "../../../components/DataFolder/componentsData";

/* ─── SVG Icons ───────────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ─── Avatar helper ───────────────────────────────────────────────── */
const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

/* ─── Component ───────────────────────────────────────────────────── */
export default function UserManagement() {
  const { loading, error, loadUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await loadUsers().unwrap();
      setUsersData(data);
    };

    load();
  }, [loadUsers]);

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
    return role === "Admin" ? S.roleAdmin : S.roleUser;
  };

  if (loading) {
    return (
      <div style={S.loadingContainer}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={S.spinner}></div>
        <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>Loading users…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={S.loadingContainer}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>Error: {error}</p>
      </div>
    );
  }

  const totalAdmins = users.filter((u) => u.User_Role === "Admin").length;
  const totalRegular = users.filter((u) => u.User_Role !== "Admin").length;

  return (
    <div style={S.container}>

      {/* ── Page Header ── */}
      <div style={S.pageHeader}>
        <div>
          <h1 style={S.pageTitle}>User Management</h1>
          <p style={S.pageSubtitle}>View and manage platform users</p>
        </div>
        <div style={S.statsRow}>
          <div style={S.statChip}>
            <span style={S.statChipLabel}>Total</span>
            <span style={S.statChipValue}>{users.length}</span>
          </div>
          <div style={S.statChip}>
            <span style={S.statChipLabel}>Admins</span>
            <span style={S.statChipValue}>{totalAdmins}</span>
          </div>
          <div style={S.statChip}>
            <span style={S.statChipLabel}>Users</span>
            <span style={S.statChipValue}>{totalRegular}</span>
          </div>
        </div>
      </div>

      {/* ── Search + Filter Toolbar ── */}
      <div style={S.toolbar}>
        {/* Search input with icon */}
        <div style={S.searchWrapper}>
          <span style={S.searchIconWrap}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, email or phone…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={S.searchInput}
          />
        </div>

        {/* Role filter pills */}
        <div style={S.roleFilters}>
          {["All", "Admin", "User"].map((role) => (
            <button
              key={role}
              style={roleFilter === role ? S.filterPillActive : S.filterPill}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div style={S.tableCard}>
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr style={S.tableHeadRow}>
                {["USER", "CONTACT", "GENDER", "AGE", "ROLE", "USER ID"].map((col) => (
                  <th key={col} style={S.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={S.emptyCell}>
                    <div style={S.emptyState}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                        <path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                      <p style={S.emptyTitle}>No users found</p>
                      <p style={S.emptySubtitle}>Try a different search term or role filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => {
                  const initial = (user.name || "?")[0].toUpperCase();
                  const bg = avatarColor(user.name);
                  return (
                    <tr
                      key={user._id}
                      style={S.tableRow}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {/* USER column */}
                      <td style={S.td}>
                        <div style={S.userCell}>
                          {/* Avatar */}
                          <div style={{ ...S.avatar, backgroundColor: bg }}>
                            {initial}
                          </div>
                          <div style={S.userInfo}>
                            <span style={S.userName}>{user.name || "N/A"}</span>
                            <span style={S.userEmail}>{user.email || "—"}</span>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td style={S.td}>
                        <span style={S.contactText}>{user.phoneNumber || "—"}</span>
                      </td>

                      {/* GENDER */}
                      <td style={S.td}>
                        <span style={S.mutedText}>
                          {user.gender
                            ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
                            : "—"}
                        </span>
                      </td>

                      {/* AGE */}
                      <td style={S.td}>
                        <span style={S.mutedText}>{user.age || "—"}</span>
                      </td>

                      {/* ROLE */}
                      <td style={S.td}>
                        <span style={getRoleBadgeStyle(user.User_Role)}>
                          {user.User_Role || "User"}
                        </span>
                      </td>

                      {/* USER ID */}
                      <td style={S.td}>
                        <span style={S.userId}>
                          {user._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const S = {
  container: {
    padding: "28px 32px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  /* Loading / Error */
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: 12,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e2e8f0",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  /* Page Header */
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    lineHeight: 1.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    margin: "4px 0 0 0",
  },
  statsRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  statChip: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
    borderRadius: 10,
    padding: "10px 16px",
    minWidth: 80,
  },
  statChipLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statChipValue: {
    fontSize: 17,
    fontWeight: 700,
    color: "#0f172a",
    marginTop: 2,
  },

  /* Toolbar */
  toolbar: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchWrapper: {
    position: "relative",
    flex: 1,
    minWidth: 240,
  },
  searchIconWrap: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    display: "inline-flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    paddingLeft: 36,
    paddingRight: 12,
    paddingTop: 0,
    paddingBottom: 0,
    height: 38,
    border: "1.5px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 13,
    color: "#0f172a",
    backgroundColor: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  roleFilters: {
    display: "flex",
    gap: 8,
    flexWrap: "nowrap",
  },
  filterPill: {
    padding: "6px 16px",
    border: "1.5px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#64748b",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: "nowrap",
    outline: "none",
    transition: "all 0.15s",
  },
  filterPillActive: {
    padding: "6px 16px",
    border: "1.5px solid #6366f1",
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: "nowrap",
    outline: "none",
  },

  /* Table Card */
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeadRow: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #f1f5f9",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    whiteSpace: "nowrap",
  },
  tableRow: {
    borderBottom: "1px solid #f8fafc",
    transition: "background 0.12s",
    cursor: "default",
  },
  td: {
    padding: "12px 16px",
    fontSize: 13,
    color: "#0f172a",
    verticalAlign: "middle",
  },

  /* User cell */
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
  },
  userEmail: {
    fontSize: 11,
    color: "#94a3b8",
  },

  /* Other cells */
  contactText: {
    fontSize: 13,
    color: "#475569",
  },
  mutedText: {
    fontSize: 13,
    color: "#94a3b8",
    textTransform: "capitalize",
  },
  userId: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#94a3b8",
    letterSpacing: "0.3px",
  },

  /* Role badges */
  roleAdmin: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#fdf2f8",
    color: "#9d174d",
    border: "1px solid #fbcfe8",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  roleUser: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },

  /* Empty state */
  emptyCell: {
    padding: "48px 16px",
    textAlign: "center",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#475569",
    margin: 0,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    margin: 0,
  },
};
