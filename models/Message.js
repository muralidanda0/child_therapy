const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
