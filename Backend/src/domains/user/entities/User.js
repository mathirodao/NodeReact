const mongoose = require('mongoose');

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

module.exports = userSchema;