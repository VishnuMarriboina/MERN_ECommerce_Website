import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../../Redux/slices/OrderSlice";
import CustomModal from "../../../components/CustomModal";

export default function OrderManagement() {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(() => {
    return sessionStorage.getItem("statusFilter") || "All";
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [showStatusModal, setShowStatusModal] = useState(false);

  const {
    allOrders: ordersData,
    loading,
    error,
  } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const statusFlow = {
    Pending: "Confirmed",
    Confirmed: "Shipped",
    Shipped: "Delivered",
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    // setSelectedStatus(order.status);
    setShowStatusModal(true);
  };

  const updateStatus = async (newStatus) => {
    try {
      const res = await dispatch(
        updateOrderStatus(selectedOrder._id, newStatus)
      );

      // Always re-fetch
      await dispatch(fetchAllOrders());

      if (res?.success) {
        setModalTitle("Status Successful!");
        setModalMessage(
          `Order status updated successfully.\n\nOrder ID: ${selectedOrder._id
            .slice(-8)
            .toUpperCase()}`
        );
        setModalType("success");
      } else {
        setModalTitle("Update Failed");
        setModalMessage("Failed to update order status. Try again.");
        setModalType("error");
      }

      setModalOpen(true);
      setShowStatusModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
    }
  };

  const getOrdersArray = () => {
    if (Array.isArray(ordersData)) return ordersData;
    if (Array.isArray(ordersData?.orders)) return ordersData.orders;
    if (Array.isArray(ordersData?.data?.orders)) return ordersData.data.orders;
    return [];
  };

  const orders = getOrdersArray();

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + (order.totalAmount || 0);
  }, 0);

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  // Store category until tab closes
  useEffect(() => {
    sessionStorage.setItem("statusFilter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    const saved = sessionStorage.getItem("statusFilter");
    if (saved) setStatusFilter(saved);
  }, []);

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

  const getStatusStyle = (status) => {
    const statusStyles = {
      Confirmed: styles.statusConfirmed,
      Pending: styles.statusPending,
      Shipped: styles.statusShipped,
      Delivered: styles.statusDelivered,
      Cancelled: styles.statusCancelled,
    };
    return statusStyles[status] || styles.statusPending;
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading orders...</p>
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
        <h1 style={styles.pageTitle}>Order Management</h1>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Orders</span>
            <span style={styles.statValue}>{orders.length}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Total Revenue</span>
            <span style={styles.statValue}>₹ {totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div style={styles.filterContainer}>
        {[
          "All",
          "Pending",
          "Confirmed",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((status) => (
          <button
            key={status}
            style={{
              ...styles.filterBtn,
              ...(statusFilter === status && styles.filterBtnActive),
            }}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ ...styles.td, textAlign: "center", padding: "2rem" }}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.orderId}>
                      {order._id?.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {order.userId?.slice(-8).toUpperCase() || "N/A"}
                  </td>
                  <td style={styles.td}>{order.items?.length || 0}</td>
                  <td style={styles.td}>
                    <span style={styles.amount}>
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.paymentInfo}>
                      <span>{order.paymentType}</span>
                      {order.paymentMode && (
                        <span style={styles.paymentMode}>
                          ({order.paymentMode})
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>{formatDate(order.orderedDate)}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...getStatusStyle(order.status),
                        ...styles.statusClickable,
                      }}
                      onClick={() => openStatusModal(order)}
                      onMouseEnter={(e) => {
                        Object.assign(
                          e.target.style,
                          styles.statusClickableHover
                        );
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.target.style, {
                          backgroundColor: getStatusStyle(order.status)
                            .backgroundColor,
                        });
                      }}
                    >
                      {order.status}
                      <span
                        style={{
                          fontSize: "1rem",
                          marginLeft: "5px",
                          opacity: 0.7,
                        }}
                      >
                        ✏️
                      </span>
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => openOrderDetails(order)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Order Details</h2>
              <button style={styles.closeBtn} onClick={closeModal}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              {/* Order Info */}
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>Order Information</h3>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Order ID:</span>
                    <span style={styles.infoValue}>{selectedOrder._id}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Customer ID:</span>
                    <span style={styles.infoValue}>{selectedOrder.userId}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Status:</span>

                    <span style={getStatusStyle(selectedOrder.status)}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Order Date:</span>
                    <span style={styles.infoValue}>
                      {formatDate(selectedOrder.orderedDate)}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Payment Type:</span>
                    <span style={styles.infoValue}>
                      {selectedOrder.paymentType}
                    </span>
                  </div>
                  {selectedOrder.paymentMode && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Payment Mode:</span>
                      <span style={styles.infoValue}>
                        {selectedOrder.paymentMode}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div style={styles.modalSection}>
                <h3 style={styles.sectionTitle}>
                  Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div style={styles.itemsList}>
                  {selectedOrder.items?.map((item, index) => {
                    const details = item.details || {};
                    return (
                      <div key={item._id || index} style={styles.itemCardOuter}>
                        <span style={{ ...styles.itemCat, display: "block" }}>
                          category : {item.productModel?.toUpperCase()}
                        </span>

                        <div key={item._id || index} style={styles.itemCard}>
                          <div style={styles.itemHeader}>
                            <span style={styles.itemBrand}>
                              {details.brand || item.productModel || "Product"}
                            </span>
                            <span style={styles.itemPrice}>₹{item.price}</span>
                          </div>

                          {details.size && details.color && details.fit && (
                            <div style={styles.variantBadges}>
                              <span style={styles.badge}>
                                Size: {details.size}
                              </span>
                              <span style={styles.badge}>
                                Color: {details.color}
                              </span>
                              <span style={styles.badge}>
                                Fit: {details.fit}
                              </span>
                            </div>
                          )}

                          <div style={styles.itemDetails}>
                            <span>
                              Product ID:{" "}
                              {item.productId?.slice(-8).toUpperCase()}
                            </span>
                            {item.variantId && (
                              <span>
                                Variant ID:{" "}
                                {item.variantId?.slice(-8).toUpperCase()}
                              </span>
                            )}
                            <span>Quantity: {item.quantity}</span>
                            <span style={styles.itemSubtotal}>
                              Subtotal: ₹
                              {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div style={styles.totalSection}>
                <span style={styles.totalLabel}>Total Amount:</span>
                <span style={styles.totalValue}>
                  ₹{selectedOrder.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.closeModalBtn} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Status Modal */}

      {showStatusModal && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Update Order Status</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowStatusModal(false)}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              {selectedOrder.history && selectedOrder.history.length > 0 && (
                <div style={styles.historySection}>
                  <h4 style={styles.historySectionTitle}>Order History</h4>
                  <div style={styles.historyTimeline}>
                    {selectedOrder.history.map((hist, idx) => (
                      <div key={hist._id || idx} style={styles.historyItem}>
                        <div style={styles.historyDot}></div>
                        <div style={styles.historyContent}>
                          <div style={styles.historyText}>
                            <span style={styles.historyFrom}>{hist.from}</span>
                            <span style={styles.historyArrow}>→</span>
                            <span style={styles.historyTo}>{hist.to}</span>
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

              <div style={styles.modalSection}>
                {/* Status Row */}
                <div style={styles.statusRow}>
                  <div style={styles.statusValueBox}>
                    <span style={styles.infoLabel}>Order Status:</span>
                    <span style={styles.infoValue}>{selectedOrder.status}</span>
                  </div>
                  {/* Next Step Button */}
                  {statusFlow[selectedOrder?.status] ? (
                    <button
                      style={styles.modalActionBtn}
                      onMouseEnter={(e) =>
                        Object.assign(e.target.style, {
                          ...styles.statusBtnHover,
                          transform: "scale(1.05)", // if your hover has scale
                        })
                      }
                      onMouseLeave={(e) =>
                        Object.assign(e.target.style, {
                          ...styles.modalActionBtn,
                          transform: "scale(1)",
                        })
                      }
                      onClick={() =>
                        updateStatus(statusFlow[selectedOrder.status])
                      }
                    >
                      Mark as {statusFlow[selectedOrder.status]}
                    </button>
                  ) : (
                    <p
                      style={{
                        fontWeight: 600,
                        color:
                          selectedOrder.status === "Delivered"
                            ? "#16a34a" // green
                            : selectedOrder.status === "Cancelled"
                            ? "#dc2626" // red
                            : "#475569", // neutral
                      }}
                    >
                      {selectedOrder?.status === "Delivered" &&
                        "Your order has been successfully delivered."}

                      {selectedOrder?.status === "Cancelled" &&
                        "Your order has been cancelled."}
                    </p>
                  )}
                </div>

                {/* Cancel Order Button */}
                {selectedOrder.status !== "Delivered" &&
                  selectedOrder.status !== "Cancelled" && (
                    <button
                      style={styles.cancelOrderBtn}
                      onMouseEnter={(e) => {
                        Object.assign(e.target.style, {
                          ...styles.statusBtnHover,
                          transform: "scale(1.05)", // if your hover has scale
                        });
                      }}
                      onMouseLeave={(e) => {
                        Object.assign(e.target.style, {
                          ...styles.cancelOrderBtn,
                          transform: "scale(1)", // reset back!
                        });
                      }}
                      onClick={() => updateStatus("Cancelled")}
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.closeModalBtn}
                onClick={() => setShowStatusModal(false)}
              >
                Close
              </button>
            </div>
          </div>
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

    overflowX: "auto",
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
    marginTop: "1rem",
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
  itemCardOuter: {
    padding: "0.5rem",
    // backgroundColor: "#6ae23aff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
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

  itemCat: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "10px",
    display: "block",
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

  statusClickable: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "8px",
    transition: "0.2s",
  },

  statusClickableHover: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },

  modalActionBtn: {
    padding: "0.75rem 1rem",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "0.2s",
  },

  cancelOrderBtn: {
    padding: "0.75rem 1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "0.2s",
  },

  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    marginBottom: "1rem",
  },

  statusValueBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2d3748",
  },

  statusBtnHover: {
    transform: "scale(1.03)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },

  historySection: {
    padding: "1.5rem",
    backgroundColor: "#fafbfc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
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
};
