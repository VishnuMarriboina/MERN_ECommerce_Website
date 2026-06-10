const userRepository = require("../repositories/user.repository");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token.util");
const AppError = require("@ecommerce/shared/src/exceptions/AppError");
const MESSAGES = require("../constants/auth.messages");
const STATUS = require("@ecommerce/shared/src/constants/statusCodes");

class AuthService {
  async signUp({ name, email, phoneNumber, password, User_Role }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new AppError(MESSAGES.AUTH.USER_EXISTS, STATUS.BAD_REQUEST);

    const hashedPassword = await hashPassword(password);
    const newUser = await userRepository.create({ name, email, phoneNumber, password: hashedPassword, User_Role });
    return { name: newUser.name, email: newUser.email, phoneNumber: newUser.phoneNumber, User_Role: newUser.User_Role };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, STATUS.NOT_FOUND);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS.BAD_REQUEST);

    const payload = { userId: user._id, email: user.email, User_Role: user.User_Role };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
      user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, User_Role: user.User_Role },
    };
  }

  async refreshToken(token) {
    if (!token) throw new AppError(MESSAGES.AUTH.NO_TOKEN, STATUS.UNAUTHORIZED);
    const decoded = verifyRefreshToken(token);
    return generateAccessToken({ userId: decoded.userId, email: decoded.email, User_Role: decoded.User_Role });
  }

  async forgotPassword({ email, newPassword }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, STATUS.NOT_FOUND);
    user.password = await hashPassword(newPassword);
    await user.save();
  }
}

module.exports = new AuthService();
