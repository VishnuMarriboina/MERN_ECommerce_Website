const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const isNonEmpty = (val) => val !== undefined && val !== null && val !== "";
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

module.exports = { isValidEmail, isNonEmpty, isValidObjectId };
