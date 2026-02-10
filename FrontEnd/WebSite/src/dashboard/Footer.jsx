import React from "react";

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>About Us</h4>
            <p style={styles.footerText}>
              Your one-stop shop for quality fashion
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Customer Service</h4>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>Contact Us</li>
              <li style={styles.footerListItem}>Shipping Info</li>
              <li style={styles.footerListItem}>Returns</li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Follow Us</h4>
            <p style={styles.footerText}>Stay connected on social media</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>
            © 2024 Vishnu's Store. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

const styles = {
  footer: {
    backgroundColor: "#2d3748",
    color: "#fff",
    padding: "3rem 2rem 1rem",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
  },
  footerTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  footerText: {
    color: "#cbd5e0",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
  footerList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  footerListItem: {
    color: "#cbd5e0",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
    cursor: "pointer",
  },
  footerBottom: {
    borderTop: "1px solid #4a5568",
    paddingTop: "1.5rem",
    textAlign: "center",
  },
  footerCopyright: {
    color: "#cbd5e0",
    fontSize: "0.85rem",
  },
};
