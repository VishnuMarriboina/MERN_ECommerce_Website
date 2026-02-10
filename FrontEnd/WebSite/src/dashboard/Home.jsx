import React from "react";

export default function UserDashboard() {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>🛍️</div>
          <div>
            <h1 style={styles.mainTitle}>Vishnu's Store</h1>
            <p style={styles.subtitle}>Your Shopping Dashboard</p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>Welcome Back! 👋</h2>
        <p style={styles.welcomeText}>
          Discover amazing fashion & accessories. Shop the latest trends, track
          your orders, manage your wishlist, and enjoy a seamless shopping
          experience.
        </p>
        <div style={styles.featureGrid}>
          <div style={styles.featureBadge}>
            <span style={styles.badgeIcon}>🚚</span>
            <span style={styles.badgeText}>Free Shipping</span>
          </div>
          <div style={styles.featureBadge}>
            <span style={styles.badgeIcon}>🔄</span>
            <span style={styles.badgeText}>Easy Returns</span>
          </div>
          <div style={styles.featureBadge}>
            <span style={styles.badgeIcon}>💳</span>
            <span style={styles.badgeText}>Secure Payment</span>
          </div>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div style={styles.cardsContainer}>
        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = "#3b82f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "#e1e5ebff";
          }}
        >
          <div
            style={{
              ...styles.iconBox,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            <span style={styles.cardIcon}>🛒</span>
          </div>
          <h3 style={styles.cardTitle}>Browse Products</h3>
          <p style={styles.cardDescription}>
            Explore our extensive collection of fashion items. Filter by
            category, price, size, and find exactly what you're looking for.
          </p>
          <div style={styles.tagContainer}>
            <span style={{ ...styles.tag, background: "#3b82f6" }}>
              Shop Now
            </span>
            <span style={{ ...styles.tag, background: "#3b82f6" }}>
              New Arrivals
            </span>
          </div>
        </div>

        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = "#10b981";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "#e1e5ebff";
          }}
        >
          <div
            style={{
              ...styles.iconBox,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <span style={styles.cardIcon}>📦</span>
          </div>
          <h3 style={styles.cardTitle}>My Orders</h3>
          <p style={styles.cardDescription}>
            View all your orders, track shipments in real-time, check delivery
            status, and access order details anytime.
          </p>
          <div style={styles.tagContainer}>
            <span style={{ ...styles.tag, background: "#10b981" }}>
              Track Order
            </span>
            <span style={{ ...styles.tag, background: "#10b981" }}>
              Order History
            </span>
          </div>
        </div>

        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = "#a855f7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "#e1e5ebff";
          }}
        >
          <div
            style={{
              ...styles.iconBox,
              background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
            }}
          >
            <span style={styles.cardIcon}>🛍️</span>
          </div>
          <h3 style={styles.cardTitle}>Shopping Cart</h3>
          <p style={styles.cardDescription}>
            Review items in your cart, update quantities, apply discount codes,
            and proceed to secure checkout.
          </p>
          <div style={styles.tagContainer}>
            <span style={{ ...styles.tag, background: "#a855f7" }}>
              View Cart
            </span>
            <span style={{ ...styles.tag, background: "#a855f7" }}>
              Checkout
            </span>
          </div>
        </div>

        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = "#f59e0b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "#e1e5ebff";
          }}
        >
          <div
            style={{
              ...styles.iconBox,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <span style={styles.cardIcon}>❤️</span>
          </div>
          <h3 style={styles.cardTitle}>Wishlist</h3>
          <p style={styles.cardDescription}>
            Save your favorite items for later. Get notified when items go on
            sale or back in stock.
          </p>
          <div style={styles.tagContainer}>
            <span style={{ ...styles.tag, background: "#f59e0b" }}>
              My Wishlist
            </span>
            <span style={{ ...styles.tag, background: "#f59e0b" }}>
              Save Items
            </span>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div style={styles.infoSection}>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>📍</span>
          <div>
            <h4 style={styles.infoTitle}>Order Tracking</h4>
            <p style={styles.infoText}>
              Real-time tracking of your orders from warehouse to your doorstep
            </p>
          </div>
        </div>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>💰</span>
          <div>
            <h4 style={styles.infoTitle}>Payment Options</h4>
            <p style={styles.infoText}>
              Multiple payment methods including cards, UPI, wallets, and COD
            </p>
          </div>
        </div>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>👤</span>
          <div>
            <h4 style={styles.infoTitle}>Profile & Addresses</h4>
            <p style={styles.infoText}>
              Manage your personal info, saved addresses, and payment methods
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Section */}
      <div style={styles.statusSection}>
        <h3 style={styles.sectionTitle}>Understanding Order Status</h3>
        <div style={styles.statusGrid}>
          <div style={styles.statusCard}>
            <div style={{ ...styles.statusIcon, background: "#3b82f6" }}>
              📋
            </div>
            <h4 style={styles.statusTitle}>Order Placed</h4>
            <p style={styles.statusText}>
              Your order has been received and is being processed
            </p>
          </div>
          <div style={styles.statusCard}>
            <div style={{ ...styles.statusIcon, background: "#f59e0b" }}>
              📦
            </div>
            <h4 style={styles.statusTitle}>Packed</h4>
            <p style={styles.statusText}>
              Your items are packed and ready for shipment
            </p>
          </div>
          <div style={styles.statusCard}>
            <div style={{ ...styles.statusIcon, background: "#a855f7" }}>
              🚚
            </div>
            <h4 style={styles.statusTitle}>Shipped</h4>
            <p style={styles.statusText}>
              Your order is on the way to your delivery address
            </p>
          </div>
          <div style={styles.statusCard}>
            <div style={{ ...styles.statusIcon, background: "#10b981" }}>
              ✅
            </div>
            <h4 style={styles.statusTitle}>Delivered</h4>
            <p style={styles.statusText}>
              Your order has been successfully delivered
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.statusIndicator}>
            <div style={styles.statusDot}></div>
            <div>
              <p style={styles.footerText}>Happy Shopping! 🎉</p>
              <p style={styles.footerSubtext}>
                Need help? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: "40px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logo: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)",
  },
  mainTitle: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0",
  },
  subtitle: {
    fontSize: "18px",
    color: "#64748b",
    margin: "5px 0 0 0",
  },
  welcomeCard: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%)",
    borderRadius: "20px",
    padding: "50px",
    marginBottom: "50px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e0e7ff",
  },
  welcomeTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "20px",
    marginTop: "0",
  },
  welcomeText: {
    fontSize: "18px",
    color: "#475569",
    lineHeight: "1.7",
    marginBottom: "30px",
    maxWidth: "800px",
  },
  featureGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  featureBadge: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    backdropFilter: "blur(10px)",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    padding: "15px 25px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  },
  badgeIcon: {
    fontSize: "24px",
  },
  badgeText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: "16px",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    marginBottom: "50px",
  },
  card: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    backdropFilter: "blur(10px)",
    border: "2px solid #e0e2e6ff",
    borderRadius: "20px",
    padding: "30px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
  },
  iconBox: {
    width: "70px",
    height: "70px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
  },
  cardIcon: {
    fontSize: "36px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "15px",
    marginTop: "0",
  },
  cardDescription: {
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  tagContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  tag: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#ffffff",
  },
  infoSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    marginBottom: "50px",
  },
  infoCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "25px",
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
  },
  infoIcon: {
    fontSize: "36px",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  infoText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
    lineHeight: "1.5",
  },
  statusSection: {
    background:
      "linear-gradient(135deg, #fefefe 0%, #f7f9fc 50%, #f0f4f8 100%)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "40px",
    marginBottom: "40px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
  },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    marginTop: "0",
    marginBottom: "30px",
    textAlign: "center",
  },
  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
  },
  statusCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "15px",
    padding: "25px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
  },
  statusIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "28px",
  },
  statusTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 10px 0",
  },
  statusText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
    lineHeight: "1.5",
  },
  footer: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
  },
  footerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  statusDot: {
    width: "12px",
    height: "12px",
    background: "#10b981",
    borderRadius: "50%",
    boxShadow: "0 0 20px #10b981",
  },
  footerText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0",
  },
  footerSubtext: {
    fontSize: "13px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
};
