const userService = require("../services/user.service");
const { success } = require("@ecommerce/shared/src/utils/responseHandler");
const MESSAGES = require("../constants/auth.messages");

class AdminUserController {
  getAllUsers = async (req, res, next) => {
    try {
      const { userId, User_Role } = req.user;
      const users = await userService.getAllUsers(userId, User_Role?.toLowerCase());
      success(res, users, MESSAGES.USER.FETCH_SUCCESS);
    } catch (err) { next(err); }
  };
}

module.exports = new AdminUserController();
