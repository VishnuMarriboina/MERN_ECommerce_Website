import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DELIVERY_OPTIONS,
  DELIVERY_ZONES as ZONES,
  SHIPPING_STEPS as STEPS,
  SHIPPING_FAQS,
} from "../DataFolder/pagesData";

export default function Shipping() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      <style>{`
        .back-btn:hover { background-color: rgba(255,255,255,0.12) !important; }
        .info-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
        .info-card { transition: transform 0.18s, box-shadow 0.18s; }
      `}</style>

      {/* Hero */}
      <div style={s.hero}>
        <button
          className="back-btn"
          style={s.backBtn}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <span style={s.eyebrow}>Delivery Information</span>
        <h1 style={s.heroTitle}>Shipping Policy</h1>
        <p style={s.heroSub}>
          Fast, reliable delivery across India. Here's everything you need to
          know about how we ship your orders.
        </p>
        <div style={s.heroBadges}>
          <span style={s.badge}>🚚 Free shipping over ₹499</span>
          <span style={s.badge}>📦 Packed in 24 hrs</span>
          <span style={s.badge}>📍 Pan-India delivery</span>
        </div>
      </div>

      <div style={s.body}>
        {/* Delivery Options */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Delivery Options</h2>
          <p style={s.sectionSub}>
            Choose the delivery speed that works best for you at checkout.
          </p>
          <div style={s.optionGrid}>
            {DELIVERY_OPTIONS.map(({ icon, type, time, price, note }) => (
              <div
                key={type}
                className="info-card"
                style={{
                  ...s.optionCard,
                  ...(price === "FREE" ? s.freeCard : {}),
                }}
              >
                <div style={s.optionTop}>
                  <span style={s.optionIcon}>{icon}</span>
                  <span
                    style={{
                      ...s.optionPrice,
                      ...(price === "FREE" ? s.freePriceText : {}),
                    }}
                  >
                    {price}
                  </span>
                </div>
                <h3 style={s.optionType}>{type}</h3>
                <p style={s.optionTime}>{time}</p>
                <p style={s.optionNote}>{note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>How Your Order Travels</h2>
          <div style={s.stepsWrap}>
            {STEPS.map(({ icon, label, desc }, i) => (
              <div key={label} style={s.stepRow}>
                <div style={s.stepLeft}>
                  <div style={s.stepCircle}>{icon}</div>
                  {i < STEPS.length - 1 && <div style={s.stepLine} />}
                </div>
                <div style={s.stepContent}>
                  <h4 style={s.stepLabel}>{label}</h4>
                  <p style={s.stepDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery Zones */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Delivery Timelines by Zone</h2>
          <p style={s.sectionSub}>
            Estimated days are counted from the date of dispatch, excluding
            Sundays and public holidays.
          </p>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Zone</th>
                  <th style={s.th}>Includes</th>
                  <th style={{ ...s.th, textAlign: "center" }}>
                    Est. Delivery
                  </th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map(({ zone, cities, time }, i) => (
                  <tr
                    key={zone}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#f8fafc" : "#fff",
                    }}
                  >
                    <td style={{ ...s.td, fontWeight: 600, color: "#1e293b" }}>
                      {zone}
                    </td>
                    <td style={{ ...s.td, color: "#64748b" }}>{cities}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span style={s.timeBadge}>{time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Shipping FAQs</h2>
          <div style={s.faqList}>
            {SHIPPING_FAQS.map(({ q, a }) => (
              <div key={q} style={s.faqItem}>
                <h4 style={s.faqQ}>❓ {q}</h4>
                <p style={s.faqA}>{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const s = {
  page: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  hero: {
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #065f46 100%)",
    padding: "48px 40px 52px",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 16px",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 28,
    transition: "background 0.15s",
  },
  eyebrow: {
    display: "inline-block",
    marginBottom: 10,
    padding: "4px 12px",
    backgroundColor: "rgba(16,185,129,0.2)",
    border: "1px solid rgba(16,185,129,0.35)",
    borderRadius: 20,
    color: "#6ee7b7",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  heroTitle: {
    margin: "0 0 12px",
    fontSize: 40,
    fontWeight: 800,
    color: "#f1f5f9",
    letterSpacing: "-0.5px",
    display: "block",
  },
  heroSub: {
    margin: "0 0 24px",
    fontSize: 16,
    color: "#94a3b8",
    lineHeight: 1.65,
    maxWidth: 560,
  },
  heroBadges: { display: "flex", flexWrap: "wrap", gap: 10 },
  badge: {
    padding: "6px 14px",
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 20,
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 500,
  },

  body: { maxWidth: 1000, margin: "0 auto", padding: "40px 28px" },
  section: { marginBottom: 52 },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: 22,
    fontWeight: 700,
    color: "#1e293b",
  },
  sectionSub: { margin: "0 0 20px", fontSize: 14, color: "#64748b" },

  optionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  freeCard: { border: "1.5px solid #6ee7b7", backgroundColor: "#f0fdf4" },
  optionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionIcon: { fontSize: 28 },
  optionPrice: { fontSize: 22, fontWeight: 800, color: "#1e293b" },
  freePriceText: { color: "#059669" },
  optionType: {
    margin: "0 0 4px",
    fontSize: 15,
    fontWeight: 700,
    color: "#1e293b",
  },
  optionTime: {
    margin: "0 0 6px",
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: 600,
  },
  optionNote: { margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.5 },

  stepsWrap: { paddingLeft: 0 },
  stepRow: { display: "flex", gap: 20, alignItems: "flex-start" },
  stepLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    border: "2px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: "#e2e8f0",
    margin: "4px 0",
  },
  stepContent: { paddingBottom: 24 },
  stepLabel: {
    margin: "0 0 4px",
    fontSize: 15,
    fontWeight: 700,
    color: "#1e293b",
  },
  stepDesc: { margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 },

  tableWrap: {
    overflowX: "auto",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#1e293b" },
  th: {
    padding: "13px 18px",
    fontSize: 12,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "left",
  },
  td: { padding: "13px 18px", fontSize: 13, borderBottom: "1px solid #f1f5f9" },
  timeBadge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },

  faqList: { display: "flex", flexDirection: "column", gap: 2 },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "18px 22px",
    border: "1px solid #e2e8f0",
  },
  faqQ: { margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#1e293b" },
  faqA: { margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.65 },
};
