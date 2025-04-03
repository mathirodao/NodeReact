
const mongoose = require('mongoose');

class User {
  constructor(data) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password; 
    this.role = data.role || 'user';
    this.failedAttempts = data.failedAttempts || 0;
    this.status = data.status || { blocked: false };
    this.person = {
      name: data.name,
      sessions: data.sessions || [],
    };
  }
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  failedAttempts: { type: Number, default: 0 },
  status: { type: Object, default: { blocked: false } },
  person: {
    name: { type: String, required: true },
    sessions: [
      {
        sessionId: { type: String },
        loginTime: { type: Date },
        logoutTime: { type: Date },
      },
    ],
  },
}, { timestamps: true });

// Exportar directamente el modelo de Mongoose
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;