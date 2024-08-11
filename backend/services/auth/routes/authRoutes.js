const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  registerUser,
  verifyEmail,
  loginUser,
  requestPasswordReset,
  resetPassword,
  deleteUser,
  deleteManyUsers,
} = require("../controllers/authController");
const {
  deleteAllUsersService,
} = require("../use-cases/deletion/deleteUserService");

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  registerUser
);

router.get("/verify-email", verifyEmail);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

router.post(
  "/request-password-reset",
  [check("email", "Please include a valid email").isEmail()],
  requestPasswordReset
);

router.post(
  "/reset-password",
  [
    check("token", "Token is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  resetPassword
);

module.exports = router;

router.delete(
  "/delete-user",
  [
    check("name", "User name is required").not().isEmpty(), // Validate name
  ],
  deleteUser
);

module.exports = router;

router.delete(
  "/delete-all",
  [check("name", "A list of Users Names is Required ").isArray().notEmpty()],
  deleteManyUsers
);

module.exports = router;
