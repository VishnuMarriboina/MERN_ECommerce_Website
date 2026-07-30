import React, { useEffect, useState } from "react";
import { useOrder } from "../../../Redux/features/order";
import CustomModal from "../../../components/CustomModal";
import {
  ORDER_STATUS_STEPS as STATUS_STEPS,
  ORDER_FILTER_OPTIONS,
} from "../DataFolder/orgDashboardData";

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
const PencilIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);


export default function OrderManagement() {
  const {
    allOrders: ordersData, loading, error, loadAllOrders, updateStatus: updateOrderStatus,
  } = useOrder();
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

  useEffect(() => {
    loadAllOrders();
  }, [loadAllOrders]);

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
      const res = await updateOrderStatus({ orderId: selectedOrder._id, status: newStatus });

      // Always re-fetch
      await loadAllOrders();

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
    const datePart = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { datePart, timePart };
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      Confirmed: S.statusConfirmed,
      Pending: S.statusPending,
      Shipped: S.statusShipped,
      Delivered: S.statusDelivered,
      Cancelled: S.statusCancelled,
    };
    return statusStyles[status] || S.statusPending;
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
      <div style={S.loadingContainer}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={S.spinner}></div>
        <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={S.loadingContainer}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={S.container}>

      {/* ── Page Header ── */}
      <div style={S.pageHeader}>
        <div>
          <h1 style={S.pageTitle}>Order Management</h1>
          <p style={S.pageSubtitle}>Track and manage all customer orders</p>
        </div>
        <div style={S.statsRow}>
          <div style={S.statChip}>
            <span style={S.statChipLabel}>Total Orders</span>
            <span style={S.statChipValue}>{orders.length}</span>
          </div>
          <div style={S.statChip}>
            <span style={S.statChipLabel}>Revenue</span>
            <span style={S.statChipValue}>
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Status Filter Toolbar ── */}
      <div style={S.filterBar}>
        {ORDER_FILTER_OPTIONS.map((status) => (
          <button
            key={status}
            style={statusFilter === status ? S.filterPillActive : S.filterPill}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={S.tableCard}>
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr style={S.tableHeadRow}>
                {["ORDER ID", "CUSTOMER", "ITEMS", "AMOUNT", "PAYMENT", "DATE", "STATUS", "ACTIONS"].map((col) => (
                  <th key={col} style={S.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={S.emptyCell}>
                    <div style={S.emptyState}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      <p style={S.emptyTitle}>No orders found</p>
                      <p style={S.emptySubtitle}>Try adjusting the status filter above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const { datePart, timePart } = formatDate(order.orderedDate);
                  return (
                    <tr
                      key={order._id}
                      style={S.tableRow}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {/* Order ID */}
                      <td style={S.td}>
                        <span style={S.orderId}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td style={S.td}>
                        <span style={S.customerChip}>
                          {order.userId?.slice(-8).toUpperCase() || "N/A"}
                        </span>
                      </td>

                      {/* Items */}
                      <td style={S.td}>
                        <span style={S.itemsPill}>
                          {order.items?.length || 0} items
                        </span>
                      </td>

                      {/* Amount */}
                      <td style={S.td}>
                        <span style={S.amount}>₹{order.totalAmount?.toFixed(2)}</span>
                      </td>

                      {/* Payment */}
                      <td style={S.td}>
                        <div style={S.paymentCell}>
                          <span style={S.paymentType}>{order.paymentType}</span>
                          {order.paymentMode && (
                            <span style={S.paymentMode}>{order.paymentMode}</span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={S.td}>
                        <div style={S.dateCell}>
                          <span style={S.dateMain}>{datePart}</span>
                          <span style={S.dateTime}>{timePart}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={S.td}>
                        <span
                          style={{ ...getStatusStyle(order.status), ...S.statusClickable }}
                          onClick={() => openStatusModal(order)}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          {order.status}
                          <span style={{ display: "inline-flex", marginLeft: 5, opacity: 0.7 }}>
                            <PencilIcon />
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={S.td}>
                        <button
                          style={S.eyeBtn}
                          onClick={() => openOrderDetails(order)}
                          title="View details"
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dbeafe")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Details Modal ── */}
      {showModal && selectedOrder && (
        <div style={S.overlay} onClick={closeModal}>
          <div style={{ ...S.modal, maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={S.modalHeader}>
              <div>
                <h2 style={S.modalTitle}>Order Details</h2>
                <p style={S.modalRef}>#{selectedOrder._id?.slice(-8).toUpperCase()}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={getStatusStyle(selectedOrder.status)}>{selectedOrder.status}</span>
                <button style={S.closeBtnCircle} onClick={closeModal}><CloseIcon /></button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={S.modalBody}>

              {/* Section 1: Order Information */}
              <div style={S.section}>
                <p style={S.sectionTitle}>Order Information</p>
                <div style={S.infoGrid}>
                  <div style={S.infoItem}>
                    <span style={S.infoLabel}>Order ID</span>
                    <span style={S.infoValue}>{selectedOrder._id}</span>
                  </div>
                  <div style={S.infoItem}>
                    <span style={S.infoLabel}>Customer ID</span>
                    <span style={S.infoValue}>{selectedOrder.userId}</span>
                  </div>
                  <div style={S.infoItem}>
                    <span style={S.infoLabel}>Status</span>
                    <span style={getStatusStyle(selectedOrder.status)}>{selectedOrder.status}</span>
                  </div>
                  <div style={S.infoItem}>
                    <span style={S.infoLabel}>Date</span>
                    <span style={S.infoValue}>
                      {formatDate(selectedOrder.orderedDate).datePart} · {formatDate(selectedOrder.orderedDate).timePart}
                    </span>
                  </div>
                  <div style={S.infoItem}>
                    <span style={S.infoLabel}>Payment Type</span>
                    <span style={S.infoValue}>{selectedOrder.paymentType}</span>
                  </div>
                  {selectedOrder.paymentMode && (
                    <div style={S.infoItem}>
                      <span style={S.infoLabel}>Payment Mode</span>
                      <span style={S.infoValue}>{selectedOrder.paymentMode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Items */}
              <div style={S.section}>
                <p style={S.sectionTitle}>Items ({selectedOrder.items?.length || 0})</p>
                <div style={S.itemsList}>
                  {selectedOrder.items?.map((item, index) => {
                    const details = item.details || {};
                    return (
                      <div key={item._id || index} style={S.itemCard}>
                        {/* Category badge */}
                        <span style={S.itemCatBadge}>{item.productModel?.toUpperCase()}</span>

                        {/* Brand + Price */}
                        <div style={S.itemHeader}>
                          <span style={S.itemBrand}>{details.brand || item.productModel || "Product"}</span>
                          <span style={S.itemPrice}>₹{item.price}</span>
                        </div>

                        {/* Variant badges */}
                        {details.size && details.color && details.fit && (
                          <div style={S.variantBadges}>
                            <span style={S.variantBadge}>Size: {details.size}</span>
                            <span style={S.variantBadge}>Color: {details.color}</span>
                            <span style={S.variantBadge}>Fit: {details.fit}</span>
                          </div>
                        )}

                        {/* Details grid */}
                        <div style={S.itemDetailsGrid}>
                          <div style={S.itemDetailCell}>
                            <span style={S.itemDetailLabel}>Product ID</span>
                            <span style={S.itemDetailValue}>{item.productId?.slice(-8).toUpperCase()}</span>
                          </div>
                          {item.variantId && (
                            <div style={S.itemDetailCell}>
                              <span style={S.itemDetailLabel}>Variant ID</span>
                              <span style={S.itemDetailValue}>{item.variantId?.slice(-8).toUpperCase()}</span>
                            </div>
                          )}
                          <div style={S.itemDetailCell}>
                            <span style={S.itemDetailLabel}>Qty</span>
                            <span style={S.itemDetailValue}>{item.quantity}</span>
                          </div>
                          <div style={S.itemDetailCell}>
                            <span style={S.itemDetailLabel}>Subtotal</span>
                            <span style={{ ...S.itemDetailValue, color: "#10b981", fontWeight: 700 }}>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Row */}
              <div style={S.totalRow}>
                <span style={S.totalLabel}>Total Amount</span>
                <span style={S.totalValue}>₹{selectedOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={S.modalFooter}>
              <button style={S.closeModalBtn} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Update Modal ── */}
      {showStatusModal && selectedOrder && (
        <div style={S.overlay}>
          <div style={{ ...S.modal, maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Update Order Status</h2>
              <button style={S.closeBtnCircle} onClick={() => setShowStatusModal(false)}>
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div style={S.modalBody}>

              {/* Progress bar (non-cancelled) */}
              {selectedOrder.status !== "Cancelled" ? (
                <div style={S.progressContainer}>
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = STATUS_STEPS.indexOf(selectedOrder.status);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <React.Fragment key={step}>
                        <div style={S.progressStep}>
                          <div style={{
                            ...S.progressCircle,
                            backgroundColor: isCompleted ? "#10b981" : isCurrent ? "#6366f1" : "#f1f5f9",
                            color: (isCompleted || isCurrent) ? "#fff" : "#94a3b8",
                          }}>
                            {isCompleted ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                              <span style={{ fontSize: 11, fontWeight: 700 }}>{idx + 1}</span>
                            )}
                          </div>
                          <span style={{
                            ...S.progressLabel,
                            color: isCurrent ? "#4338ca" : isCompleted ? "#10b981" : "#94a3b8",
                            fontWeight: isCurrent ? 700 : 500,
                          }}>
                            {step}
                          </span>
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div style={{
                            ...S.progressLine,
                            backgroundColor: idx < currentIdx ? "#10b981" : "#e2e8f0",
                          }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div style={S.cancelledBanner}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span>This order has been cancelled</span>
                </div>
              )}

              {/* History */}
              {selectedOrder.history && selectedOrder.history.length > 0 && (
                <div style={S.historySection}>
                  <p style={S.historySectionTitle}>Status History</p>
                  <div style={S.historyTimeline}>
                    {selectedOrder.history.map((hist, idx) => {
                      const { datePart, timePart } = formatDate(hist.changedAt);
                      return (
                        <div key={hist._id || idx} style={S.historyItem}>
                          <div style={S.historyDot}></div>
                          <div style={S.historyContent}>
                            <div style={S.historyText}>
                              <span style={S.historyFrom}>{hist.from}</span>
                              <span style={S.historyArrow}>
                                <ArrowRightIcon />
                              </span>
                              <span style={S.historyTo}>{hist.to}</span>
                            </div>
                            <div style={S.historyDate}>{datePart} · {timePart}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action row */}
              <div style={S.statusActionRow}>
                <div style={S.statusActionLeft}>
                  <span style={S.infoLabel}>Current Status</span>
                  <span style={getStatusStyle(selectedOrder.status)}>{selectedOrder.status}</span>
                </div>
                <div>
                  {statusFlow[selectedOrder?.status] ? (
                    <button
                      style={S.markAsBtn}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6366f1")}
                      onClick={() => updateStatus(statusFlow[selectedOrder.status])}
                    >
                      Mark as {statusFlow[selectedOrder.status]}
                    </button>
                  ) : (
                    <p style={{
                      fontWeight: 600,
                      fontSize: 14,
                      margin: 0,
                      color: selectedOrder.status === "Delivered" ? "#15803d"
                        : selectedOrder.status === "Cancelled" ? "#be123c"
                        : "#475569",
                    }}>
                      {selectedOrder.status === "Delivered" && "Order successfully delivered."}
                      {selectedOrder.status === "Cancelled" && "Order has been cancelled."}
                    </p>
                  )}
                </div>
              </div>

              {/* Cancel order button */}
              {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && (
                <button
                  style={S.cancelOrderBtn}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
                  onClick={() => updateStatus("Cancelled")}
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Footer */}
            <div style={S.modalFooter}>
              <button style={S.closeModalBtn} onClick={() => setShowStatusModal(false)}>
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
    minWidth: 110,
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

  /* Filter Bar */
  filterBar: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    overflowX: "auto",
    paddingBottom: 2,
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

  /* Cell styles */
  orderId: {
    fontFamily: "monospace",
    fontWeight: 600,
    fontSize: 13,
    color: "#6366f1",
    letterSpacing: "0.3px",
  },
  customerChip: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#94a3b8",
    letterSpacing: "0.3px",
  },
  itemsPill: {
    display: "inline-block",
    padding: "3px 10px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  amount: {
    fontWeight: 700,
    color: "#0f172a",
    fontSize: 13,
  },
  paymentCell: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  paymentType: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: 500,
  },
  paymentMode: {
    fontSize: 11,
    color: "#94a3b8",
  },
  dateCell: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  dateMain: {
    fontSize: 13,
    color: "#0f172a",
  },
  dateTime: {
    fontSize: 11,
    color: "#94a3b8",
  },

  /* Status badges */
  statusClickable: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    transition: "opacity 0.15s",
    userSelect: "none",
  },
  statusPending: {
    padding: "4px 10px",
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  statusConfirmed: {
    padding: "4px 10px",
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  statusShipped: {
    padding: "4px 10px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  statusDelivered: {
    padding: "4px 10px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  statusCancelled: {
    padding: "4px 10px",
    backgroundColor: "#fff1f2",
    color: "#be123c",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },

  /* Eye button */
  eyeBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    border: "1.5px solid #bfdbfe",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    borderRadius: 7,
    cursor: "pointer",
    transition: "background 0.15s",
    outline: "none",
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

  /* Modal overlay */
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15,23,42,0.5)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "95%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  modalRef: {
    fontSize: 12,
    color: "#94a3b8",
    margin: "3px 0 0 0",
    fontFamily: "monospace",
  },
  closeBtnCircle: {
    width: 32,
    height: 32,
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
    outline: "none",
    flexShrink: 0,
  },
  modalBody: {
    padding: "20px 24px",
    overflowY: "auto",
    flex: 1,
  },
  modalFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  closeModalBtn: {
    padding: "9px 20px",
    border: "none",
    backgroundColor: "#6366f1",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    outline: "none",
  },

  /* Sections */
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 12px 0",
    paddingBottom: 8,
    borderBottom: "1px solid #f1f5f9",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px 20px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  infoValue: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: 600,
    wordBreak: "break-all",
  },

  /* Items */
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  itemCard: {
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    borderLeft: "3px solid #6366f1",
    padding: "14px 16px",
    backgroundColor: "#fafafa",
  },
  itemCatBadge: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "2px 8px",
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    borderRadius: 6,
    marginBottom: 8,
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemBrand: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: "#10b981",
  },
  variantBadges: {
    display: "flex",
    gap: 6,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  variantBadge: {
    padding: "3px 10px",
    backgroundColor: "#f0fdfa",
    color: "#0f766e",
    border: "1px solid #99f6e4",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  itemDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "6px 16px",
    paddingTop: 10,
    borderTop: "1px solid #f1f5f9",
  },
  itemDetailCell: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  itemDetailLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  itemDetailValue: {
    fontSize: 12,
    color: "#475569",
    fontWeight: 600,
    fontFamily: "monospace",
  },

  /* Total row */
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    border: "1px solid #f1f5f9",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#10b981",
  },

  /* Progress bar */
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    padding: "16px 8px",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #f1f5f9",
  },
  progressStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    transition: "background 0.2s",
  },
  progressLabel: {
    fontSize: 10,
    textAlign: "center",
    whiteSpace: "nowrap",
    letterSpacing: "0.2px",
  },
  progressLine: {
    height: 2,
    width: 32,
    marginBottom: 18,
    transition: "background 0.2s",
  },

  /* Cancelled banner */
  cancelledBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    backgroundColor: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: 10,
    color: "#be123c",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 20,
  },

  /* History */
  historySection: {
    padding: "14px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: 10,
    marginBottom: 20,
  },
  historySectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 12px 0",
  },
  historyTimeline: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  historyItem: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    marginTop: 3,
    flexShrink: 0,
  },
  historyContent: {
    flex: 1,
  },
  historyText: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  historyFrom: {
    color: "#64748b",
  },
  historyArrow: {
    color: "#94a3b8",
    display: "inline-flex",
    alignItems: "center",
  },
  historyTo: {
    color: "#10b981",
    fontWeight: 600,
  },
  historyDate: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },

  /* Status action row */
  statusActionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    marginBottom: 12,
  },
  statusActionLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  markAsBtn: {
    padding: "9px 18px",
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "background 0.15s",
    outline: "none",
  },
  cancelOrderBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "background 0.15s",
    outline: "none",
    marginTop: 4,
  },
};
