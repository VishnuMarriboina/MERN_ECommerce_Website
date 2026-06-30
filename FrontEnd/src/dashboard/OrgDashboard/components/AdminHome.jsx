import React, { useState, useEffect } from "react";
import api from "../../../utils/APIKit";
import {
  MONTHS,
  ADMIN_STATUS_COLORS as STATUS_COLORS,
  CATEGORY_COLORS,
} from "../DataFolder/orgDashboardData";

function fmt$(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}
function fmtN(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(n);
}

/* ─── Loading & Error states ─────────────────────────────────────── */
function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          border: "3px solid #e2e8f0",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
        Loading dashboard…
      </p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
function ErrorState({ error }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 40 }}>⚠️</span>
      <p style={{ color: "#ef4444", fontSize: 14, fontWeight: 500, margin: 0 }}>
        {error}
      </p>
    </div>
  );
}

/* ─── KPI Stat Card ──────────────────────────────────────────────── */
function StatCard({ title, value, subtitle, trend, icon, accent }) {
  const pos = trend >= 0;
  return (
    <div style={S.statCard}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={S.statLabel}>{title}</p>
          <h2 style={S.statValue}>{value}</h2>
          <p style={S.statSub}>{subtitle}</p>
        </div>
        <div style={{ ...S.statIconBox, background: accent + "18" }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
        </div>
      </div>
      {trend !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 10,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: pos ? "#10b981" : "#ef4444",
            }}
          >
            {pos ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          </span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>vs last month</span>
        </div>
      )}
    </div>
  );
}

/* ─── SVG Line Chart ─────────────────────────────────────────────── */
function LineChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#cbd5e1",
          fontSize: 13,
        }}
      >
        Not enough data
      </div>
    );
  }

  const W = 500,
    H = 160;
  const pL = 44,
    pR = 12,
    pT = 12,
    pB = 30;
  const iW = W - pL - pR,
    iH = H - pT - pB;
  const maxV = Math.max(...data.map((d) => d.revenue), 1);

  const px = (i) => pL + (i / (data.length - 1)) * iW;
  const py = (v) => pT + iH - (v / maxV) * iH;

  const line = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d.revenue).toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${px(data.length - 1).toFixed(1)},${(pT + iH).toFixed(1)} L${px(0).toFixed(1)},${(pT + iH).toFixed(1)} Z`;
  const yTicks = [0, maxV * 0.5, maxV];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="lgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={pL}
            y1={py(t)}
            x2={pL + iW}
            y2={py(t)}
            stroke="#f1f5f9"
            strokeWidth="1.5"
          />
          <text
            x={pL - 5}
            y={py(t) + 4}
            textAnchor="end"
            fontSize="9"
            fill="#94a3b8"
          >
            {t === 0 ? "$0" : fmt$(t)}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#lgGrad)" />
      <path
        d={line}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {data.map((d, i) => (
        <circle
          key={i}
          cx={px(i)}
          cy={py(d.revenue)}
          r="3.5"
          fill="#6366f1"
          stroke="white"
          strokeWidth="2"
        />
      ))}
      {data.map((d, i) => (
        <text
          key={i}
          x={px(i)}
          y={H - 4}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────────── */
function DonutChart({ slices, size = 120 }) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total === 0)
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#cbd5e1",
          fontSize: 12,
        }}
      >
        No data
      </div>
    );

  const r = size * 0.38,
    ir = size * 0.22,
    cx = size / 2,
    cy = size / 2;
  let angle = -Math.PI / 2;

  const paths = slices.map((d) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const ea = angle + sweep;
    const lg = sweep > Math.PI ? 1 : 0;
    const path = [
      `M${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`,
      `A${r},${r} 0 ${lg},1 ${(cx + r * Math.cos(ea)).toFixed(2)},${(cy + r * Math.sin(ea)).toFixed(2)}`,
      `L${(cx + ir * Math.cos(ea)).toFixed(2)},${(cy + ir * Math.sin(ea)).toFixed(2)}`,
      `A${ir},${ir} 0 ${lg},0 ${(cx + ir * Math.cos(angle)).toFixed(2)},${(cy + ir * Math.sin(angle)).toFixed(2)}`,
      "Z",
    ].join(" ");
    angle = ea;
    return { ...d, path };
  });

  return (
    <svg width={size} height={size}>
      {paths.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} />
      ))}
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        fontSize={size * 0.14}
        fontWeight="700"
        fill="#0f172a"
      >
        {fmtN(total)}
      </text>
      <text
        x={cx}
        y={cy + 11}
        textAnchor="middle"
        fontSize={size * 0.09}
        fill="#94a3b8"
      >
        orders
      </text>
    </svg>
  );
}

/* ─── Bar row ────────────────────────────────────────────────────── */
function BarRow({ label, value, maxValue, color, suffix = "" }) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  return (
    <div style={{ marginBottom: 11 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#475569",
            maxWidth: "62%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
          {suffix}
          {value.toLocaleString()}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: "#f1f5f9" }}>
        <div
          style={{
            height: "100%",
            borderRadius: 4,
            background: color,
            width: `${pct}%`,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────── */
export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, uRes] = await Promise.all([
          api.get("/orders/stats"),
          api.get("/users/allUsers"),
        ]);
        setStats(sRes.data);
        setUserCount(uRes.data?.data?.length ?? 0);
      } catch (e) {
        setError(e?.response?.data?.error || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  /* Build 6-month array (fill gaps with 0) */
  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const found = stats.monthlySales.find(
      (s) => s._id.year === d.getFullYear() && s._id.month === d.getMonth() + 1,
    );
    return {
      label: MONTHS[d.getMonth()],
      revenue: found?.revenue ?? 0,
      orders: found?.orders ?? 0,
    };
  });

  const curRev = chartData[5]?.revenue ?? 0;
  const prevRev = chartData[4]?.revenue ?? 0;
  const revTrend = prevRev > 0 ? ((curRev - prevRev) / prevRev) * 100 : 0;
  const curOrd = chartData[5]?.orders ?? 0;
  const prevOrd = chartData[4]?.orders ?? 0;
  const ordTrend = prevOrd > 0 ? ((curOrd - prevOrd) / prevOrd) * 100 : 0;

  const activeOrders =
    (stats.statusBreakdown.Pending ?? 0) +
    (stats.statusBreakdown.Confirmed ?? 0) +
    (stats.statusBreakdown.Shipped ?? 0);

  const donutSlices = Object.entries(stats.statusBreakdown).map(([k, v]) => ({
    label: k,
    value: v,
    color: STATUS_COLORS[k] ?? "#94a3b8",
  }));

  const maxCatRev = Math.max(
    ...stats.categoryBreakdown.map((c) => c.revenue),
    1,
  );
  const maxProdQty = Math.max(...stats.topProducts.map((p) => p.quantity), 1);

  return (
    <div style={S.page}>
      {/* ── KPI Row ──────────────────────────────────────────── */}
      <div style={S.row4}>
        <StatCard
          title="Total Revenue"
          value={fmt$(stats.totalRevenue)}
          subtitle={`${fmt$(curRev)} this month`}
          trend={revTrend}
          icon="💰"
          accent="#6366f1"
        />
        <StatCard
          title="Total Orders"
          value={fmtN(stats.totalOrders)}
          subtitle={`${curOrd} this month`}
          trend={ordTrend}
          icon="🛒"
          accent="#3b82f6"
        />
        <StatCard
          title="Customers"
          value={fmtN(userCount)}
          subtitle="Registered users"
          icon="👥"
          accent="#10b981"
        />
        <StatCard
          title="Active Orders"
          value={fmtN(activeOrders)}
          subtitle="Pending · Confirmed · Shipped"
          icon="⚡"
          accent="#f59e0b"
        />
      </div>

      {/* ── Middle Row ───────────────────────────────────────── */}
      <div style={S.row2mid}>
        {/* Channel Performance */}
        <div style={S.card}>
          <h3 style={S.cardTitle}>Order Status</h3>
          <p style={S.cardSub}>All-time breakdown</p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 18,
            }}
          >
            <DonutChart slices={donutSlices} size={110} />
            <div style={{ flex: 1 }}>
              {donutSlices.map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 7,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: s.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#475569" }}>
                      {s.label}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category mini bars */}
          {stats.categoryBreakdown.length > 0 && (
            <div
              style={{
                marginTop: 20,
                borderTop: "1px solid #f1f5f9",
                paddingTop: 16,
              }}
            >
              <p style={{ ...S.cardSub, marginBottom: 12 }}>
                Revenue by category
              </p>
              {stats.categoryBreakdown.map((c, i) => (
                <BarRow
                  key={c.model}
                  label={c.model || "Other"}
                  value={c.revenue}
                  maxValue={maxCatRev}
                  color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                  suffix="$"
                />
              ))}
            </div>
          )}
        </div>

        {/* Monthly Sales Line Chart */}
        <div style={S.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h3 style={S.cardTitle}>Monthly Sales</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <span
                  style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}
                >
                  {fmt$(stats.totalRevenue)}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: revTrend >= 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {revTrend >= 0 ? "▲" : "▼"} {Math.abs(revTrend).toFixed(1)}%
                </span>
              </div>
              <p style={{ ...S.cardSub, marginTop: 2 }}>
                Total revenue (non-cancelled)
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                color: "#94a3b8",
                background: "#f8fafc",
                padding: "4px 10px",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
              }}
            >
              Last 6 months
            </span>
          </div>

          <div style={{ height: 168, marginTop: 18 }}>
            <LineChart data={chartData} />
          </div>

          {/* Monthly summary pills */}
          <div
            style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}
          >
            {chartData.slice(-3).map((d, i) => (
              <div
                key={i}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "6px 12px",
                  flex: 1,
                  minWidth: 80,
                }}
              >
                <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>
                  {d.label}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {fmt$(d.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ───────────────────────────────────────── */}
      <div style={S.row3bot}>
        {/* Recent Orders */}
        <div style={S.card}>
          <h3 style={S.cardTitle}>Recent Orders</h3>
          <p style={S.cardSub}>Latest {stats.recentOrders.length} orders</p>

          <div style={{ marginTop: 14 }}>
            {stats.recentOrders.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 13 }}>No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order._id} style={S.orderRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      #{String(order._id).slice(-6).toUpperCase()}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 11,
                        color: "#94a3b8",
                      }}
                    >
                      {new Date(order.orderedDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p
                      style={{
                        margin: "0 0 3px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {fmt$(order.totalAmount)}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 7px",
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 600,
                        background:
                          (STATUS_COLORS[order.status] ?? "#94a3b8") + "20",
                        color: STATUS_COLORS[order.status] ?? "#94a3b8",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top 5 Products */}
        <div style={S.card}>
          <h3 style={S.cardTitle}>Top {stats.topProducts.length} Products</h3>
          <p style={S.cardSub}>By units sold</p>

          <div style={{ marginTop: 14 }}>
            {stats.topProducts.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                No product data yet
              </p>
            ) : (
              stats.topProducts.map((p, i) => (
                <BarRow
                  key={p.id || i}
                  label={
                    p.brand
                      ? `${p.brand} (${p.model})`
                      : p.model || `Product ${i + 1}`
                  }
                  value={p.quantity}
                  maxValue={maxProdQty}
                  color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                />
              ))
            )}
          </div>

          {stats.topProducts.length > 0 && (
            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: 14,
                marginTop: 6,
              }}
            >
              <p style={S.cardSub}>Revenue from top products</p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {fmt$(stats.topProducts.reduce((s, p) => s + p.revenue, 0))}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div style={S.card}>
          <h3 style={S.cardTitle}>Quick Stats</h3>
          <p style={S.cardSub}>Store summary</p>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              {
                label: "Total Orders",
                val: fmtN(stats.totalOrders),
                icon: "📦",
                accent: "#6366f1",
              },
              {
                label: "Active Orders",
                val: fmtN(activeOrders),
                icon: "⚡",
                accent: "#f59e0b",
              },
              {
                label: "Delivered",
                val: fmtN(stats.statusBreakdown.Delivered ?? 0),
                icon: "✅",
                accent: "#10b981",
              },
              {
                label: "Cancelled",
                val: fmtN(stats.statusBreakdown.Cancelled ?? 0),
                icon: "❌",
                accent: "#ef4444",
              },
              {
                label: "Avg. Order Value",
                val:
                  stats.totalOrders > 0
                    ? fmt$(stats.totalRevenue / stats.totalOrders)
                    : "$0",
                icon: "📊",
                accent: "#3b82f6",
              },
              {
                label: "Products Sold",
                val: fmtN(
                  stats.topProducts.reduce((s, p) => s + p.quantity, 0),
                ),
                icon: "🏷️",
                accent: "#8b5cf6",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "#f8fafc",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "#475569" }}>
                    {item.label}
                  </span>
                </div>
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: item.accent }}
                >
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const S = {
  page: {
    padding: "22px 24px",
    background: "#f8fafc",
    minHeight: "100%",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  row4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "18px",
  },
  row2mid: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "16px",
    marginBottom: "18px",
  },
  row3bot: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "20px 22px",
    boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
    border: "1px solid #f1f5f9",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 3px 0",
  },
  cardSub: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "0",
  },
  statCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "18px 20px",
    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
    border: "1px solid #f1f5f9",
  },
  statLabel: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 6px 0",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
    lineHeight: 1.1,
  },
  statSub: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "0",
  },
  statIconBox: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  orderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 0",
    borderBottom: "1px solid #f8fafc",
  },
};
