const contactRepository = require("../repositories/contact.repository");
const AppError = require("@ecommerce/shared/src/exceptions/AppError");
const MESSAGES = require("../constants/auth.messages");
const STATUS = require("@ecommerce/shared/src/constants/statusCodes");

class ContactService {
  async submit(data) {
    const { name, email, topic, message } = data;
    if (!name || !email || !topic || !message) {
      throw new AppError(MESSAGES.CONTACT.ALL_FIELDS_REQUIRED, STATUS.BAD_REQUEST);
    }
    return contactRepository.create({ name, email, topic, message });
  }

  async getAll(userRole) {
    if (userRole?.toLowerCase() !== "admin") {
      throw new AppError(MESSAGES.AUTH.ACCESS_DENIED, STATUS.FORBIDDEN);
    }
    return contactRepository.findAll();
  }

  async updateStatus(id, status, userRole) {
    if (userRole?.toLowerCase() !== "admin") {
      throw new AppError(MESSAGES.AUTH.ACCESS_DENIED, STATUS.FORBIDDEN);
    }
    const valid = ["New", "Read", "Resolved"];
    if (!valid.includes(status)) {
      throw new AppError(MESSAGES.CONTACT.INVALID_STATUS, STATUS.BAD_REQUEST);
    }
    const updated = await contactRepository.updateStatus(id, status);
    if (!updated) throw new AppError(MESSAGES.CONTACT.NOT_FOUND, STATUS.NOT_FOUND);
    return updated;
  }
}

module.exports = new ContactService();
