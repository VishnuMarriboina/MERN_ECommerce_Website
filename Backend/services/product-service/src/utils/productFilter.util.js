const buildFilter = ({ brand, minPrice, maxPrice, userId, role } = {}) => {
  const filter = {};
  if (role === "admin" && userId) filter.addedBy = userId;
  if (brand) filter.brand = new RegExp(brand, "i");
  return filter;
};

module.exports = { buildFilter };
