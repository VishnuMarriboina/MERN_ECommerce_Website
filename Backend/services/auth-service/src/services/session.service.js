const sessionRepository = require("../repositories/session.repository");

class SessionService {
  async createSession(userId, refreshToken, expiresAt) {
    return sessionRepository.create({ userId, refreshToken, expiresAt });
  }

  async revokeSession(refreshToken) {
    return sessionRepository.revokeByToken(refreshToken);
  }

  async revokeAllSessions(userId) {
    return sessionRepository.revokeAllByUser(userId);
  }
}

module.exports = new SessionService();
