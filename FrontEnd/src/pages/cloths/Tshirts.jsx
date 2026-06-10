import React from "react";
import defaultTshirt from "../../assets/Tshirt.jpg";
import { useNavigate } from "react-router-dom";
import { PS } from "../shared/pageStyles";
import SkeletonGrid from "../shared/SkeletonGrid";
import { useProductsByCategory } from "../shared/useProductsByCategory";
import "../shared/product-pages.css";

export default function Tshirts() {
  const navigate = useNavigate();
  const { products: tshirtArray, loading, error } = useProductsByCategory("Tshirts");

  const ACCENT = "#8b5cf6";

  const Hero = () => (
    <header style={PS.hero}>
      <div style={PS.heroInner} className="ps-hero-inner">
        <nav style={PS.heroBreadcrumb}>
          <span style={PS.heroBreadcrumbLink} onClick={() => navigate("/")}>Home</span>
          <span style={PS.heroBreadcrumbSep}>›</span>
          <span>Clothing</span>
          <span style={PS.heroBreadcrumbSep}>›</span>
          <span style={{ color: "#94a3b8" }}>T-Shirts</span>
        </nav>
        <div style={PS.heroContent}>
          <div style={PS.heroLeft}>
            <div style={{ ...PS.heroIconWrap, background: ACCENT + "22", border: `1px solid ${ACCENT}44` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 5.5 7.5 3l4.5 3 4.5-3L21 5.5l-3.5 4.5-2.5-1.5V20H9V8.5L6.5 10z"/>
              </svg>
            </div>
            <div style={PS.heroTitleRow}>
              <h1 style={PS.heroTitle}>T-Shirt Collection</h1>
              <p style={PS.heroSubtitle}>Premium comfortable &amp; stylish t-shirts for everyday wear</p>
            </div>
          </div>
          {tshirtArray.length > 0 && (
            <div style={PS.heroCount}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, display: "inline-block" }} />
              {tshirtArray.length} {tshirtArray.length === 1 ? "Product" : "Products"}
            </div>
          )}
        </div>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div style={PS.page}>
        <Hero />
        <main style={PS.main} className="ps-main">
          <SkeletonGrid count={6} />
        </main>
      </div>
    );
  }

  if (error && tshirtArray.length === 0) {
    return (
      <div style={PS.page}>
        <Hero />
        <main style={PS.main} className="ps-main">
          <div style={PS.errorState}>
            <div style={PS.errorIconWrap}>⚠️</div>
            <h3 style={PS.errorTitle}>Failed to Load Products</h3>
            <p style={PS.errorText}>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={PS.page}>
      <Hero />
      <main style={PS.main} className="ps-main">
        {error && tshirtArray.length > 0 && (
          <div style={PS.warningBanner}>
            <strong>⚠️ Warning:</strong> {error}
          </div>
        )}

        {tshirtArray.length === 0 ? (
          <div style={PS.emptyState}>
            <div style={PS.emptyIconWrap}>👕</div>
            <h3 style={PS.emptyTitle}>No T-Shirts Available</h3>
            <p style={PS.emptyText}>Check back soon — new arrivals are on their way!</p>
          </div>
        ) : (
          <div className="ps-grid">
            {tshirtArray.map((product, index) => {
              const productId = product._id || product.id || index;

              return (
                <div
                  key={productId}
                  style={{ ...PS.card, cursor: "pointer" }}
                  className="ps-card-wrap"
                  onClick={() =>
                    navigate(`/product/${productId}`, {
                      state: { product, defaultImage: defaultTshirt, backPath: "/tshirts" },
                    })
                  }
                >
                  <div style={PS.imageContainer}>
                    <img
                      src={product.variants?.[0]?.image_url || defaultTshirt}
                      alt={product.brand || "T-Shirt"}
                      style={{ ...PS.image, objectFit: "contain", padding: "16px", backgroundColor: "#f8f9fa" }}
                      className="ps-card-img"
                      onError={(e) => { e.target.src = defaultTshirt; }}
                    />

                    {/* Top badges row */}
                    <div style={{
                      position: "absolute", top: 10, left: 10, right: 10,
                      display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2,
                    }}>
                      {product.variants?.[0]?.count < 5 && product.variants?.[0]?.count > 0 ? (
                        <span style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                          Low Stock
                        </span>
                      ) : product.variants?.[0]?.count === 0 ? (
                        <span style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                          Sold Out
                        </span>
                      ) : (
                        <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                          NEW
                        </span>
                      )}

                      <button
                        style={{ background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)", fontSize: 16, color: "#475569", padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${productId}`, { state: { product, defaultImage: defaultTshirt, backPath: "/tshirts" } });
                        }}
                      >
                        ⋮
                      </button>
                    </div>

                    {product.variants?.[0]?.count === 0 && (
                      <div style={PS.outOfStockOverlay}>
                        <span style={PS.outOfStockText}>Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div style={{ padding: "8px 10px 10px" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.brand || "Unknown Brand"}
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                        ₹{product.variants?.[0]?.cost || "N/A"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600, color: "#64748b" }}>
                        <span style={{ color: "#f59e0b" }}>★</span>
                        {product.rating || "4.5"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
