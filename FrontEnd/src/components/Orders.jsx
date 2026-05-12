// new code
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../Redux/slices/OrderSlice";
import { useNavigate } from "react-router-dom";
import shirt from "../assets/shirt_icon.png";
import Shoe from "../assets/shoe.jpg";
import Belt from "../assets/Belt.jpg";
import Watch from "../assets/watch.jpg";
import Sandal from "../assets/slippers.webp";
import tshirt from "../assets/Tshirt.jpg";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orders } = useSelector((state) => state.order);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statusOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const statusColors = {
      Confirmed: "#10b981",
      Pending: "#f59e0b",
      Shipped: "#3b82f6",
      Delivered: "#6366f1",
      Cancelled: "#ef4444",
    };
    return statusColors[status] || "#64748b";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Confirmed: "✓",
      Pending: "⏳",
      Shipped: "🚚",
      Delivered: "📦",
      Cancelled: "✗",
    };
    return icons[status] || "•";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryIcon = (model) => {
    if (!model) return "📦";

    const formatted = model.toLowerCase().trim();

    const icons = {
      tshirt: tshirt,
      shirt: shirt,
      shirts: shirt,
      t_shirt: tshirt,
      "t-shirt": tshirt,
      belt: Belt,
      watch: Watch,
      watches: Watch,
      shoe: Shoe,
      shoes: Shoe,
      sandal: Sandal,
      sandals: Sandal,
    };

    return icons[formatted] || "📦";
  };

  const filterOrders = () => {
    let filtered = orders || [];

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    return filtered;
  };

  const filteredOrders = filterOrders();
  const filteredCount = filteredOrders.length;

  const getStatusCount = (status) => {
    if (status === "All") return orders?.length || 0;
    return orders?.filter((order) => order.status === status).length || 0;
  };

  const openItemModal = (item, order) => {
    setSelectedItem({ ...item, orderInfo: order });

    console.log("item", item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading Orders...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Failed to Load Orders</h3>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>My Orders</h1>
              <p style={styles.pageSubtitle}>
                {filteredCount} {filteredCount === 1 ? "Order" : "Orders"} Found
              </p>
            </div>
            <div>
              <button style={styles.primaryBtn} onClick={() => navigate("/")}>
                Continue Shopping
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🛍️</div>
              <h3 style={styles.emptyTitle}>No Orders Yet</h3>
              <p style={styles.emptyMessage}>
                Start shopping to see your orders here!
              </p>
            </div>
          ) : (
            <div style={styles.mainContent}>
              {/* Sidebar */}
              <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                  <h3 style={styles.sidebarTitle}>Filter Orders</h3>
                </div>

                {/* Status Filter */}
                <div style={styles.filterSection}>
                  <h4 style={styles.filterTitle}>Order Status</h4>
                  <div style={styles.statusList}>
                    {statusOptions.map((status) => (
                      <div
                        key={status}
                        style={{
                          ...styles.statusItem,
                          ...(selectedStatus === status
                            ? styles.statusItemActive
                            : {}),
                        }}
                        onClick={() => setSelectedStatus(status)}
                      >
                        <div style={styles.statusItemLeft}>
                          {status !== "All" && (
                            <span
                              style={{
                                ...styles.statusDot,
                                backgroundColor: getStatusColor(status),
                              }}
                            ></span>
                          )}
                          <span style={styles.statusName}>{status}</span>
                        </div>
                        <span style={styles.statusCount}>
                          {getStatusCount(status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Container */}
              <div style={styles.ordersContainer}>
                {filteredOrders.length === 0 ? (
                  <div style={styles.noResults}>
                    <div style={styles.noResultsIcon}>🔍</div>
                    <h3 style={styles.noResultsTitle}>No Orders Found</h3>
                    <p style={styles.noResultsMessage}>
                      Try adjusting your filters
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order, index) => (
                    <div key={order._id || index} style={styles.orderCard}>
                      {/* Order Header */}
                      <div style={styles.orderHeader}>
                        <div style={styles.orderHeaderLeft}>
                          <div style={styles.orderIdSection}>
                            <span style={styles.orderIdLabel}>Order ID:</span>
                            <span style={styles.orderIdValue}>
                              {order._id?.slice(-8).toUpperCase()}
                            </span>
                          </div>
                          <span style={styles.orderDate}>
                            {formatDate(order.orderedDate)}
                          </span>
                        </div>
                        <div
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: getStatusColor(order.status),
                          }}
                        >
                          <span style={styles.statusIcon}>
                            {getStatusIcon(order.status)}
                          </span>
                          {order.status}
                        </div>
                      </div>

                      {/* Order History */}
                      {order.history && order.history.length > 0 && (
                        <div style={styles.historySection}>
                          <h4 style={styles.historySectionTitle}>
                            Order History
                          </h4>
                          <div style={styles.historyTimeline}>
                            {order.history.map((hist, idx) => (
                              <div
                                key={hist._id || idx}
                                style={styles.historyItem}
                              >
                                <div style={styles.historyDot}></div>
                                <div style={styles.historyContent}>
                                  <div style={styles.historyText}>
                                    <span style={styles.historyFrom}>
                                      {hist.from}
                                    </span>
                                    <span style={styles.historyArrow}>→</span>
                                    <span style={styles.historyTo}>
                                      {hist.to}
                                    </span>
                                  </div>
                                  <div style={styles.historyDate}>
                                    {formatDate(hist.changedAt)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Order Items */}
                      <div style={styles.itemsSection}>
                        <h4 style={styles.itemsTitle}>
                          Items ({order.items?.length || 0})
                        </h4>

                        <div style={styles.itemsList}>
                          {order.items?.map((item, itemIndex) => {
                            const title = item.productModel || "Product";

                            const imageSrc =
                              item.details?.image_url &&
                              item.details.image_url.trim() !== "" &&
                              item.details.image_url !== "No image found"
                                ? item.details.image_url
                                : getCategoryIcon(item.productModel);

                            return (
                              <div
                                key={item._id || itemIndex}
                                style={styles.itemCard}
                                onClick={() => openItemModal(item, order)}
                              >
                                <div>
                                  <img
                                    src={imageSrc}
                                    alt={title}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        getCategoryIcon(title);
                                    }}
                                    style={styles.itemImage}
                                  />
                                </div>

                                <div style={styles.itemDetails}>
                                  <div style={styles.itemName}>
                                    {title.charAt(0).toUpperCase() +
                                      title.slice(1)}
                                  </div>

                                  <div style={styles.itemMeta}>
                                    <span style={styles.itemQuantity}>
                                      Qty: {item.quantity}
                                    </span>
                                    <span style={styles.itemPrice}>
                                      ₹{item.price?.toFixed(2)}
                                    </span>
                                  </div>

                                  <div style={styles.itemId}>
                                    ID: {item.productId?.slice(-8)}
                                  </div>
                                </div>

                                <div style={styles.viewDetailsBtn}>
                                  View Details →
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div style={styles.orderFooter}>
                        <div style={styles.paymentMethod}>
                          <span style={styles.paymentLabel}>Payment:</span>
                          <span style={styles.paymentValue}>
                            {order.paymentType} - {order.paymentMode}
                          </span>
                        </div>
                        <div style={styles.totalSection}>
                          <span style={styles.totalLabel}>Total Amount:</span>
                          <span style={styles.totalAmount}>
                            ₹{order.totalAmount?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedItem && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Product Details</h2>
              <button style={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalImageSection}>
                <img
                  src={
                    selectedItem.details?.image_url &&
                    selectedItem.details.image_url !== "No image found"
                      ? selectedItem.details.image_url
                      : getCategoryIcon(selectedItem.productModel)
                  }
                  alt={selectedItem.productModel}
                  style={styles.modalImage}
                  onError={(e) => {
                    e.currentTarget.src = getCategoryIcon(
                      selectedItem.productModel
                    );
                  }}
                />
              </div>

              <div style={styles.modalDetailsSection}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Product:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.productModel?.toUpperCase()}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Product ID:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.productId}
                  </span>
                </div>

                {/* <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Variant ID:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.variantId}
                  </span>
                </div> */}

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Quantity:</span>
                  <span style={styles.detailValue}>
                    {selectedItem.quantity}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Price:</span>
                  <span style={styles.detailValue}>
                    ₹{selectedItem.price?.toFixed(2)}
                  </span>
                </div>

                {selectedItem.details && (
                  <>
                    <div style={styles.divider}></div>
                    <h3 style={styles.modalSubtitle}>Product Specifications</h3>

                    {selectedItem.details.brand && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Brand:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.brand}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.category && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Category:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.category}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.color && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Color:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.color}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.size && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Size:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.size}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.type_of_material && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Material:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.type_of_material}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.fit && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Fit:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.fit}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.collar_type && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Collar Type:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.collar_type}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.sleeve_type && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Sleeve Type:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.sleeve_type}
                        </span>
                      </div>
                    )}

                    {selectedItem.details.cost && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Cost:</span>
                        <span style={styles.detailValue}>
                          ₹{selectedItem.details.cost}
                        </span>
                      </div>
                    )}

                    {/* {selectedItem.details.count !== undefined && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Stock Count:</span>
                        <span style={styles.detailValue}>
                          {selectedItem.details.count}
                        </span>
                      </div>
                    )} */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  loadingText: {
    fontSize: "1.1rem",
    color: "#64748b",
    fontWeight: 500,
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "2rem",
  },
  errorIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
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
  content: {
    margin: "0 auto",
    padding: "2rem 5rem",
    maxWidth: "1400px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
    marginBottom: "0.5rem",
  },
  pageSubtitle: {
    fontSize: "1rem",
    color: "#64748b",
    fontWeight: 400,
  },
  primaryBtn: {
    padding: "12px 24px",
    borderRadius: 8,
    background: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40vh",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
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
  mainContent: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "flex-start",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    position: "sticky",
    top: "2rem",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  sidebarTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
  },
  filterSection: {
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  filterTitle: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statusList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  statusItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: "#f8fafc",
  },
  statusItemActive: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  statusItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  statusName: {
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  statusCount: {
    fontSize: "0.85rem",
    fontWeight: 600,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: "0.25rem 0.5rem",
    borderRadius: "12px",
  },
  dateInputs: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  dateInputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  dateLabel: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#64748b",
  },
  dateInput: {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.9rem",
    fontFamily: "inherit",
  },
  clearBtn: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500,
    width: "100%",
  },

  ordersContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  noResults: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
  },
  noResultsIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  noResultsTitle: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  noResultsMessage: {
    fontSize: "1rem",
    color: "#64748b",
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  orderHeaderLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  orderIdSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  orderIdLabel: {
    fontSize: "0.85rem",
    color: "#64748b",
    fontWeight: 500,
  },
  orderIdValue: {
    fontSize: "1rem",
    color: "#1e293b",
    fontWeight: 700,
    fontFamily: "monospace",
  },
  orderDate: {
    fontSize: "0.85rem",
    color: "#64748b",
  },
  statusBadge: {
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    color: "white",
    fontSize: "0.85rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  statusIcon: {
    fontSize: "1rem",
  },
  historySection: {
    padding: "1.5rem",
    backgroundColor: "#fafbfc",
    borderBottom: "1px solid #e2e8f0",
  },
  historySectionTitle: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "1rem",
    margin: 0,
  },
  historyTimeline: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  historyItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  historyDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    marginTop: "0.25rem",
    flexShrink: 0,
  },
  historyContent: {
    flex: 1,
  },
  historyText: {
    fontSize: "0.9rem",
    color: "#1e293b",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  historyFrom: {
    color: "#64748b",
  },
  historyArrow: {
    color: "#94a3b8",
  },
  historyTo: {
    color: "#10b981",
    fontWeight: 600,
  },
  historyDate: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    marginTop: "0.25rem",
  },
  itemsSection: {
    padding: "1.5rem",
  },
  itemsTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "1rem",
    margin: 0,
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginTop: "1rem",
  },
  itemCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  itemImage: {
    width: 110,
    height: 110,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #eef2f7",
    background: "#d3d9dfff",
  },
  itemDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  itemName: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1e293b",
  },
  itemMeta: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  itemQuantity: {
    fontSize: "0.85rem",
    color: "#64748b",
  },
  itemPrice: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#3b82f6",
  },
  itemId: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  viewDetailsBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderTop: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  paymentMethod: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  paymentLabel: {
    fontSize: "0.85rem",
    color: "#64748b",
  },
  paymentValue: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#1e293b",
  },
  totalSection: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
  },
  totalAmount: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#10b981",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "800px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#64748b",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  modalBody: {
    padding: "1.5rem",
  },
  modalImageSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  modalImage: {
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  modalDetailsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 0",
    borderBottom: "1px solid #f1f5f9",
  },
  detailLabel: {
    fontSize: "0.9rem",
    fontWeight: 500,
    color: "#64748b",
  },
  detailValue: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#1e293b",
    textAlign: "right",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "1rem 0",
  },
  modalSubtitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
};
