
const mongoose = require('mongoose');

let User;

try {
  User = mongoose.model('User');
} catch (error) {
  if (error.name === 'MissingSchemaError') {
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

    User = mongoose.model('User', userSchema);
  } else {
    throw error; 
  }
}

module.exports = User;