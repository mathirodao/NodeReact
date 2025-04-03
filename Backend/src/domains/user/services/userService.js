const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    return await userRepository.findAllUsers();
  }

  async getUserById(id) {
    return await userRepository.findUserById(id);
  }

  async updateUser(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10); 
    }

    return await userRepository.updateUser({ _id: id }, data);
  }

  async uploadUsersFromExcel(usersData) {
    return await userRepository.uploadUsersFromExcel(usersData);
  }

  async filterUsers(filters) {
    return await userRepository.filterUsers(filters);
  }
}

module.exports = new UserService();