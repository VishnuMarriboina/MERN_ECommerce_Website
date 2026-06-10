import React from "react";
import { useNavigate } from "react-router-dom";
import { ABOUT_TEAM as TEAM, ABOUT_VALUES as VALUES } from "../DataFolder/pagesData";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      <style>{`
        .info-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.09) !important; }
        .info-card { transition: transform 0.18s, box-shadow 0.18s; }
        .back-btn:hover { background-color: #f1f5f9 !important; }
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
        <div style={s.heroText}>
          <span style={s.heroEyebrow}>Our Story</span>
          <h1 style={s.heroTitle}>Vishnu's Store</h1>
          <p style={s.heroSub}>
            Born from a passion for accessible fashion, we connect people with
            quality clothing and accessories — without the luxury markup.
          </p>
        </div>
      </div>

      <div style={s.body}>
        {/* Mission */}
        <section style={s.section}>
          <div style={s.missionCard}>
            <h2 style={s.sectionTitle}>Our Mission</h2>
            <p style={s.missionText}>
              We believe great style shouldn't cost a fortune. Since our
              founding, we've been on a mission to make premium fashion
              accessible to everyone across India. Every shirt, belt, watch, and
              pair of shoes we offer is selected for its craftsmanship,
              durability, and value — so you look your best without
              overspending.
            </p>
            <div style={s.statRow}>
              {[
                { value: "10,000+", label: "Happy Customers" },
                { value: "500+", label: "Products" },
                { value: "4.8★", label: "Avg. Rating" },
                { value: "2022", label: "Founded" },
              ].map(({ value, label }) => (
                <div key={label} style={s.stat}>
                  <span style={s.statValue}>{value}</span>
                  <span style={s.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={s.section}>
          <h2 style={{ ...s.sectionTitle, marginBottom: 20 }}>
            What We Stand For
          </h2>
          <div style={s.grid3}>
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="info-card" style={s.valueCard}>
                <span style={s.valueIcon}>{icon}</span>
                <h3 style={s.valueTitle}>{title}</h3>
                <p style={s.valueDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section style={s.section}>
          <h2 style={{ ...s.sectionTitle, marginBottom: 20 }}>Meet the Team</h2>
          <div style={s.grid4}>
            {TEAM.map(({ name, role, emoji }) => (
              <div key={name} className="info-card" style={s.teamCard}>
                <div style={s.teamAvatar}>{emoji}</div>
                <h4 style={s.teamName}>{name}</h4>
                <span style={s.teamRole}>{role}</span>
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
      "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1d4ed8 100%)",
    padding: "48px 40px 52px",
    position: "relative",
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
  heroText: { maxWidth: 680 },
  heroEyebrow: {
    display: "inline-block",
    marginBottom: 10,
    padding: "4px 12px",
    backgroundColor: "rgba(59,130,246,0.2)",
    border: "1px solid rgba(59,130,246,0.4)",
    borderRadius: 20,
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  heroTitle: {
    margin: "0 0 14px",
    fontSize: 40,
    fontWeight: 800,
    color: "#f1f5f9",
    letterSpacing: "-0.5px",
  },
  heroSub: {
    margin: 0,
    fontSize: 16,
    color: "#94a3b8",
    lineHeight: 1.65,
    maxWidth: 560,
  },

  body: { maxWidth: 1100, margin: "0 auto", padding: "40px 28px" },
  section: { marginBottom: 52 },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: 22,
    fontWeight: 700,
    color: "#1e293b",
  },

  missionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "36px 36px 28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  missionText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 1.75,
    margin: "10px 0 28px",
  },
  statRow: {
    display: "flex",
    gap: 0,
    borderTop: "1px solid #f1f5f9",
    paddingTop: 24,
  },
  stat: {
    flex: 1,
    textAlign: "center",
    borderRight: "1px solid #f1f5f9",
    padding: "0 16px",
  },
  statValue: {
    display: "block",
    fontSize: 24,
    fontWeight: 800,
    color: "#1e40af",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
  },
  valueCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "24px 22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  valueIcon: { fontSize: 28, display: "block", marginBottom: 12 },
  valueTitle: {
    margin: "0 0 8px",
    fontSize: 15,
    fontWeight: 700,
    color: "#1e293b",
  },
  valueDesc: { margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 18,
  },
  teamCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "28px 20px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    margin: "0 auto 14px",
  },
  teamName: {
    margin: "0 0 6px",
    fontSize: 14,
    fontWeight: 700,
    color: "#1e293b",
  },
  teamRole: { fontSize: 12, color: "#64748b", fontWeight: 500 },
};
