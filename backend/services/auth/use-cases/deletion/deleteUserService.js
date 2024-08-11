const User = require("../../models/authModel");

const deleteUserService = async (name) => {
  return await User.deleteOne({ name: name });
};

const deleteUsersService = async (users) => {
  return await User.deleteMany({ name: { $in: users } });
};

module.exports = { deleteUserService, deleteUsersService };
