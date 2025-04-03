const mongoose = require('mongoose');
const userSchema = require('./entities/User');
const UserRepository = require('./repositories/userRepository');
const UserService = require('./services/userService');
const UserController = require('./controllers/userController');

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

module.exports = {
  UserModel,
  userRepository,
  userService,
  userController
};