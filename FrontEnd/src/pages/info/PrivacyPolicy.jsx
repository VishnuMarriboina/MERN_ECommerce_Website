import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRIVACY_SECTIONS as SECTIONS } from "../DataFolder/pagesData";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("collect");

  const active = SECTIONS.find((s) => s.id === activeId);

  return (
    <div style={s.page}>
      <style>{`
        .back-btn:hover  { background-color: rgba(255,255,255,0.12) !important; }
        .toc-btn         { transition: all 0.15s; }
        .toc-btn:hover   { background-color: #f1f5f9 !important; }
        .toc-btn.active  { background-color: #eff6ff !important; color: #1d4ed8 !important; border-left: 3px solid #3b82f6 !important; }
      `}</style>

      {/* Hero */}
      <div style={s.hero}>
        <button className="back-btn" style={s.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <span style={s.eyebrow}>Last updated: May 2025</span>
        <h1 style={s.heroTitle}>Privacy Policy</h1>
        <p style={s.heroSub}>
          Your privacy matters to us. This policy explains what data we collect, how we use it,
          and the choices you have — in plain, clear language.
        </p>
      </div>

      <div style={s.body}>
        <div style={s.layout}>

          {/* Table of Contents (sticky sidebar) */}
          <aside style={s.toc}>
            <p style={s.tocLabel}>Contents</p>
            {SECTIONS.map(({ id, icon, title }) => (
              <button
                key={id}
                className={`toc-btn ${activeId === id ? "active" : ""}`}
                style={{
                  ...s.tocBtn,
                  ...(activeId === id ? s.tocBtnActive : {}),
                }}
                onClick={() => setActiveId(id)}
              >
                <span>{icon}</span>
                <span>{title}</span>
              </button>
            ))}
            <div style={s.tocNote}>
              Questions? <span
                style={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}
                onClick={() => navigate("/contact")}
              >Contact Us</span>
            </div>
          </aside>

          {/* Content */}
          <div style={s.content}>
            <div style={s.contentCard}>
              <div style={s.contentHeader}>
                <span style={s.contentIcon}>{active.icon}</span>
                <h2 style={s.contentTitle}>{active.title}</h2>
              </div>
              {active.content.map(({ sub, text }) => (
                <div key={sub} style={s.subsection}>
                  <h4 style={s.subTitle}>{sub}</h4>
                  <p style={s.subText}>{text}</p>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div style={s.footNote}>
              <strong>Governing Law:</strong> This Privacy Policy is governed by the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.
              By using Vishnu's Store, you agree to the terms of this policy.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const s = {
  page: { backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #1e3a5f 100%)",
    padding: "48px 40px 52px",
  },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 16px", backgroundColor: "rgba(255,255,255,0.08)",
    color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
    marginBottom: 28, transition: "background 0.15s",
  },
  eyebrow: {
    display: "inline-block", marginBottom: 10,
    padding: "4px 12px", backgroundColor: "rgba(148,163,184,0.15)",
    border: "1px solid rgba(148,163,184,0.25)", borderRadius: 20,
    color: "#94a3b8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px",
  },
  heroTitle: { margin: "0 0 12px", fontSize: 40, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.5px", display: "block" },
  heroSub:   { margin: 0, fontSize: 15, color: "#94a3b8", lineHeight: 1.7, maxWidth: 580 },

  body:   { maxWidth: 1100, margin: "0 auto", padding: "40px 28px" },
  layout: { display: "flex", gap: 28, alignItems: "flex-start" },

  toc: {
    width: 220, flexShrink: 0, position: "sticky", top: 80,
    backgroundColor: "#fff", borderRadius: 14, padding: "16px 10px 20px",
    border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  tocLabel: { margin: "0 0 10px 8px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px" },
  tocBtn: {
    display: "flex", alignItems: "center", gap: 8,
    width: "100%", padding: "9px 10px",
    background: "none", border: "none", borderLeft: "3px solid transparent",
    borderRadius: "0 8px 8px 0", cursor: "pointer",
    fontSize: 13, color: "#374151", fontWeight: 500, textAlign: "left",
    fontFamily: "inherit",
  },
  tocBtnActive: { backgroundColor: "#eff6ff", color: "#1d4ed8", fontWeight: 700, borderLeft: "3px solid #3b82f6" },
  tocNote: {
    marginTop: 18, paddingTop: 14, borderTop: "1px solid #f1f5f9",
    fontSize: 12, color: "#94a3b8", textAlign: "center",
  },

  content: { flex: 1, minWidth: 0 },
  contentCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: "32px 36px",
    border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    marginBottom: 16,
  },
  contentHeader: { display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #f1f5f9" },
  contentIcon:   { fontSize: 32 },
  contentTitle:  { margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" },
  subsection:    { marginBottom: 22 },
  subTitle:      { margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#1e293b" },
  subText:       { margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.75 },
  footNote: {
    backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12,
    padding: "16px 20px", fontSize: 13, color: "#78350f", lineHeight: 1.65,
  },
};
