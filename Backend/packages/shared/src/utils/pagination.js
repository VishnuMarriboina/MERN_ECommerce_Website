const paginate = (query = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { query, skip, limit: Number(limit) };
};

const paginateResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / limit),
  },
});

module.exports = { paginate, paginateResponse };
