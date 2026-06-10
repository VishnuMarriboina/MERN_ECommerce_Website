import { useState } from "react";

export function useProductVariants() {
  const [selectedVariants, setSelectedVariants] = useState({});

  const getAttr = (variant, key) =>
    variant.attributes ? variant.attributes[key] : variant[key];

  const getUniqueValues = (variants, attribute) => {
    const values = variants?.map((v) => getAttr(v, attribute)).filter(
      (v) => v !== undefined && v !== null && typeof v !== "object"
    ) || [];
    return [...new Set(values)];
  };

  const getAvailableOptions = (product, attribute) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};
    let filteredVariants = product.variants || [];

    Object.keys(selections).forEach((key) => {
      if (key !== attribute && selections[key]) {
        filteredVariants = filteredVariants.filter(
          (v) => getAttr(v, key) === selections[key]
        );
      }
    });

    return getUniqueValues(filteredVariants, attribute);
  };

  const getMatchingVariant = (product) => {
    const productId = product._id || product.id;
    const selections = selectedVariants[productId] || {};

    if (!product.variants?.length || Object.keys(selections).length === 0)
      return null;

    return (
      product.variants.find((variant) =>
        Object.keys(selections).every(
          (key) => !selections[key] || getAttr(variant, key) === selections[key]
        )
      ) || null
    );
  };

  // product must be passed directly to avoid needing to search the full array
  const handleSelectionChange = (productId, attribute, value, product) => {
    setSelectedVariants((prev) => {
      const currentSelections = prev[productId] || {};
      const newValue = currentSelections[attribute] === value ? null : value;
      const newSelections = { ...currentSelections, [attribute]: newValue };

      Object.keys(newSelections).forEach((key) => {
        if (newSelections[key] === null) delete newSelections[key];
      });

      if (newValue === null) return { ...prev, [productId]: newSelections };

      const matchingVariant = product.variants?.find((variant) =>
        Object.keys(newSelections).every((key) => getAttr(variant, key) === newSelections[key])
      );

      if (!matchingVariant) {
        return { ...prev, [productId]: { [attribute]: value } };
      }

      return { ...prev, [productId]: newSelections };
    });
  };

  const getDisplayData = (product) => {
    const variant = getMatchingVariant(product);
    return { ...product, ...(variant || {}) };
  };

  const getSelections = (productId) => selectedVariants[productId] || {};

  const clearSelections = (productId) => {
    setSelectedVariants((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  return {
    selectedVariants,
    getUniqueValues,
    getAvailableOptions,
    getMatchingVariant,
    handleSelectionChange,
    getDisplayData,
    getSelections,
    clearSelections,
  };
}
