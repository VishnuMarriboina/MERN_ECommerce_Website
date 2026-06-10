const genericProductValidator = (body) => {
  const { category, name, brand, variants } = body;
  if (!category || !name || !brand) return "category, name, and brand are required";
  if (!Array.isArray(variants) || variants.length === 0) return "At least one variant must be provided";
  for (const v of variants) {
    if (v.cost === undefined || v.count === undefined) return "Each variant must have cost and count";
    if (typeof v.cost !== "number" || typeof v.count !== "number") return "cost and count must be numbers";
    if (v.cost < 0 || v.count < 0) return "cost and count must be non-negative";
  }
  return null;
};

module.exports = { genericProductValidator };
