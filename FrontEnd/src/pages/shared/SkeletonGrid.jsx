import React from "react";
import { PS } from "./pageStyles";

const SkeletonCard = () => (
  <div style={PS.skeletonCard}>
    {/* Square image placeholder */}
    <div
      style={{ position: "relative", width: "100%", paddingBottom: "100%" }}
      className="ps-shimmer"
    />

    <div style={PS.skeletonBody}>
      {/* Brand + Price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
        <div style={{ ...PS.skeletonLine, flex: 1, height: "14px" }} className="ps-shimmer" />
        <div style={{ ...PS.skeletonLine, width: "56px", height: "22px", borderRadius: "7px" }} className="ps-shimmer" />
      </div>

      {/* Inline variant row 1 */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <div style={{ ...PS.skeletonLine, width: "28px", height: "8px" }} className="ps-shimmer" />
        <div style={{ display: "flex", gap: "4px" }}>
          {[28, 28, 34, 40].map((w, i) => (
            <div key={i} style={{ ...PS.skeletonLine, width: w, height: "22px", borderRadius: "20px" }} className="ps-shimmer" />
          ))}
        </div>
      </div>

      {/* Inline variant row 2 */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <div style={{ ...PS.skeletonLine, width: "36px", height: "8px" }} className="ps-shimmer" />
        <div style={{ display: "flex", gap: "4px" }}>
          {[46, 46, 52].map((w, i) => (
            <div key={i} style={{ ...PS.skeletonLine, width: w, height: "22px", borderRadius: "20px" }} className="ps-shimmer" />
          ))}
        </div>
      </div>

      {/* Spec line */}
      <div style={{ ...PS.skeletonLine, width: "75%", height: "10px" }} className="ps-shimmer" />

      {/* Button */}
      <div style={{ ...PS.skeletonLine, height: "38px", borderRadius: "9px" }} className="ps-shimmer" />
    </div>
  </div>
);

export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="ps-grid">
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
