const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/jwt.config");

const generateAccessToken = (payload) => jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.accessExpiry });
const generateRefreshToken = (payload) => jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiry });
const verifyAccessToken = (token) => jwt.verify(token, jwtConfig.secret);
const verifyRefreshToken = (token) => jwt.verify(token, jwtConfig.refreshSecret);

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
