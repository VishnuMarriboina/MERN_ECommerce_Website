const userService = require("../services/user.service");
const { success } = require("@ecommerce/shared/src/utils/responseHandler");
const MESSAGES = require("../constants/auth.messages");

class ProfileController {
  updateProfile = async (req, res, next) => {
    try {
      const { name, age, gender, address, phoneNumber, profilePhoto } = req.body;
      const updateData = {};
      if (name) updateData.name = name;
      if (age) updateData.age = age;
      if (gender) updateData.gender = gender;
      if (address) updateData.address = address;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (profilePhoto) updateData.profilePhoto = profilePhoto;

      const updatedUser = await userService.updateProfile(req.user.userId, updateData);
      success(res, { user: updatedUser }, MESSAGES.USER.PROFILE_UPDATED);
    } catch (err) { next(err); }
  };
}

module.exports = new ProfileController();
