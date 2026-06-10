import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RETURN_ELIGIBLE as ELIGIBLE,
  RETURN_NOT_ELIGIBLE as NOT_ELIGIBLE,
  RETURN_STEPS as STEPS,
  REFUND_MODES,
  RETURN_FAQS,
} from "../DataFolder/pagesData";

export default function Returns() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={s.page}>
      <style>{`
        .back-btn:hover { background-color: rgba(255,255,255,0.12) !important; }
        .faq-item { transition: background 0.15s; }
        .faq-item:hover { background-color: #f8fafc !important; }
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
        <span style={s.eyebrow}>7-Day Return Window</span>
        <h1 style={s.heroTitle}>Returns & Refunds</h1>
        <p style={s.heroSub}>
          Not happy with your order? We make returns simple, fast, and
          hassle-free.
        </p>
        <div style={s.heroBadges}>
          <span style={s.badge}>✅ 7-day returns</span>
          <span style={s.badge}>💰 Full refund</span>
          <span style={s.badge}>🔄 Easy exchange</span>
        </div>
      </div>

      <div style={s.body}>
        {/* Eligibility */}
        <section style={s.section}>
          <div style={s.eligibilityGrid}>
            {/* Eligible */}
            <div style={s.eligCard}>
              <div style={s.eligHeader}>
                <span style={s.eligIconGreen}>✅</span>
                <h3 style={{ ...s.eligTitle, color: "#065f46" }}>
                  Eligible for Return
                </h3>
              </div>
              <ul style={s.eligList}>
                {ELIGIBLE.map((item) => (
                  <li key={item} style={s.eligItem}>
                    <span style={{ color: "#10b981", marginRight: 8 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Eligible */}
            <div
              style={{
                ...s.eligCard,
                borderColor: "#fecaca",
                backgroundColor: "#fff8f8",
              }}
            >
              <div style={s.eligHeader}>
                <span style={s.eligIconRed}>❌</span>
                <h3 style={{ ...s.eligTitle, color: "#991b1b" }}>
                  Not Eligible
                </h3>
              </div>
              <ul style={s.eligList}>
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item} style={s.eligItem}>
                    <span style={{ color: "#ef4444", marginRight: 8 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>How to Initiate a Return</h2>
          <p style={s.sectionSub}>
            Follow these 5 steps to complete your return smoothly.
          </p>
          <div style={s.stepsGrid}>
            {STEPS.map(({ icon, step, title, desc }) => (
              <div key={step} style={s.stepCard}>
                <div style={s.stepTop}>
                  <span style={s.stepIcon}>{icon}</span>
                  <span style={s.stepNum}>Step {step}</span>
                </div>
                <h4 style={s.stepTitle}>{title}</h4>
                <p style={s.stepDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Refund modes */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Refund Timeline by Payment Method</h2>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Payment Method</th>
                  <th style={s.th}>Refund Time</th>
                  <th style={s.th}>Note</th>
                </tr>
              </thead>
              <tbody>
                {REFUND_MODES.map(({ mode, time, note }, i) => (
                  <tr
                    key={mode}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#f8fafc" : "#fff",
                    }}
                  >
                    <td style={{ ...s.td, fontWeight: 600, color: "#1e293b" }}>
                      {mode}
                    </td>
                    <td style={{ ...s.td }}>
                      <span style={s.timeBadge}>{time}</span>
                    </td>
                    <td style={{ ...s.td, color: "#64748b" }}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Frequently Asked Questions</h2>
          <div style={s.faqList}>
            {RETURN_FAQS.map(({ q, a }, i) => (
              <div
                key={i}
                className="faq-item"
                style={s.faqItem}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={s.faqQ}>
                  <span>{q}</span>
                  <span style={s.faqChevron}>{openFaq === i ? "▲" : "▼"}</span>
                </div>
                {openFaq === i && <p style={s.faqA}>{a}</p>}
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
      "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #7c3aed 100%)",
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
    backgroundColor: "rgba(167,139,250,0.2)",
    border: "1px solid rgba(167,139,250,0.35)",
    borderRadius: 20,
    color: "#c4b5fd",
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
    maxWidth: 540,
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

  eligibilityGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  eligCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 14,
    padding: "24px",
    border: "1.5px solid #bbf7d0",
  },
  eligHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  eligIconGreen: { fontSize: 22 },
  eligIconRed: { fontSize: 22 },
  eligTitle: { margin: 0, fontSize: 15, fontWeight: 700 },
  eligList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },
  eligItem: { fontSize: 13, color: "#374151", lineHeight: 1.5 },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 16,
  },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "22px 18px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  stepTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stepIcon: { fontSize: 26 },
  stepNum: {
    fontSize: 11,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stepTitle: {
    margin: "0 0 8px",
    fontSize: 14,
    fontWeight: 700,
    color: "#1e293b",
  },
  stepDesc: { margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.6 },

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
    cursor: "pointer",
  },
  faqQ: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
  },
  faqChevron: { fontSize: 11, color: "#94a3b8", flexShrink: 0, marginLeft: 12 },
  faqA: {
    margin: "12px 0 0",
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.65,
  },
};
