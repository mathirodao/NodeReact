
const User = require('../entities/User'); 
const { ObjectId } = require('mongodb');

class UserRepository {
  constructor() {
    this.UserModel = User; 
  }

  async createUser(userData) {
    try {
      return await this.UserModel.create(userData); 
    } catch (error) {
      console.error("Error al crear usuario en MongoDB:", error.message);
      throw error; 
    }
  }

  async findUser(query) {
    return await this.UserModel.findOne(query); 
  }

  async updateUser(query, updateData) {
    return await this.UserModel.updateOne(query, updateData); 
  }

  async generateUniqueEmail(firstName, lastName) {
    let baseEmail = `${firstName.toLowerCase()}${lastName.toLowerCase()}@mail.com`;
    let uniqueEmail = baseEmail;
    let counter = 1;


    while (true) {
      const existingUser = await this.UserModel.findOne({ email: uniqueEmail });
      if (!existingUser) break;

      uniqueEmail = `${firstName.toLowerCase()}${lastName.toLowerCase()}${counter}@mail.com`;
      counter++;
    }

    return uniqueEmail;
  }

  async addSession(userId, sessionId) {
    return await this.UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          'person.sessions': {
            sessionId,
            loginTime: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async findUserByActiveSession(userId) {
    try {
      const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;


      if (!objectId) {
        console.error("ID de usuario no válido:", userId);
        return null;
      }

      return await this.UserModel.findOne({
        _id: objectId,
        'person.sessions': {
          $elemMatch: { logoutTime: { $exists: false } },
        },
      });
    } catch (error) {
      console.error("Error en findUserByActiveSession:", error);
      return null;
    }
  }

  async updateSessionLogoutTime(sessionId) {
    return await this.UserModel.updateOne(
      { 'person.sessions.sessionId': sessionId },
      { $set: { 'person.sessions.$.logoutTime': new Date() } }
    );
  }

  async findUserById(id) {
    const objectId = ObjectId.isValid(id) ? id : null;
    if (!objectId) throw new Error("ID de usuario no válido");

    return await User.findById(objectId); 
  }

  async findUserBySessionId(sessionId) {
    return await this.UserModel.findOne({
      'person.sessions.sessionId': sessionId,
      'person.sessions.logoutTime': { $exists: false },
    });
  }
}

module.exports = new UserRepository();