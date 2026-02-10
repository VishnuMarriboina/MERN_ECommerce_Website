const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
  User_Role: {
    type: String,
    required: [true, "User role is required"],
    enum: {
      values: ["Admin", "User"],
      message: "User role must be Admin or User",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },

  resetOTP: String,
  resetOTPExpires: Date,

  // ✅ Optional Fields
  age: { type: Number, required: false },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
  address: { type: String, required: false },
  profilePhoto: { type: String, required: false }, // URL
});

// ✅ Pre-save middleware to ensure +91 prefix is always added
/**
 * ✅ Pre-validate middleware:
 * - Accepts any phone number format
 * - Removes spaces, symbols, country codes, etc.
 * - Always stores as +91XXXXXXXXXX
 */
userSchema.pre("validate", function (next) {
  if (this.phoneNumber) {
    // Remove all non-digit characters
    let digits = this.phoneNumber.replace(/\D/g, "");

    // Remove leading country codes like 91, 091, 0091, +91 etc.
    digits = digits.replace(/^(\+?0{0,2}91)/, "");

    // Must be 10 digits after cleaning
    if (digits.length !== 10) {
      return next(
        new Error("Invalid Indian phone number. Must contain 10 digits.")
      );
    }

    // Convert to +91XXXXXXXXXX
    this.phoneNumber = `+91${digits}`;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
