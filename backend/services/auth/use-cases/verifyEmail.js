const User = require("../models/authModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decoded.id);

  if (!user) {
    throw new Error("Invalid token");
  }

  user.isVerified = true;
  await user.save();

  return { msg: "Email Verified" };
};

module.exports = verifyEmail;
