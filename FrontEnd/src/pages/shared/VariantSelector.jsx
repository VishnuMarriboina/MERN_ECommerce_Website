import React from "react";
import { PS } from "./pageStyles";

export default function VariantSelector({ label, allOptions, availableOptions, selected, onSelect }) {
  const availableSet = new Set(availableOptions);
  if (!allOptions || allOptions.length === 0) return null;

  return (
    <div style={PS.variantRow}>
      <span style={PS.variantInlineLabel}>
        {label}
        {!selected && <span style={PS.requiredDot} />}
      </span>
      <div style={PS.variantBtnRow}>
        {allOptions.map((val) => {
          const isAvailable = availableSet.has(val);
          const isSelected = selected === val;
          return (
            <button
              key={val}
              className="ps-variant-btn"
              style={{
                ...PS.variantBtn,
                ...(isSelected ? PS.variantBtnSelected : {}),
                ...(!isAvailable ? PS.variantBtnDisabled : {}),
              }}
              onClick={() => isAvailable && onSelect(val)}
              disabled={!isAvailable}
              title={isSelected ? "Click to deselect" : val}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
}
