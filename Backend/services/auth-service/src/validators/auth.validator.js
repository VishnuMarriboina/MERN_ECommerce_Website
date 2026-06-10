const MESSAGES = require("../constants/auth.messages");

const signUpValidator = (body) => {
  const { name, email, phoneNumber, password, User_Role } = body;
  if (!name || !email || !phoneNumber || !password || !User_Role) return MESSAGES.AUTH.ALL_FIELDS_REQUIRED;
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format";
  return null;
};

const loginValidator = (body) => {
  const { email, password } = body;
  if (!email || !password) return MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED;
  return null;
};

const forgotPasswordValidator = (body) => {
  const { email, newPassword } = body;
  if (!email || !newPassword) return MESSAGES.USER.EMAIL_PASSWORD_REQUIRED;
  return null;
};

module.exports = { signUpValidator, loginValidator, forgotPasswordValidator };
