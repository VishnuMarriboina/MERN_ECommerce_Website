const profileUpdateValidator = (body) => {
  const { age, gender, phoneNumber } = body;
  if (age !== undefined && (isNaN(age) || age < 0 || age > 120)) return "Invalid age";
  if (gender && !["Male", "Female", "Other"].includes(gender)) return "Invalid gender";
  return null;
};

module.exports = { profileUpdateValidator };
