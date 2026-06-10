const Contact = require("../models/contact.model");

class ContactRepository {
  create(data) {
    return new Contact(data).save();
  }
  findAll() {
    return Contact.find().sort({ createdAt: -1 });
  }
  findById(id) {
    return Contact.findById(id);
  }
  updateStatus(id, status) {
    return Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }
}

module.exports = new ContactRepository();
