import React from "react";
import { S } from "../../styles/productStyles";

export default function VariantSelector({
  label,
  allOptions,
  availableOptions,
  selected,
  onSelect,
}) {
  const availableSet = new Set(availableOptions);

  if (!allOptions || allOptions.length === 0) return null;

  return (
    <div style={S.selectorGroup}>
      <label style={S.selectorLabel}>
        {label}
        {!selected && <span style={S.requiredText}>*Required</span>}
      </label>
      <div style={S.optionButtons}>
        {allOptions.map((val) => {
          const isAvailable = availableSet.has(val);
          const isSelected = selected === val;

          return (
            <button
              key={val}
              style={{
                ...S.optionButton,
                ...(isSelected && S.optionButtonSelected),
                ...(!isAvailable && S.optionButtonDisabled),
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
