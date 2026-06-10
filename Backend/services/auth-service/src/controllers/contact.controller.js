const contactService = require("../services/contact.service");
const { success } = require("@ecommerce/shared/src/utils/responseHandler");
const MESSAGES = require("../constants/auth.messages");

class ContactController {
  submit = async (req, res, next) => {
    try {
      const contact = await contactService.submit(req.body);
      success(res, contact, MESSAGES.CONTACT.SUBMITTED, 201);
    } catch (err) { next(err); }
  };

  getAll = async (req, res, next) => {
    try {
      const contacts = await contactService.getAll(req.user.User_Role);
      success(res, contacts, MESSAGES.CONTACT.FETCH_SUCCESS);
    } catch (err) { next(err); }
  };

  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await contactService.updateStatus(id, status, req.user.User_Role);
      success(res, updated, MESSAGES.CONTACT.STATUS_UPDATED);
    } catch (err) { next(err); }
  };
}

module.exports = new ContactController();
