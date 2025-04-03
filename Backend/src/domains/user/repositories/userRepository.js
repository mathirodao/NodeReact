
const User = require('../entities/User');
const { ObjectId } = require('mongodb');

class UserRepository {
  async findUser(query) {
    return await User.findOne(query);
  }

  async findAllUsers() {
    return await User.find({});
  }

  async findUserById(id) {
    console.log('findUserById de userRepository', id);
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
    console.log('objectId', objectId);
    if (!objectId) {
      throw new Error("ID de usuario no válido");
    }
    return await User.findById(objectId); 
  }


  async updateUser(filter, update) {
    return await User.updateOne(filter, update);
  }

  async addSession(userId, sessionId) {
    return await User.findByIdAndUpdate(
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

  async updateSessionLogoutTime(sessionId) {
    return await User.updateOne(
      { 'person.sessions.sessionId': sessionId },
      { $set: { 'person.sessions.$.logoutTime': new Date() } }
    );
  }

  async findUserByActiveSession(sessionId) {
    return await User.findOne({
      'person.sessions.sessionId': sessionId,
      'person.sessions.logoutTime': { $exists: false },
    });
  }

  async uploadUsersFromExcel(usersData) {
    try {
      const users = usersData.map((userData) => ({
        username: userData.username,
        email: userData.email,
        password: userData.password, 
        role: userData.role || 'user',
        failedAttempts: 0,
        status: { blocked: false },
        person: {
          name: userData.name,
          sessions: [],
        },
      }));

      return await User.insertMany(users);
    } catch (error) {
      throw new Error("Error al cargar usuarios desde Excel");
    }
  }

  async filterUsers(filters) {
    const query = {};
    if (filters.name) query['person.name'] = { $regex: filters.name, $options: 'i' };
    if (filters.email) query.email = { $regex: filters.email, $options: 'i' };
    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;

    return await User.find(query);
  }

  async findUserBySessionId(sessionId) {
    return await User.findOne({
      'person.sessions.sessionId': sessionId,
      'person.sessions.logoutTime': { $exists: false },
    });
  }
}

module.exports = new UserRepository();