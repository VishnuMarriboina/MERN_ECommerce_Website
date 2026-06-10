import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../Redux/slices/OrderSlice";
import { useNavigate } from "react-router-dom";
import {
  STATUS_OPTIONS,
  ORDER_STATUS_COLORS as STATUS_COLORS,
  CATEGORY_IMAGES,
} from "./DataFolder/componentsData";
import api from "../utils/APIKit";

function getStatusColor(status) {
  return STATUS_COLORS[status] || "#64748b";
}

/* ── Star picker ─────────────────────────────────────────── */
function StarRating({ value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          style={{
            fontSize: 26,
            cursor: disabled ? "default" : "pointer",
            color: star <= (hovered || value) ? "#f59e0b" : "#e2e8f0",
            transition: "color 0.12s",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function getCategoryImage(model) {
  return CATEGORY_IMAGES[model?.toLowerCase().trim()] || null;
}

// Mirrors the product-list logic: specific variant → first variant → category asset
function getItemImage(item) {
  const variants = item.details?.variants;
  if (variants?.length) {
    const matched = variants.find((v) => String(v._id) === String(item.variantId));
    const url = matched?.image_url || variants[0]?.image_url;
    if (url && url !== "No image found") return url;
  }
  return getCategoryImage(item.productModel);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orders } = useSelector((state) => state.order);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  // ratings keyed by productId: { userRating, submitting, submitted }
  const [ratings, setRatings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("productRatings") || "{}"); } catch { return {}; }
  });
  const [pendingStar, setPendingStar] = useState({});

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filteredOrders = selectedStatus === "All"
    ? (orders || [])
    : (orders || []).filter((o) => o.status === selectedStatus);

  const getCount = (status) =>
    status === "All"
      ? orders?.length || 0
      : orders?.filter((o) => o.status === status).length || 0;

  const openModal = (item, order) => setSelectedItem({ ...item, orderInfo: order });
  const closeModal = () => setSelectedItem(null);

  const submitRating = useCallback(async (productId, variantId, productModel, star) => {
    setRatings((prev) => {
      const next = { ...prev, [variantId]: { ...prev[variantId], submitting: true } };
      localStorage.setItem("productRatings", JSON.stringify(next));
      return next;
    });
    try {
      const res = await api.post("/products/rate", { productId, variantId, productModel, rating: star });
      const data = res.data.data;
      setRatings((prev) => {
        const next = { ...prev, [variantId]: { userRating: data.userRating, submitting: false, submitted: true, avgRating: data.rating, ratingCount: data.ratingCount } };
        localStorage.setItem("productRatings", JSON.stringify(next));
        return next;
      });
    } catch {
      setRatings((prev) => {
        const next = { ...prev, [variantId]: { ...prev[variantId], submitting: false } };
        localStorage.setItem("productRatings", JSON.stringify(next));
        return next;
      });
    }
  }, []);

  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={styles.mutedText}>Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <div style={styles.alertBox}>
          <span style={styles.alertTitle}>Failed to load orders</span>
          <span style={styles.mutedText}>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>My Orders</h1>
          <p style={styles.pageSubtitle}>
            {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
        <button style={styles.shopBtn} onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>

      {/* Status filter tabs */}
      <div style={styles.filterBar}>
        {STATUS_OPTIONS.map((status) => {
          const active = selectedStatus === status;
          const color = status === "All" ? "#3b82f6" : getStatusColor(status);
          return (
            <button
              key={status}
              style={{
                ...styles.filterTab,
                ...(active
                  ? { backgroundColor: color, color: "#fff", borderColor: color }
                  : {}),
              }}
              onClick={() => setSelectedStatus(status)}
            >
              {status !== "All" && (
                <span
                  style={{
                    ...styles.filterDot,
                    background: active ? "rgba(255,255,255,0.7)" : color,
                  }}
                />
              )}
              {status}
              <span style={{ ...styles.filterCount, opacity: active ? 0.8 : 1 }}>
                {getCount(status)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {(orders?.length === 0) ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>No Orders Yet</h3>
          <p style={styles.mutedText}>Start shopping to see your orders here.</p>
          <button style={styles.shopBtn} onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>No {selectedStatus} orders</h3>
          <p style={styles.mutedText}>Try selecting a different status filter.</p>
        </div>
      ) : (
        <div style={styles.orderList}>
          {filteredOrders.map((order, index) => (
            <div key={order._id || index} style={styles.orderCard}>

              {/* Order header row */}
              <div style={styles.orderHead}>
                <div style={styles.orderMeta}>
                  <span style={styles.orderId}>
                    #{order._id?.slice(-8).toUpperCase()}
                  </span>
                  <span style={styles.orderDate}>{formatDate(order.orderedDate)}</span>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    background: getStatusColor(order.status) + "18",
                    color: getStatusColor(order.status),
                    borderColor: getStatusColor(order.status) + "40",
                  }}
                >
                  <span
                    style={{
                      ...styles.statusDot,
                      background: getStatusColor(order.status),
                    }}
                  />
                  {order.status}
                </span>
              </div>

              {/* Order history */}
              {order.history?.length > 0 && (
                <div style={styles.historySection}>
                  <p style={styles.sectionLabel}>Order History</p>
                  <div style={styles.historyRow}>
                    {order.history.map((hist, idx) => (
                      <div key={hist._id || idx} style={styles.historyStep}>
                        <span style={styles.historyFrom}>{hist.from}</span>
                        <span style={styles.historyArrow}>→</span>
                        <span style={styles.historyTo}>{hist.to}</span>
                        <span style={styles.historyDate}>{formatDate(hist.changedAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={styles.itemsSection}>
                <p style={styles.sectionLabel}>
                  Items ({order.items?.length || 0})
                </p>
                <div style={styles.itemsList}>
                  {order.items?.map((item, idx) => {
                    const label =
                      item.productModel
                        ? item.productModel.charAt(0).toUpperCase() + item.productModel.slice(1)
                        : "Product";
                    const imgSrc = getItemImage(item);

                    return (
                      <div
                        key={item._id || idx}
                        style={styles.itemRow}
                        onClick={() => openModal(item, order)}
                      >
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={label}
                            style={styles.itemThumb}
                            onError={(e) => {
                              const fallback = getCategoryImage(item.productModel);
                              if (fallback) e.currentTarget.src = fallback;
                            }}
                          />
                        ) : (
                          <div style={styles.itemThumbPlaceholder} />
                        )}
                        <div style={styles.itemInfo}>
                          <span style={styles.itemName}>{label}</span>
                          <span style={styles.itemSub}>
                            Qty: {item.quantity} &nbsp;·&nbsp; ID: {item.productId?.slice(-8)}
                          </span>
                        </div>
                        <span style={styles.itemPrice}>₹{item.price?.toFixed(2)}</span>
                        <span style={styles.itemViewBtn}>Details</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order footer */}
              <div style={styles.orderFoot}>
                <span style={styles.paymentInfo}>
                  {order.paymentType} · {order.paymentMode}
                </span>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalAmount}>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Item detail modal */}
      {selectedItem && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHead}>
              <span style={styles.modalTitle}>Item Details</span>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>

            <div style={styles.modalBody}>
              {/* Image */}
              <div style={styles.modalImgWrap}>
                {(() => {
                  const src = getItemImage(selectedItem);
                  return src ? (
                    <img
                      src={src}
                      alt={selectedItem.productModel}
                      style={styles.modalImg}
                      onError={(e) => {
                        const fb = getCategoryImage(selectedItem.productModel);
                        if (fb) e.currentTarget.src = fb;
                      }}
                    />
                  ) : (
                    <div style={styles.modalImgPlaceholder} />
                  );
                })()}
              </div>

              {/* Details + Rating */}
              <div style={styles.modalDetails}>
                <div style={styles.modalSection}>
                  <p style={styles.modalSectionLabel}>Order Info</p>
                  {[
                    ["Product",    selectedItem.productModel?.toUpperCase()],
                    ["Product ID", selectedItem.productId],
                    ["Quantity",   selectedItem.quantity],
                    ["Price",      `₹${selectedItem.price?.toFixed(2)}`],
                  ].map(([label, value]) => (
                    <div key={label} style={styles.detailRow}>
                      <span style={styles.detailLabel}>{label}</span>
                      <span style={styles.detailValue}>{value}</span>
                    </div>
                  ))}
                </div>

                {selectedItem.details && (
                  <div style={styles.modalSection}>
                    <p style={styles.modalSectionLabel}>Specifications</p>
                    {[
                      ["Brand",        selectedItem.details.brand],
                      ["Category",     selectedItem.details.category],
                      ["Color",        selectedItem.details.color],
                      ["Size",         selectedItem.details.size],
                      ["Material",     selectedItem.details.type_of_material],
                      ["Fit",          selectedItem.details.fit],
                      ["Collar",       selectedItem.details.collar_type],
                      ["Sleeve",       selectedItem.details.sleeve_type],
                      ["Cost",         selectedItem.details.cost ? `₹${selectedItem.details.cost}` : null],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <div key={label} style={styles.detailRow}>
                          <span style={styles.detailLabel}>{label}</span>
                          <span style={styles.detailValue}>{value}</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Rating — available once order is placed (not Pending/Cancelled) */}
                {!["Pending", "Cancelled"].includes(selectedItem.orderInfo?.status) && (() => {
                  const vid = selectedItem.variantId;
                  const ratingData = ratings[vid] || {};
                  const star = pendingStar[vid] ?? ratingData.userRating ?? 0;
                  const alreadyRated = !!ratingData.submitted || !!ratingData.userRating;
                  return (
                    <div style={styles.ratingSection}>
                      <p style={styles.modalSectionLabel}>Rate this Variant</p>
                      {alreadyRated ? (
                        <div style={styles.ratedBadge}>
                          <StarRating value={ratingData.userRating || star} onChange={() => {}} disabled />
                          <span style={styles.ratedLabel}>You rated {ratingData.userRating || star}/5</span>
                          {ratingData.avgRating && (
                            <span style={styles.avgLabel}>Avg: {ratingData.avgRating}★ ({ratingData.ratingCount} ratings)</span>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <StarRating
                            value={star}
                            onChange={(s) => setPendingStar((p) => ({ ...p, [vid]: s }))}
                            disabled={ratingData.submitting}
                          />
                          <button
                            disabled={!star || ratingData.submitting}
                            onClick={() => submitRating(selectedItem.productId, vid, selectedItem.productModel, star)}
                            style={{
                              ...styles.submitRatingBtn,
                              opacity: (!star || ratingData.submitting) ? 0.5 : 1,
                              cursor: (!star || ratingData.submitting) ? "not-allowed" : "pointer",
                            }}
                          >
                            {ratingData.submitting ? "Submitting…" : "Submit Rating"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px 24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  // States
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "12px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  alertBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "10px",
    padding: "20px 28px",
  },
  alertTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#dc2626",
  },
  mutedText: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
    textAlign: "center",
  },

  // Page header
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "12px",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 2px 0",
  },
  pageSubtitle: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
  },
  shopBtn: {
    background: "#1e293b",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    padding: "8px 18px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Filter bar
  filterBar: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  filterTab: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  filterDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  filterCount: {
    fontSize: "11px",
    background: "rgba(0,0,0,0.08)",
    borderRadius: "10px",
    padding: "1px 6px",
    fontWeight: "700",
  },

  // Empty state
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    gap: "10px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
  },
  emptyIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#f1f5f9",
    border: "2px dashed #cbd5e1",
  },
  emptyTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },

  // Order list
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  // Order card
  orderCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
  },

  orderHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  orderMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  orderId: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e293b",
    fontFamily: "monospace",
    letterSpacing: "0.5px",
  },
  orderDate: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid",
    fontSize: "12px",
    fontWeight: "600",
  },
  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
  },

  // History
  historySection: {
    padding: "10px 16px",
    borderBottom: "1px solid #f1f5f9",
    background: "#fafbfc",
  },
  historyRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "6px",
  },
  historyStep: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f1f5f9",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
  },
  historyFrom: {
    color: "#64748b",
    fontWeight: "500",
  },
  historyArrow: {
    color: "#cbd5e1",
    fontSize: "10px",
  },
  historyTo: {
    color: "#10b981",
    fontWeight: "600",
  },
  historyDate: {
    color: "#94a3b8",
    marginLeft: "4px",
    borderLeft: "1px solid #e2e8f0",
    paddingLeft: "6px",
  },

  // Items
  itemsSection: {
    padding: "12px 16px",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    margin: "0 0 8px 0",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  itemThumb: {
    width: "56px",
    height: "56px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    flexShrink: 0,
  },
  itemThumbPlaceholder: {
    width: "56px",
    height: "56px",
    borderRadius: "6px",
    background: "#e2e8f0",
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },
  itemName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
  },
  itemSub: {
    fontSize: "11px",
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  itemPrice: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#3b82f6",
    whiteSpace: "nowrap",
  },
  itemViewBtn: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#3b82f6",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    padding: "4px 10px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  // Order footer
  orderFoot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    borderTop: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  paymentInfo: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  totalRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  totalLabel: {
    fontSize: "12px",
    color: "#64748b",
  },
  totalAmount: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#10b981",
  },

  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },
  modal: {
    background: "#ffffff",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "680px",
    maxHeight: "88vh",
    overflow: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },
  modalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    borderBottom: "1px solid #f1f5f9",
  },
  modalTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
  },
  closeBtn: {
    background: "#f1f5f9",
    border: "none",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    display: "flex",
    gap: "20px",
    padding: "18px",
    flexWrap: "wrap",
  },
  modalImgWrap: {
    flexShrink: 0,
  },
  modalImg: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    display: "block",
  },
  modalImgPlaceholder: {
    width: "180px",
    height: "180px",
    borderRadius: "10px",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
  },
  modalDetails: {
    flex: 1,
    minWidth: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  modalSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  modalSectionLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: "0 0 8px 0",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 0",
    borderBottom: "1px solid #f8fafc",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "right",
    maxWidth: "60%",
    wordBreak: "break-word",
  },

  ratingSection: {
    marginTop: "4px",
    padding: "14px 0 4px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  ratedBadge: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  ratedLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#10b981",
  },
  avgLabel: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  submitRatingBtn: {
    alignSelf: "flex-start",
    padding: "7px 20px",
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "13px",
    fontWeight: "700",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
};
