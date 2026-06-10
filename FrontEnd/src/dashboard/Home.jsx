import React from "react";
import {
  HOME_FEATURE_CARDS,
  HOME_INFO_CARDS,
  HOME_STATUS_CARDS,
  HOME_FEATURE_BADGES,
} from "./DataFolder/dashboardData";

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
          {HOME_FEATURE_BADGES.map(({ icon, text }) => (
            <div key={text} style={styles.featureBadge}>
              <span style={styles.badgeIcon}>{icon}</span>
              <span style={styles.badgeText}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Feature Cards */}
      <div style={styles.cardsContainer}>
        {HOME_FEATURE_CARDS.map(({ icon, title, description, gradient, hoverBorder, tags, tagColor }) => (
          <div
            key={title}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.borderColor = hoverBorder;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "#e1e5ebff";
            }}
          >
            <div style={{ ...styles.iconBox, background: gradient }}>
              <span style={styles.cardIcon}>{icon}</span>
            </div>
            <h3 style={styles.cardTitle}>{title}</h3>
            <p style={styles.cardDescription}>{description}</p>
            <div style={styles.tagContainer}>
              {tags.map((tag) => (
                <span key={tag} style={{ ...styles.tag, background: tagColor }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Features Section */}
      <div style={styles.infoSection}>
        {HOME_INFO_CARDS.map(({ icon, title, text }) => (
          <div key={title} style={styles.infoCard}>
            <span style={styles.infoIcon}>{icon}</span>
            <div>
              <h4 style={styles.infoTitle}>{title}</h4>
              <p style={styles.infoText}>{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Section */}
      <div style={styles.statusSection}>
        <h3 style={styles.sectionTitle}>Understanding Order Status</h3>
        <div style={styles.statusGrid}>
          {HOME_STATUS_CARDS.map(({ icon, title, text, color }) => (
            <div key={title} style={styles.statusCard}>
              <div style={{ ...styles.statusIcon, background: color }}>{icon}</div>
              <h4 style={styles.statusTitle}>{title}</h4>
              <p style={styles.statusText}>{text}</p>
            </div>
          ))}
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
