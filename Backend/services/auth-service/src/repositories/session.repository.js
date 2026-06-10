const Session = require("../models/session.model");

class SessionRepository {
  create(data) { return Session.create(data); }
  findByToken(refreshToken) { return Session.findOne({ refreshToken, isRevoked: false }); }
  revokeByToken(refreshToken) { return Session.updateOne({ refreshToken }, { isRevoked: true }); }
  revokeAllByUser(userId) { return Session.updateMany({ userId }, { isRevoked: true }); }
}

module.exports = new SessionRepository();
