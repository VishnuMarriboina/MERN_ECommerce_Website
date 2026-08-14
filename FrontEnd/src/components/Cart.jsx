import React, { useEffect, useState } from "react";
import { useCart } from "../Redux/features/cart";
import { useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal";
import Loader from "./Loader";

import {
  CHECKOUT_STEPS as STEPS,
  FREE_SHIPPING_THRESHOLD,
  DELIVERY_FEE,
  GST_PERCENT,
  PAYMENT_TYPES,
  PAYMENT_MODES,
  CATEGORY_IMAGES,
} from "./DataFolder/componentsData";

/* ─── helpers ─────────────────────────────────────── */
const getDefaultImage = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("tshirt") || t.includes("t-shirt") || t.includes("tee")) return CATEGORY_IMAGES["tshirt"];
  if (t.includes("shirt"))   return CATEGORY_IMAGES["shirt"];
  if (t.includes("shoe") || t.includes("sneaker") || t.includes("boots")) return CATEGORY_IMAGES["shoe"];
  if (t.includes("belt"))    return CATEGORY_IMAGES["belt"];
  if (t.includes("watch") || t.includes("smartwatch")) return CATEGORY_IMAGES["watch"];
  if (t.includes("sandal") || t.includes("slipper") || t.includes("flipflop")) return CATEGORY_IMAGES["sandal"];
  return CATEGORY_IMAGES["shirt"];
};

const fmt = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(v || 0));

/* ─── component ───────────────────────────────────── */
const Cart = () => {
  const navigate  = useNavigate();

  const {
    cartItems = [], loading, error,
    loadCart, changeQuantity, removeItem, clear, buyAll,
  } = useCart();

  const [localLoading, setLocalLoading]       = useState(false);
  const [confirmModal, setConfirmModal]       = useState({ open: false, message: "", onConfirm: null });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType]         = useState("");
  const [paymentMode, setPaymentMode]         = useState("");
  const [paymentError, setPaymentError]       = useState("");
  const [step, setStep]                       = useState(0); // 0=Cart 1=Payment 2=Confirmed

  const [modalOpen, setModalOpen]     = useState(false);
  const [modalType, setModalType]     = useState("info");
  const [modalTitle, setModalTitle]   = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => { loadCart(); }, [loadCart]);

  /* totals */
  const subtotal    = cartItems.reduce((s, i) => s + (i.productDetails?.cost ?? i.cost ?? 0) * (i.quantity || 1), 0);
  const gst         = (subtotal * GST_PERCENT) / 100;
  const deliveryFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal + gst + deliveryFee;
  const shippingGap = FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  /* qty handlers */
  const handleDecrease = (item) =>
    changeQuantity({ cartItemId: item._id, productModel: item.productModel, quantity: Math.max(1, (item.quantity || 1) - 1) });

  const handleIncrease = (item) =>
    changeQuantity({ cartItemId: item._id, productModel: item.productModel, quantity: (item.quantity || 1) + 1 });

  const handleQtyChange = (item, e) => {
    const q = parseInt(e.target.value, 10);
    changeQuantity({ cartItemId: item._id, productModel: item.productModel, quantity: isNaN(q) || q < 1 ? 1 : q });
  };

  /* remove */
  const handleRemove = (item) =>
    setConfirmModal({
      open: true,
      message: "Remove this item from your cart?",
      onConfirm: () => {
        setConfirmModal({ open: false, message: "", onConfirm: null });
        setLocalLoading(true);
        removeItem({ cartItemId: item._id }).finally(() => setLocalLoading(false));
      },
    });

  /* clear */
  const handleClearCart = () =>
    setConfirmModal({
      open: true,
      message: "Remove all items from your cart?",
      onConfirm: () => {
        setConfirmModal({ open: false, message: "", onConfirm: null });
        setLocalLoading(true);
        clear().finally(() => setLocalLoading(false));
      },
    });

  /* checkout */
  const handleBuyAll = () => {
    if (!cartItems.length) return;
    setPaymentType("");
    setPaymentMode("");
    setPaymentError("");
    setShowPaymentModal(true);
    setStep(1);
  };

  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
    setPaymentMode("");
    setPaymentError("");
  };

  const handleConfirmPurchase = async () => {
    if (!paymentType) { setPaymentError("Please select a payment method."); return; }
    if (paymentType === "Online" && !paymentMode) { setPaymentError("Please select a payment mode."); return; }

    setLocalLoading(true);
    setShowPaymentModal(false);

    try {
      const payload = { paymentType, productDetails: cartItems };
      if (paymentType === "Online") payload.paymentMode = paymentMode;

      const result = await buyAll(payload).unwrap();
      const { success, order, results, error: resErr } = result;

      if (success && order) {
        setStep(2);
        setModalTitle("Order Placed Successfully");
        setModalMessage(
          `Order ID: ${order._id.slice(-8).toUpperCase()}\nTotal: ${fmt(order.totalAmount)}\nPayment: ${order.paymentType}${order.paymentType === "Online" ? ` · ${order.paymentMode}` : ""}`
        );
        setModalType("success");
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 3000);
        return;
      }

      if (results) {
        const failed  = Object.entries(results).filter(([, v]) => !v.success);
        const succeed = Object.entries(results).filter(([, v]) =>  v.success);
        const lines   = [
          succeed.length ? `Purchased (${succeed.length}): ${succeed.map(([m]) => m).join(", ")}` : "",
          failed.length  ? `Failed (${failed.length}): ${failed.map(([m, d]) => `${m} — ${d.message}`).join(", ")}` : "",
        ].filter(Boolean).join("\n");

        setStep(failed.length ? 0 : 2);
        setModalTitle(failed.length === 0 ? "Order Placed" : "Partial Purchase");
        setModalMessage(lines);
        setModalType(failed.length === 0 ? "success" : "warning");
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 3000);
        return;
      }

      setModalTitle("Purchase Failed");
      setModalMessage(resErr || "Unable to complete your purchase. Please try again.");
      setModalType("error");
      setModalOpen(true);
    } catch (err) {
      setModalTitle("Purchase Failed");
      setModalMessage(err?.message || "An error occurred while processing your order.");
      setModalType("error");
      setModalOpen(true);
    } finally {
      setLocalLoading(false);
      setTimeout(() => setModalOpen(false), 3000);
    }
  };

  /* ─── empty state ──────────────────────────────── */
  if (!loading && cartItems.length === 0) {
    return (
      <div style={s.page}>
        <StepBar step={step} />
        <div style={s.emptyWrap}>
          <div style={s.emptyIconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 style={s.emptyTitle}>Your cart is empty</h2>
          <p style={s.emptyDesc}>Looks like you haven't added anything yet.</p>
          <button style={s.primaryBtn} onClick={() => navigate("/")}>Browse Products</button>
        </div>
        <CustomModal isOpen={modalOpen} title={modalTitle} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
      </div>
    );
  }

  /* ─── main cart ────────────────────────────────── */
  return (
    <div style={s.page}>
      {(loading || localLoading) && <Loader loading />}
      <StepBar step={step} />

      {error && (
        <div style={s.errorBanner}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <div style={s.layout}>

        {/* ── Left: item list ── */}
        <div style={s.itemsCol}>
          <div style={s.colHeader}>
            <span style={s.colTitle}>Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
            <button style={s.clearLink} onClick={handleClearCart}>Clear all</button>
          </div>

          {/* Free shipping progress */}
          {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
            <div style={s.shippingBanner}>
              <div style={s.shippingText}>
                Add <strong>{fmt(shippingGap)}</strong> more for <strong>free shipping</strong>
              </div>
              <div style={s.progressTrack}>
                <div style={{ ...s.progressFill, width: `${shippingPct}%` }} />
              </div>
            </div>
          )}
          {subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
            <div style={{ ...s.shippingBanner, borderColor: "#bbf7d0", background: "#f0fdf4" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>
                &nbsp;You qualify for free shipping!
              </span>
            </div>
          )}

          {cartItems.map((item) => {
            const pd     = item.productDetails || {};
            const title  = pd.category || pd.brand || pd.name || item.productModel || "Product";
            const price  = pd.cost ?? pd.price ?? 0;
            const imgSrc = pd.image_url?.trim() && pd.image_url !== "No image found"
              ? pd.image_url
              : getDefaultImage(title);

            return (
              <div key={item._id} style={s.card}>
                <img
                  src={imgSrc}
                  alt={title}
                  style={s.thumb}
                  onError={(e) => { e.currentTarget.src = getDefaultImage(title); }}
                />

                <div style={s.cardBody}>
                  <div style={s.cardTop}>
                    <div>
                      <div style={s.itemTitle}>{title.charAt(0).toUpperCase() + title.slice(1)}</div>
                      <div style={s.chipRow}>
                        {pd.brand && <span style={s.chip}>{pd.brand}</span>}
                        {pd.size  && <span style={s.chip}>Size: {pd.size}</span>}
                        {pd.color && <span style={s.chip}>{pd.color}</span>}
                      </div>
                    </div>
                    <button aria-label="Remove" style={s.removeBtn} onClick={() => handleRemove(item)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>

                  <div style={s.cardBottom}>
                    <div style={s.qtyRow}>
                      <button style={s.qtyBtn} onClick={() => handleDecrease(item)} aria-label="Decrease">−</button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item, e)}
                        style={s.qtyInput}
                      />
                      <button style={s.qtyBtn} onClick={() => handleIncrease(item)} aria-label="Increase">+</button>
                    </div>
                    <div style={s.priceStack}>
                      <span style={s.unitPrice}>{fmt(price)} each</span>
                      <span style={s.lineTotal}>{fmt(price * (item.quantity || 1))}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Right: summary ── */}
        <aside style={s.summaryCol}>
          <div style={s.summaryCard}>
            <h3 style={s.summaryTitle}>Order Summary</h3>

            <div style={s.summaryRows}>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Subtotal ({cartItems.length} items)</span>
                <span style={s.summaryValue}>{fmt(subtotal)}</span>
              </div>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>GST ({GST_PERCENT}%)</span>
                <span style={s.summaryValue}>{fmt(gst)}</span>
              </div>
              <div style={s.summaryRow}>
                <span style={s.summaryLabel}>Delivery</span>
                <span style={{ ...s.summaryValue, color: deliveryFee === 0 ? "#16a34a" : "#1e293b" }}>
                  {deliveryFee === 0 ? "Free" : fmt(deliveryFee)}
                </span>
              </div>
            </div>

            <div style={s.summaryDivider} />

            <div style={s.totalRow}>
              <span style={s.totalLabel}>Total</span>
              <span style={s.totalValue}>{fmt(total)}</span>
            </div>

            <p style={s.taxNote}>Inclusive of all taxes</p>

            <button
              style={{ ...s.checkoutBtn, opacity: localLoading ? 0.7 : 1 }}
              onClick={handleBuyAll}
              disabled={localLoading}
            >
              {localLoading ? "Processing…" : "Proceed to Checkout"}
            </button>
            <button style={s.continueBtn} onClick={() => navigate("/")}>
              Continue Shopping
            </button>

            <div style={s.trustRow}>
              <TrustBadge icon={<LockIcon />}   label="Secure Checkout" />
              <TrustBadge icon={<TruckIcon />}  label="Free Delivery" />
              <TrustBadge icon={<ReturnIcon />} label="Easy Returns" />
            </div>
          </div>
        </aside>
      </div>

      {/* ── Payment modal ── */}
      {showPaymentModal && (
        <div style={s.overlay} onClick={() => setShowPaymentModal(false)}>
          <div style={s.payModal} onClick={(e) => e.stopPropagation()}>
            <div style={s.payModalHead}>
              <span style={s.payModalTitle}>Select Payment Method</span>
              <button style={s.closeBtn} onClick={() => setShowPaymentModal(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={s.payModalBody}>
              {/* Amount recap */}
              <div style={s.payRecap}>
                <span style={s.payRecapLabel}>Order Total</span>
                <span style={s.payRecapValue}>{fmt(total)}</span>
              </div>

              {/* Payment type */}
              <p style={s.payLabel}>Payment Method</p>
              <div style={s.payTypeRow}>
                {PAYMENT_TYPES.map(({ id, title, desc, icon }) => (
                  <div
                    key={id}
                    style={{ ...s.payTypeCard, ...(paymentType === id ? s.payTypeCardActive : {}) }}
                    onClick={() => handlePaymentTypeSelect(id)}
                  >
                    <div style={{ ...s.payTypeIconWrap, color: paymentType === id ? "#3b82f6" : "#64748b" }}>
                      {icon}
                    </div>
                    <div style={s.payTypeInfo}>
                      <span style={s.payTypeTitle}>{title}</span>
                      <span style={s.payTypeDesc}>{desc}</span>
                    </div>
                    <div style={{ ...s.radioCircle, ...(paymentType === id ? s.radioCircleActive : {}) }}>
                      {paymentType === id && <div style={s.radioDot} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment mode (online only) */}
              {paymentType === "Online" && (
                <>
                  <p style={s.payLabel}>Payment Mode</p>
                  <div style={s.payModeRow}>
                    {PAYMENT_MODES.map(({ id, label, icon }) => (
                      <div
                        key={id}
                        style={{ ...s.payModeCard, ...(paymentMode === id ? s.payModeCardActive : {}) }}
                        onClick={() => { setPaymentMode(id); setPaymentError(""); }}
                      >
                        <div style={{ color: paymentMode === id ? "#3b82f6" : "#64748b" }}>{icon}</div>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: paymentMode === id ? "#2563eb" : "#374151" }}>{label}</span>
                        {paymentMode === id && (
                          <div style={s.modeCheck}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {paymentError && <p style={s.payError}>{paymentError}</p>}
            </div>

            <div style={s.payModalFoot}>
              <button style={s.cancelBtn} onClick={() => { setShowPaymentModal(false); setStep(0); }}>
                Cancel
              </button>
              <button
                style={{
                  ...s.confirmBtn,
                  opacity: (!paymentType || (paymentType === "Online" && !paymentMode)) ? 0.5 : 1,
                  cursor: (!paymentType || (paymentType === "Online" && !paymentMode)) ? "not-allowed" : "pointer",
                }}
                onClick={handleConfirmPurchase}
                disabled={!paymentType || (paymentType === "Online" && !paymentMode)}
              >
                Place Order · {fmt(total)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {confirmModal.open && (
        <div style={s.overlay}>
          <div style={s.confirmModal}>
            <p style={s.confirmMsg}>{confirmModal.message}</p>
            <div style={s.confirmActions}>
              <button style={s.cancelBtn} onClick={() => setConfirmModal({ open: false, message: "", onConfirm: null })}>Cancel</button>
              <button style={{ ...s.confirmBtn, flex: 1 }} onClick={confirmModal.onConfirm}>Remove</button>
            </div>
          </div>
        </div>
      )}

      <CustomModal isOpen={modalOpen} title={modalTitle} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
};

/* ─── sub-components ──────────────────────────────── */
function StepBar({ step }) {
  return (
    <div style={s.stepBar}>
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div style={s.stepItem}>
            <div style={{ ...s.stepCircle, ...(i <= step ? s.stepCircleActive : {}) }}>
              {i < step ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <span style={{ fontSize: "11px", fontWeight: "700", color: i <= step ? "#fff" : "#94a3b8" }}>{i + 1}</span>
              )}
            </div>
            <span style={{ ...s.stepLabel, color: i <= step ? "#1e293b" : "#94a3b8", fontWeight: i === step ? "700" : "500" }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ ...s.stepLine, background: i < step ? "#3b82f6" : "#e2e8f0" }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function TrustBadge({ icon, label }) {
  return (
    <div style={s.trustBadge}>
      <span style={s.trustIcon}>{icon}</span>
      <span style={s.trustLabel}>{label}</span>
    </div>
  );
}
const LockIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const TruckIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const ReturnIcon= () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.01"/></svg>;

export default Cart;

/* ─── styles ──────────────────────────────────────── */
const s = {
  page: {
    padding: "20px 24px",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },

  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "16px",
  },

  // Checkout steps
  stepBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0",
    marginBottom: "24px",
    padding: "16px 0",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px",
  },
  stepCircle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#f1f5f9",
    border: "2px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepCircleActive: {
    background: "#3b82f6",
    border: "2px solid #3b82f6",
  },
  stepLabel: {
    fontSize: "13px",
  },
  stepLine: {
    flex: "0 0 60px",
    height: "2px",
    borderRadius: "2px",
  },

  // Layout
  layout: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  itemsCol: {
    flex: "1 1 0",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  summaryCol: {
    width: "300px",
    flexShrink: 0,
    position: "sticky",
    top: "20px",
  },

  // Items column header
  colHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
  },
  clearLink: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "500",
    padding: 0,
  },

  // Free shipping banner
  shippingBanner: {
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "8px",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  shippingText: {
    fontSize: "12px",
    color: "#0369a1",
  },
  progressTrack: {
    height: "4px",
    background: "#e0f2fe",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#0ea5e9",
    borderRadius: "4px",
    transition: "width 0.4s ease",
  },

  // Item card
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  thumb: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #f1f5f9",
    flexShrink: 0,
    background: "#f8fafc",
  },
  cardBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: 0,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  itemTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "5px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  chipRow: {
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  },
  chip: {
    fontSize: "11px",
    background: "#f1f5f9",
    color: "#64748b",
    borderRadius: "4px",
    padding: "2px 7px",
    fontWeight: "500",
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: "4px",
    borderRadius: "6px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  qtyBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyInput: {
    width: "44px",
    height: "30px",
    textAlign: "center",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
  },
  priceStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  },
  unitPrice: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  lineTotal: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
  },

  // Summary card
  summaryCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "18px",
  },
  summaryTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 14px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryRows: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "14px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  summaryValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
  },
  summaryDivider: {
    height: "1px",
    background: "#f1f5f9",
    marginBottom: "12px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  totalLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
  },
  totalValue: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#1e293b",
  },
  taxNote: {
    fontSize: "11px",
    color: "#94a3b8",
    margin: "0 0 14px 0",
    textAlign: "right",
  },
  checkoutBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #1e293b, #334155)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    marginBottom: "8px",
    letterSpacing: "0.2px",
  },
  continueBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    background: "transparent",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
    marginBottom: "14px",
  },
  trustRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "12px",
    gap: "4px",
  },
  trustBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },
  trustIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  trustLabel: {
    fontSize: "10px",
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: "1.3",
  },

  // Empty state
  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "320px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "40px 24px",
    gap: "10px",
  },
  emptyIconWrap: {
    width: "72px",
    height: "72px",
    background: "#f8fafc",
    border: "2px dashed #cbd5e1",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "6px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  emptyDesc: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
  primaryBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    background: "#1e293b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    marginTop: "6px",
  },

  // Overlay
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },

  // Payment modal
  payModal: {
    background: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  },
  payModalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
  payModalTitle: {
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },
  payModalBody: {
    padding: "16px 20px",
  },
  payRecap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "18px",
  },
  payRecapLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  payRecapValue: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#1e293b",
  },
  payLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    margin: "0 0 10px 0",
  },
  payTypeRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  payTypeCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  payTypeCardActive: {
    borderColor: "#3b82f6",
    background: "#eff6ff",
  },
  payTypeIconWrap: {
    flexShrink: 0,
  },
  payTypeInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  payTypeTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
  },
  payTypeDesc: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  radioCircle: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioCircleActive: {
    borderColor: "#3b82f6",
  },
  radioDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#3b82f6",
  },
  payModeRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "8px",
  },
  payModeCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "12px 8px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.15s",
  },
  payModeCardActive: {
    borderColor: "#3b82f6",
    background: "#eff6ff",
  },
  modeCheck: {
    position: "absolute",
    top: "6px",
    right: "6px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  payError: {
    fontSize: "12px",
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "8px 12px",
    margin: "8px 0 0 0",
  },
  payModalFoot: {
    display: "flex",
    gap: "10px",
    padding: "14px 20px",
    borderTop: "1px solid #f1f5f9",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 2,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #1e293b, #334155)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // Confirm dialog
  confirmModal: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px 20px",
    width: "300px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
    textAlign: "center",
  },
  confirmMsg: {
    fontSize: "14px",
    color: "#1e293b",
    margin: "0 0 18px",
    lineHeight: 1.5,
  },
  confirmActions: {
    display: "flex",
    gap: "8px",
  },
};
