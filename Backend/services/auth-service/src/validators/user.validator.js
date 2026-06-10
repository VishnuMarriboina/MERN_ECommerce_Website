const userIdValidator = (body) => {
  const { userId } = body;
  if (!userId) return "User ID is required";
  if (!/^[0-9a-fA-F]{24}$/.test(userId)) return "Invalid user ID format";
  return null;
};

module.exports = { userIdValidator };
