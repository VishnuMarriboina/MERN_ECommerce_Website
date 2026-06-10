import React from "react";
import { Link } from "react-router-dom";
import { FOOTER_LINKS } from "./DataFolder/dashboardData";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.brandName}>Vishnu's Store</span>
          <span style={styles.divider}>|</span>
          <span style={styles.tagline}>Quality Fashion &amp; Accessories</span>
        </div>

        <nav style={styles.links}>
          {FOOTER_LINKS.map(({ label, to }) => (
            <Link key={to} to={to} style={styles.link}>
              {label}
            </Link>
          ))}
        </nav>

        <span style={styles.copyright}>© {year} All rights reserved.</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#1e293b",
    borderTop: "1px solid #334155",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  brandName: {
    color: "#f1f5f9",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.3px",
  },
  divider: {
    color: "#475569",
    fontSize: "14px",
  },
  tagline: {
    color: "#94a3b8",
    fontSize: "13px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  link: {
    color: "#94a3b8",
    fontSize: "13px",
    textDecoration: "none",
    transition: "color 0.2s",
    cursor: "pointer",
  },
  copyright: {
    color: "#64748b",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
};
