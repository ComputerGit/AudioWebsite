const registerUser = require("../use-cases/registerUser");
const verifyEmail = require("../use-cases/verifyEmail");
const loginUser = require("../use-cases/loginUser");
const requestPasswordReset = require("../use-cases/requestPasswordReset");
const resetPassword = require("../use-cases/resetPassword");

exports.registerUser = async (req, res) => {
  try {
    const result = await registerUser(req.body);
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
