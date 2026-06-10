import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTACT_CHANNELS as CHANNELS, CONTACT_TOPICS as TOPICS } from "../DataFolder/pagesData";
import api from "../../utils/APIKit";

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.topic) e.topic = "Please select a topic";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setApiError("");
    try {
      await api.post("/contact/submit", form);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  return (
    <div style={s.page}>
      <style>{`
        .info-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
        .info-card { transition: transform 0.18s, box-shadow 0.18s; }
        .back-btn:hover { background-color: rgba(255,255,255,0.12) !important; }
        .submit-btn:hover:not(:disabled) { background: linear-gradient(135deg, #1d4ed8, #1e40af) !important; }
        .form-input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important; }
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
        <span style={s.eyebrow}>We're here for you</span>
        <h1 style={s.heroTitle}>Contact Us</h1>
        <p style={s.heroSub}>
          Have a question or need help? Reach out and we'll get back to you
          quickly.
        </p>
      </div>

      <div style={s.body}>
        {/* Contact Channels */}
        <div style={s.channelGrid}>
          {CHANNELS.map(({ icon, label, value, note }) => (
            <div key={label} className="info-card" style={s.channelCard}>
              <span style={s.channelIcon}>{icon}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={s.channelLabel}>{label}</p>
                <p style={s.channelValue}>{value}</p>
                <p style={s.channelNote}>{note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div style={s.formWrap}>
          {submitted ? (
            <div style={s.successBox}>
              <div style={s.successIcon}>✅</div>
              <h3 style={s.successTitle}>Message Sent!</h3>
              <p style={s.successMsg}>
                Thanks, <strong>{form.name}</strong>! We've received your
                message and will reply to <strong>{form.email}</strong> within
                24 hours.
              </p>
              <button
                style={s.resetBtn}
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", topic: "", message: "" });
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h2 style={s.formTitle}>Send us a Message</h2>
              <p style={s.formSub}>
                Fill in the form below and we'll respond within one business
                day.
              </p>

              <form onSubmit={handleSubmit} noValidate style={s.form}>
                <div style={s.row2}>
                  <div style={s.fieldWrap}>
                    <label style={s.label}>Full Name</label>
                    <input
                      className="form-input"
                      style={{ ...s.input, ...(errors.name ? s.inputErr : {}) }}
                      placeholder="Vishnu Marriboina"
                      value={form.name}
                      onChange={(e) => field("name", e.target.value)}
                    />
                    {errors.name && <span style={s.errMsg}>{errors.name}</span>}
                  </div>
                  <div style={s.fieldWrap}>
                    <label style={s.label}>Email Address</label>
                    <input
                      className="form-input"
                      style={{
                        ...s.input,
                        ...(errors.email ? s.inputErr : {}),
                      }}
                      placeholder="you@example.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => field("email", e.target.value)}
                    />
                    {errors.email && (
                      <span style={s.errMsg}>{errors.email}</span>
                    )}
                  </div>
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.label}>Topic</label>
                  <select
                    className="form-input"
                    style={{
                      ...s.input,
                      ...(errors.topic ? s.inputErr : {}),
                      cursor: "pointer",
                    }}
                    value={form.topic}
                    onChange={(e) => field("topic", e.target.value)}
                  >
                    <option value="">Select a topic…</option>
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.topic && <span style={s.errMsg}>{errors.topic}</span>}
                </div>

                <div style={s.fieldWrap}>
                  <label style={s.label}>Message</label>
                  <textarea
                    className="form-input"
                    style={{
                      ...s.input,
                      ...s.textarea,
                      ...(errors.message ? s.inputErr : {}),
                    }}
                    placeholder="Describe your issue or question in detail…"
                    value={form.message}
                    onChange={(e) => field("message", e.target.value)}
                  />
                  {errors.message && (
                    <span style={s.errMsg}>{errors.message}</span>
                  )}
                </div>

                {apiError && <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 500, margin: 0 }}>{apiError}</p>}
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={submitting}
                  style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Sending…" : "Send Message →"}
                </button>
              </form>
            </>
          )}
        </div>
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
      "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0369a1 100%)",
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
    backgroundColor: "rgba(14,165,233,0.2)",
    border: "1px solid rgba(14,165,233,0.35)",
    borderRadius: 20,
    color: "#7dd3fc",
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
    margin: 0,
    fontSize: 16,
    color: "#94a3b8",
    lineHeight: 1.65,
    maxWidth: 520,
  },

  body: { maxWidth: 1000, margin: "0 auto", padding: "40px 28px" },

  channelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 16,
    marginBottom: 44,
  },
  channelCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "22px 20px",
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  channelIcon: { fontSize: 26, lineHeight: 1, marginTop: 2 },
  channelLabel: {
    margin: "0 0 2px",
    fontSize: 11,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  channelValue: {
    margin: "0 0 3px",
    fontSize: 14,
    fontWeight: 600,
    color: "#1e293b",
    wordBreak: "break-all",
    overflowWrap: "break-word",
  },
  channelNote: { margin: 0, fontSize: 12, color: "#64748b" },

  formWrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "36px 36px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  formTitle: {
    margin: "0 0 6px",
    fontSize: 22,
    fontWeight: 700,
    color: "#1e293b",
  },
  formSub: { margin: "0 0 28px", fontSize: 14, color: "#64748b" },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    padding: "10px 14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 14,
    color: "#1e293b",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
    outline: "none",
  },
  inputErr: { borderColor: "#fca5a5", backgroundColor: "#fff8f8" },
  textarea: { minHeight: 120, resize: "vertical" },
  errMsg: { fontSize: 12, color: "#ef4444", fontWeight: 500 },
  submitBtn: {
    alignSelf: "flex-start",
    padding: "12px 28px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },

  successBox: { textAlign: "center", padding: "40px 20px" },
  successIcon: { fontSize: 48, marginBottom: 16 },
  successTitle: {
    margin: "0 0 12px",
    fontSize: 22,
    fontWeight: 700,
    color: "#1e293b",
  },
  successMsg: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 1.65,
    marginBottom: 24,
  },
  resetBtn: {
    padding: "10px 24px",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
