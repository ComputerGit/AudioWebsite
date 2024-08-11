// user_Register_DTO.js
class UserRegisterDTO {
  constructor(user) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role; // This will be set only when needed, e.g., for admin management
    this.isVerified = user.isVerified;
  }
}

module.exports = UserRegisterDTO;
