import React, { useEffect, useState } from "react";
import api from "../../../utils/APIKit";

const STATUS_COLORS = {
  New:      { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  Read:     { bg: "#fefce8", text: "#92400e", border: "#fde68a" },
  Resolved: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
};

export default function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/contact/all");
      setContacts(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/contact/${id}/status`, { status });
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? res.data.data : c))
      );
      if (selected?._id === id) setSelected(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const filtered = filter === "All" ? contacts : contacts.filter((c) => c.status === filter);

  if (loading) return (
    <div style={S.center}>
      <div style={S.spinner} /><p style={S.hint}>Loading messages…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={S.center}>
      <span style={{ fontSize: 36 }}>⚠️</span>
      <p style={{ color: "#ef4444", fontSize: 14 }}>{error}</p>
      <button style={S.retryBtn} onClick={fetchContacts}>Retry</button>
    </div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h2 style={S.title}>Contact Messages</h2>
          <p style={S.subtitle}>{contacts.length} total • {contacts.filter(c => c.status === "New").length} new</p>
        </div>
        <div style={S.filters}>
          {["All", "New", "Read", "Resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...S.filterBtn, ...(filter === f ? S.filterBtnActive : {}) }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={S.layout}>
        {/* List */}
        <div style={S.list}>
          {filtered.length === 0 && (
            <div style={S.empty}>No {filter !== "All" ? filter.toLowerCase() : ""} messages</div>
          )}
          {filtered.map((c) => {
            const sc = STATUS_COLORS[c.status] || STATUS_COLORS.New;
            const isActive = selected?._id === c._id;
            return (
              <div
                key={c._id}
                onClick={() => setSelected(c)}
                style={{ ...S.card, ...(isActive ? S.cardActive : {}) }}
              >
                <div style={S.cardTop}>
                  <span style={S.senderName}>{c.name}</span>
                  <span style={{ ...S.badge, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                    {c.status}
                  </span>
                </div>
                <p style={S.cardEmail}>{c.email}</p>
                <p style={S.cardTopic}>{c.topic}</p>
                <p style={S.cardMsg}>{c.message.length > 80 ? c.message.slice(0, 80) + "…" : c.message}</p>
                <p style={S.cardDate}>{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div style={S.detail}>
            <div style={S.detailHeader}>
              <h3 style={S.detailName}>{selected.name}</h3>
              <button style={S.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <p style={S.detailEmail}>{selected.email}</p>
            <div style={S.detailRow}>
              <span style={S.detailLabel}>Topic</span>
              <span style={S.detailValue}>{selected.topic}</span>
            </div>
            <div style={S.detailRow}>
              <span style={S.detailLabel}>Received</span>
              <span style={S.detailValue}>
                {new Date(selected.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <div style={S.msgBox}>
              <p style={S.msgText}>{selected.message}</p>
            </div>
            <div style={S.statusActions}>
              <span style={S.detailLabel}>Update status:</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["New", "Read", "Resolved"].map((st) => {
                  const sc = STATUS_COLORS[st];
                  const isCurrent = selected.status === st;
                  return (
                    <button
                      key={st}
                      disabled={isCurrent}
                      onClick={() => updateStatus(selected._id, st)}
                      style={{
                        ...S.statusBtn,
                        background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                        opacity: isCurrent ? 0.5 : 1,
                        cursor: isCurrent ? "default" : "pointer",
                      }}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ ...S.detail, ...S.center }}>
            <span style={{ fontSize: 40 }}>📨</span>
            <p style={S.hint}>Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { padding: "28px 32px", minHeight: "100%", backgroundColor: "#f8fafc" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 },
  title: { margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#1e293b" },
  subtitle: { margin: 0, fontSize: 13, color: "#64748b" },
  filters: { display: "flex", gap: 8 },
  filterBtn: { padding: "6px 14px", border: "1px solid #e2e8f0", borderRadius: 8, backgroundColor: "#fff", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  filterBtnActive: { backgroundColor: "#6366f1", color: "#fff", border: "1px solid #6366f1" },
  layout: { display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" },
  list: { display: "flex", flexDirection: "column", gap: 10, maxHeight: "calc(100vh - 220px)", overflowY: "auto" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: "16px", border: "1px solid #e2e8f0", cursor: "pointer", transition: "box-shadow 0.15s, border-color 0.15s" },
  cardActive: { borderColor: "#6366f1", boxShadow: "0 0 0 2px rgba(99,102,241,0.15)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  senderName: { fontWeight: 700, fontSize: 14, color: "#1e293b" },
  badge: { fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20 },
  cardEmail: { margin: "0 0 4px", fontSize: 12, color: "#64748b" },
  cardTopic: { margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6366f1" },
  cardMsg: { margin: "0 0 6px", fontSize: 13, color: "#475569", lineHeight: 1.5 },
  cardDate: { margin: 0, fontSize: 11, color: "#94a3b8" },
  detail: { backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "24px", minHeight: 400 },
  detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  detailName: { margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94a3b8", padding: 4 },
  detailEmail: { margin: "0 0 20px", fontSize: 14, color: "#64748b" },
  detailRow: { display: "flex", gap: 12, marginBottom: 12, alignItems: "baseline" },
  detailLabel: { fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", minWidth: 70 },
  detailValue: { fontSize: 14, color: "#1e293b" },
  msgBox: { backgroundColor: "#f8fafc", borderRadius: 10, padding: "16px", border: "1px solid #e2e8f0", margin: "16px 0" },
  msgText: { margin: 0, fontSize: 14, color: "#334155", lineHeight: 1.7 },
  statusActions: { display: "flex", flexDirection: "column", gap: 10 },
  statusBtn: { padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "opacity 0.15s" },
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "48px 0" },
  spinner: { width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  hint: { color: "#94a3b8", fontSize: 14, margin: 0 },
  retryBtn: { padding: "8px 20px", backgroundColor: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
  empty: { textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 },
};
