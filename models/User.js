const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['parent', 'therapist', 'admin'], required: true },
  phone: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  notifyEmail: { type: Boolean, default: true },
  notifySms: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
