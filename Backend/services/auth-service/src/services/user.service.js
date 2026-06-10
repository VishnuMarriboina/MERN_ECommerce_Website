const userRepository = require("../repositories/user.repository");
const userCache = require("../utils/userCache");
const AppError = require("@ecommerce/shared/src/exceptions/AppError");
const MESSAGES = require("../constants/auth.messages");
const STATUS = require("@ecommerce/shared/src/constants/statusCodes");

class UserService {
  async getAllUsers(loggedInUserId, loggedInUserRole) {
    if (loggedInUserRole !== "admin") throw new AppError(MESSAGES.AUTH.ACCESS_DENIED, STATUS.FORBIDDEN);
    return userRepository.findAll({
      $or: [{ _id: loggedInUserId }, { $expr: { $ne: [{ $toLower: "$User_Role" }, "admin"] } }],
    });
  }

  async updateProfile(userId, data) {
    const updatedUser = await userRepository.updateById(userId, data);
    if (!updatedUser) throw new AppError(MESSAGES.AUTH.USER_NOT_FOUND, STATUS.NOT_FOUND);

    // Invalidate cached profile — admin edits must be immediately visible
    userCache.invalidate(userId);
    return updatedUser;
  }
}

module.exports = new UserService();
