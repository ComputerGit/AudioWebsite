const User = require("../models/authModel");
const bcrypt = require("bcryptjs");

const resetPassword = async (token, password) => {
  let user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Password reset token is invalid or has expired");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return { msg: "Password has been reset" };
};

module.exports = resetPassword;
