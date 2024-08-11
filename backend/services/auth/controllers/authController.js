const registerUser = require("../use-cases/registerUser");
const verifyEmail = require("../use-cases/verifyEmail");
const loginUser = require("../use-cases/loginUser");
const requestPasswordReset = require("../use-cases/requestPasswordReset");
const resetPassword = require("../use-cases/resetPassword");
const {
  deleteUserService,
  deleteUsersService,
} = require("../use-cases/deletion/deleteUserService");
const { toDTO } = require("../mapper/User_Register_Mapper");

exports.registerUser = async (req, res) => {
  try {
    const userDTO = toDTO(req.body);
    const result = await registerUser(userDTO);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error at Register User");
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const result = await verifyEmail(req.query.token);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const result = await requestPasswordReset(req.body.email);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const result = await resetPassword(req.body.token, req.body.password);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await deleteUserService(name);

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "User NOT FOUND" });
    }

    res.json({ msg: "User deleted Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteManyUsers = async (req, res) => {
  try {
    const { users } = req.body;
    const result = await deleteUsersService(users);

    if (result.deletedCount === 0) {
      res.status(404).json({ msg: "No Users Found" });
    }
    res
      .status(200)
      .json({
        result,
        msg: `${result.deletedCount} Deleted ALL users Sucessfully`,
      });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
};
