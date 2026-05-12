const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const loggedInUserRole = req.user.User_Role?.toLowerCase();

    if (loggedInUserRole !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const users = await User.find({
      $or: [
        { _id: loggedInUserId },
        { $expr: { $ne: [{ $toLower: "$User_Role" }, "admin"] } },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const signUpUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, User_Role } = req.body;

    if (!name || !email || !phoneNumber || !password || !User_Role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phoneNumber, password: hashedPassword, User_Role });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email, phoneNumber: newUser.phoneNumber, User_Role: newUser.User_Role },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, User_Role: user.User_Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email, User_Role: user.User_Role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, User_Role: user.User_Role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const refreshAccessToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token found" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email, User_Role: decoded.User_Role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ message: "Access token refreshed", accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, age, gender, address, phoneNumber, profilePhoto } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (age) updatedData.age = age;
    if (gender) updatedData.gender = gender;
    if (address) updatedData.address = address;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;
    if (profilePhoto) updatedData.profilePhoto = profilePhoto;

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true, runValidators: true }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found with this email" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
};

module.exports = { getAllUsers, signUpUser, loginUser, refreshAccessToken, updateUserProfile, forgotPassword };
