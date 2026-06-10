const authService = require("../services/auth.service");
const { success } = require("@ecommerce/shared/src/utils/responseHandler");
const { jwtConfig } = require("../config/jwt.config");
const MESSAGES = require("../constants/auth.messages");
const STATUS = require("@ecommerce/shared/src/constants/statusCodes");

class AuthController {
  signUp = async (req, res, next) => {
    try {
      const user = await authService.signUp(req.body);
      success(res, { user }, MESSAGES.AUTH.SIGNUP_SUCCESS, STATUS.CREATED);
    } catch (err) { next(err); }
  };

  login = async (req, res, next) => {
    try {
      const { accessToken, refreshToken, user } = await authService.login(req.body);
      res.cookie("refreshToken", refreshToken, jwtConfig.cookieOptions);
      success(res, { accessToken, user }, MESSAGES.AUTH.LOGIN_SUCCESS);
    } catch (err) { next(err); }
  };

  refreshAccessToken = async (req, res, next) => {
    try {
      const token = req.cookies.refreshToken;
      const accessToken = await authService.refreshToken(token);
      success(res, { accessToken }, MESSAGES.AUTH.TOKEN_REFRESHED);
    } catch (err) { next(err); }
  };

  forgotPassword = async (req, res, next) => {
    try {
      await authService.forgotPassword(req.body);
      success(res, null, MESSAGES.USER.PASSWORD_UPDATED);
    } catch (err) { next(err); }
  };
}

module.exports = new AuthController();
