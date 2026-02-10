import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  buyAllCartItemsAsync,
} from "../Redux/slices/CartSlice";
import { useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal";

import shirt from "../assets/shirt_icon.png";
import Shoe from "../assets/shoe.jpg";
import Belt from "../assets/Belt.jpg";
import Watch from "../assets/watch.jpg";
import Sandal from "../assets/slippers.webp";
import tshirt from "../assets/Tshirt.jpg";
import { Activity } from "react";
import Loader from "./Loader";

const getDefaultProductImage = (title = "") => {
  const t = title.toLowerCase();

  // ✅ Check for "tshirt" or "t-shirt" first
  if (t.includes("tshirt") || t.includes("t-shirt") || t.includes("tee"))
    return tshirt;

  // Then check for generic shirts
  if (t.includes("shirt")) return shirt;

  if (t.includes("shoe") || t.includes("sneaker") || t.includes("boots"))
    return Shoe;
  if (t.includes("belt")) return Belt;
  if (t.includes("watch") || t.includes("smartwatch")) return Watch;
  if (t.includes("sandal") || t.includes("slipper") || t.includes("flipflop"))
    return Sandal;

  return shirt;
};

const currencyFormat = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    Number(value || 0)
  );

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cartItems = [],
    loading,
    error,
    purchaseSuccess,
    results,
  } = useSelector((state) => state.cart);

  const [localLoading, setLocalLoading] = useState(false);
  // console.log("cart items 59", cartItems);
  // console.log("results in the cart.jsx file", results);
  useEffect(() => {
    dispatch(getCart());
    // dispatch(fetchAllOrders());
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productDetails?.cost ?? item.cost ?? 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const discount = 0; // placeholder for future promo
  const gstPercent = 18;
  const gst = ((subtotal - discount) * gstPercent) / 100;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49; // free over 499
  const total = subtotal - discount + gst + deliveryFee;

  // Handlers
  const handleDecrease = (item) => {
    // console.log(
    //   "item handle decrease",
    //   item._id,
    //   item.productModel,
    //   item.quantity
    // );
    const newQty = Math.max(1, (item.quantity || 1) - 1);

    dispatch(updateCartQuantity(item._id, item.productModel, newQty));
  };

  const handleIncrease = (item) => {
    const newQty = (item.quantity || 1) + 1;
    console.log("item handle increase", item?.variantId);

    dispatch(updateCartQuantity(item._id, item.productModel, newQty));
  };

  const handleQtyChange = (item, e) => {
    const parsed = parseInt(e.target.value, 10);
    const newQty = isNaN(parsed) || parsed < 1 ? 1 : parsed;

    dispatch(updateCartQuantity(item._id, item.productModel, newQty));
  };

  const handleRemove = (item) => {
    if (!window.confirm("Remove this item from the cart?")) return;
    setLocalLoading(true);

    console.log("item", item._id);

    dispatch(removeFromCart(item._id, item.productModel)).finally(() =>
      // dispatch(getCart()),
      setLocalLoading(false)
    );
  };

  const handleClearCart = () => {
    if (!window.confirm("Clear all items from cart?")) return;
    setLocalLoading(true);
    dispatch(clearCart()).finally(() => setLocalLoading(false));
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Payment selection states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const handleBuyAll = () => {
    if (cartItems?.length === 0) {
      setModalTitle("⚠️ Cart Empty");
      setModalMessage("Your cart is empty. Please add items before checkout.");
      setModalType("warning");
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
      return;
    }
    // Show payment selection modal
    setShowPaymentModal(true);
    setSelectedPaymentType("");
    setSelectedPaymentMode("");
  };

  const handlePaymentTypeSelect = (type) => {
    setSelectedPaymentType(type);
    if (type === "COD") {
      setSelectedPaymentMode(""); // No mode needed for COD
    }
  };

  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
  };

  const handleConfirmPurchase = async () => {
    // Validation
    if (!selectedPaymentType) {
      alert("Please select a payment type");
      return;
    }
    if (selectedPaymentType === "Online" && !selectedPaymentMode) {
      alert("Please select a payment mode");
      return;
    }
    setLocalLoading(true);
    setShowPaymentModal(false);

    try {
      let paymentData = {
        paymentType: selectedPaymentType,
        productDetails: cartItems,
      };

      if (selectedPaymentType === "Online") {
        paymentData.paymentMode = selectedPaymentMode;
      }

      // console.log("Payment data:", paymentData);

      const result = await dispatch(buyAllCartItemsAsync(paymentData));

      // console.log("Purchase result:", result);

      const { success, order, results, error } = result;
      // console.log("success", success);
      // console.log("order", order);
      // console.log("results", results);
      // console.log("error", error);

      if (success && order) {
        // ✅ Full Success
        setModalTitle("✅ Purchase Successful!");
        setModalMessage(
          `Your order has been placed successfully!\n\nOrder ID: ${order._id
            .slice(-8)
            .toUpperCase()}\nTotal Amount: ${currencyFormat(
            order.totalAmount
          )}\nPayment: ${order.paymentType}${
            order.paymentType === "Online" ? ` - ${order.paymentMode}` : ""
          }`
        );

        setModalType("success");
        setModalOpen(true);

        // setTimeout(() => {
        //   setModalOpen(false);
        //   navigate("/orders");
        // }, 30000);
        setTimeout(() => {
          setModalOpen(false);
        }, 2500);

        return;
      }
      if (results) {
        // ⚠️ Partial or Failed items
        const successItems = Object.entries(results).filter(
          ([, v]) => v.success
        );
        const failedItems = Object.entries(results).filter(
          ([, v]) => !v.success
        );

        let detailedMessage = "";

        if (successItems.length > 0) {
          detailedMessage += `✅ Successfully Purchased (${successItems.length}):\n`;
          successItems.forEach(([model, data], index) => {
            detailedMessage += `${index + 1}. ${model} - ${data.message}\n`;
          });
          detailedMessage += "\n";
        }

        if (failedItems.length > 0) {
          detailedMessage += `❌ Failed to Purchase (${failedItems.length}):\n`;
          failedItems.forEach(([model, data], index) => {
            detailedMessage += `${index + 1}. ${model} - ${data.message}\n`;
          });
        }

        setModalTitle(
          failedItems.length === 0
            ? "✅ Purchase Successful!"
            : "⚠️ Partial Purchase"
        );
        setModalMessage(detailedMessage);
        setModalType(failedItems.length === 0 ? "success" : "warning");
        setModalOpen(true);
        setTimeout(() => {
          setModalOpen(false);
        }, 2500);

        return;
      }

      // ❌ If no order and no results - treat as failure
      setModalTitle("❌ Purchase Failed");
      setModalMessage(
        error || "Unable to complete your purchase. Please try again."
      );
      setModalType("error");
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setModalTitle("❌ Purchase Failed");
      setModalMessage(
        err?.error ||
          err?.message ||
          "An error occurred while processing your order."
      );
      setModalType("error");
      setModalOpen(true);
    } finally {
      setLocalLoading(false);

      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
    }
  };

  // UI: empty
  if (!loading && cartItems?.length === 0) {
    return (
      <div style={styles.wrapper}>
        <h1 style={styles.heading}>Shopping Cart</h1>
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>Your cart is empty.</p>
          <button style={styles.primaryBtn} onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>

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

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Shopping Cart</h1>

      {error && <div style={styles.errorBox}>{error}</div>}
      {loading && <Loader loading={loading} />}

      <div style={styles.grid}>
        <div style={styles.left}>
          {cartItems.map((item) => {
            const pd = item.productDetails || {};
            const title = pd.category || pd.brand || pd.name || "Product";
            const price = pd.cost ?? pd.price ?? 0;

            const imageSrc =
              pd.image_url && pd.image_url.trim() !== ""
                ? pd.image_url
                : getDefaultProductImage(title);

            return (
              <div key={item._id} style={styles.card}>
                {/* Remove icon top-right */}
                <button
                  aria-label="Remove item"
                  title="Remove"
                  onClick={() => handleRemove(item)}
                  style={styles.removeIconBtn}
                >
                  {/* Simple X SVG */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 6L18 18"
                      stroke="#374151"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 18L18 6"
                      stroke="#374151"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div style={styles.itemRow}>
                  <img
                    src={imageSrc}
                    alt={title}
                    style={styles.thumb}
                    onError={(e) => {
                      // e.currentTarget.src = FALLBACK_SVG_DATAURL;
                      e.currentTarget.src = getDefaultProductImage(title);
                    }}
                  />

                  <div style={styles.itemDetails}>
                    <h3 style={styles.itemTitle}>{title}</h3>
                    <p style={styles.itemMeta}>Brand: {pd.brand || "—"}</p>
                    <p style={styles.itemMeta}>Size: {pd.size || "—"}</p>
                    <p style={styles.itemPriceSmall}>{currencyFormat(price)}</p>

                    <div style={styles.qtyRow}>
                      <button
                        aria-label="Decrease quantity"
                        style={styles.qtyBtn}
                        onClick={() => handleDecrease(item)}
                      >
                        −
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQtyChange(item, e)}
                        style={styles.qtyInput}
                      />

                      <button
                        aria-label="Increase quantity"
                        style={styles.qtyBtn}
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={styles.itemTotalBox}>
                    <div style={styles.itemTotalPrice}>
                      {currencyFormat(price * (item.quantity || 1))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside style={styles.right}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{currencyFormat(subtotal)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Discount</span>
              <span>{currencyFormat(discount)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>GST ({gstPercent}%)</span>
              <span>{currencyFormat(gst)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Delivery</span>
              <span>
                {deliveryFee === 0 ? "Free" : currencyFormat(deliveryFee)}
              </span>
            </div>
            <hr
              style={{
                margin: "12px 0",
                border: "none",
                borderTop: "1px solid #e6eef9",
              }}
            />
            <div
              style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18 }}
            >
              <span>Total</span>
              <span>{currencyFormat(total)}</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                style={styles.checkoutBtn}
                onClick={handleBuyAll}
                disabled={localLoading}
              >
                {localLoading ? "Processing..." : "Buy All Items"}
              </button>
              <button
                style={styles.clearBtn}
                onClick={handleClearCart}
                disabled={localLoading}
              >
                Clear Cart
              </button>
            </div>
            <p style={styles.smallNote}>
              Payments are handled securely. By placing an order you agree to
              our{" "}
              <a href="/terms" style={{ color: "#1f6feb" }}>
                Terms
              </a>
              .
            </p>
          </div>
        </aside>

        {/* Payment Selection Modal */}
        {showPaymentModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.paymentModal}>
              <h2 style={styles.paymentModalTitle}>Select Payment Method</h2>

              {/* Payment Type Selection */}
              <div style={styles.paymentSection}>
                <h3 style={styles.sectionTitle}>Payment Type</h3>
                <div style={styles.paymentOptions}>
                  <div
                    style={{
                      ...styles.paymentOption,
                      ...(selectedPaymentType === "Online" &&
                        styles.paymentOptionSelected),
                    }}
                    onClick={() => handlePaymentTypeSelect("Online")}
                  >
                    <div style={styles.paymentOptionIcon}>💳</div>
                    <div style={styles.paymentOptionText}>
                      <div style={styles.paymentOptionTitle}>
                        Online Payment
                      </div>
                      <div style={styles.paymentOptionDesc}>
                        Pay using UPI, Net Banking, or Credit Card
                      </div>
                    </div>
                    {selectedPaymentType === "Online" && (
                      <div style={styles.selectedCheck}>✓</div>
                    )}
                  </div>

                  <div
                    style={{
                      ...styles.paymentOption,
                      ...(selectedPaymentType === "COD" &&
                        styles.paymentOptionSelected),
                    }}
                    onClick={() => handlePaymentTypeSelect("COD")}
                  >
                    <div style={styles.paymentOptionIcon}>💵</div>
                    <div style={styles.paymentOptionText}>
                      <div style={styles.paymentOptionTitle}>
                        Cash on Delivery
                      </div>
                      <div style={styles.paymentOptionDesc}>
                        Pay when you receive your order
                      </div>
                    </div>
                    {selectedPaymentType === "COD" && (
                      <div style={styles.selectedCheck}>✓</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Mode Selection (only for Online) */}
              {selectedPaymentType === "Online" && (
                <div style={styles.paymentSection}>
                  <h3 style={styles.sectionTitle}>Payment Mode</h3>
                  <div style={styles.paymentModes}>
                    <div
                      style={{
                        ...styles.paymentModeOption,
                        ...(selectedPaymentMode === "UPI" &&
                          styles.paymentModeSelected),
                      }}
                      onClick={() => handlePaymentModeSelect("UPI")}
                    >
                      <span style={styles.paymentModeIcon}>📱</span>
                      <span>UPI</span>
                      {selectedPaymentMode === "UPI" && (
                        <span style={styles.selectedCheckSmall}>✓</span>
                      )}
                    </div>

                    <div
                      style={{
                        ...styles.paymentModeOption,
                        ...(selectedPaymentMode === "NetBanking" &&
                          styles.paymentModeSelected),
                      }}
                      onClick={() => handlePaymentModeSelect("NetBanking")}
                    >
                      <span style={styles.paymentModeIcon}>🏦</span>
                      <span>Net Banking</span>
                      {selectedPaymentMode === "NetBanking" && (
                        <span style={styles.selectedCheckSmall}>✓</span>
                      )}
                    </div>

                    <div
                      style={{
                        ...styles.paymentModeOption,
                        ...(selectedPaymentMode === "CreditCard" &&
                          styles.paymentModeSelected),
                      }}
                      onClick={() => handlePaymentModeSelect("CreditCard")}
                    >
                      <span style={styles.paymentModeIcon}>💳</span>
                      <span>Credit Card</span>
                      {selectedPaymentMode === "CreditCard" && (
                        <span style={styles.selectedCheckSmall}>✓</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={styles.paymentModalActions}>
                <button
                  style={styles.cancelPaymentBtn}
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={styles.confirmPaymentBtn}
                  onClick={handleConfirmPurchase}
                  disabled={
                    !selectedPaymentType ||
                    (selectedPaymentType === "Online" && !selectedPaymentMode)
                  }
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Modal */}
        <CustomModal
          isOpen={modalOpen}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Cart;

/* -------------------- Styles -------------------- */
const styles = {
  wrapper: {
    padding: 20,
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily:
      "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  heading: {
    fontSize: 26,
    marginBottom: 16,
    color: "#111827",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: 24,
    alignItems: "start",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    position: "relative",
    overflow: "visible",
  },
  removeIconBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 6,
    borderRadius: 6,
  },
  itemRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  thumb: {
    width: 110,
    height: 110,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #eef2f7",
    background: "#f8fafc",
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: "#0f172a",
  },
  itemMeta: {
    margin: "6px 0",
    color: "#6b7280",
    fontSize: 13,
  },
  itemPriceSmall: {
    color: "#0f172a",
    fontWeight: 700,
    marginTop: 6,
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid #e6eef9",
    background: "#fff",
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
  },
  qtyInput: {
    width: 56,
    textAlign: "center",
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid #e6eef9",
  },
  itemTotalBox: {
    width: 120,
    textAlign: "right",
  },
  itemTotalPrice: {
    fontWeight: 700,
    fontSize: 16,
    color: "#0f172a",
  },
  itemSubId: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },

  right: {},
  summaryCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    position: "sticky",
    top: 20,
  },
  summaryTitle: {
    margin: 0,
    fontSize: 16,
    marginBottom: 12,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    color: "#374151",
  },
  checkoutBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    background: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    marginBottom: 8,
  },
  clearBtn: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#fff",
    color: "#0f172a",
    border: "1px solid #e6eef9",
    cursor: "pointer",
  },
  smallNote: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
  },
  emptyBox: {
    textAlign: "center",
    padding: 40,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
  },
  emptyText: { marginBottom: 12, color: "#374151" },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 8,
    background: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
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
  },
  paymentModal: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
  },
  paymentModalTitle: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  paymentSection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "1rem",
  },
  paymentOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  },
  paymentOptionSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  paymentOptionIcon: {
    fontSize: "2rem",
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "0.25rem",
  },
  paymentOptionDesc: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  selectedCheck: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: 700,
  },
  paymentModes: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  paymentModeOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  },
  paymentModeSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  paymentModeIcon: {
    fontSize: "2rem",
  },
  selectedCheckSmall: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  paymentModalActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  cancelPaymentBtn: {
    flex: 1,
    padding: "0.875rem",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "white",
    color: "#64748b",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  confirmPaymentBtn: {
    flex: 1,
    padding: "0.875rem",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
