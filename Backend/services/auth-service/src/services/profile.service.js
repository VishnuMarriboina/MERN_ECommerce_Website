const userRepository = require("../repositories/user.repository");
const userCache = require("../utils/userCache");
const AppError = require("@ecommerce/shared/src/exceptions/AppError");
const MESSAGES = require("../constants/auth.messages");
const STATUS = require("@ecommerce/shared/src/constants/statusCodes");

class ProfileService {
  async getProfile(userId) {
    const cached = userCache.get(userId);
    if (cached) return cached;

    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, STATUS.NOT_FOUND);

    userCache.set(userId, user);
    return user;
  }

  async updateProfile(userId, data) {
    const updatedUser = await userRepository.updateById(userId, data);
    if (!updatedUser) throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, STATUS.NOT_FOUND);

    // Invalidate so the next getProfile reads fresh data from DB
    userCache.invalidate(userId);
    return updatedUser;
  }
}

module.exports = new ProfileService();
