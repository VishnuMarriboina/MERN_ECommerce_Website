const User = require("../models/user.model");

class UserRepository {
  findAll(query = {}) { return User.find(query).select("-password"); }
  findById(id) { return User.findById(id).select("-password"); }
  findByEmail(email) { return User.findOne({ email }); }
  create(data) { return new User(data).save(); }
  updateById(id, data) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).select("-password");
  }
}

module.exports = new UserRepository();
