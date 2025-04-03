// const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async getAllUsers() {
    try {
      const users = await this.userRepository.findAllUsers();
      return users;
    } catch (error) {
      console.error("Error en el servicio al obtener todos los usuarios:", error);
      throw error;
    }
  }

  async getUserById(id) {
    return await this.userRepository.findUserById(id);
  }

  async updateUser(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10); 
    }

    return await this.userRepository.updateUser({ _id: id }, data);
  }

  async uploadUsersFromExcel(usersData) {
    return await this.userRepository.uploadUsersFromExcel(usersData);
  }

  async filterUsers(filters) {
    return await this.userRepository.filterUsers(filters);
  }
}

module.exports = UserService;