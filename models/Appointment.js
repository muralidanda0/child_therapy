const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
  childName: { type: String, required: true },
  childDOB: { type: Date },
  concern: { type: String, required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateTime: { type: Date, required: true },
  type: { type: String, default: 'consultation' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String, default: '' },
  parentInfo: {
    name: String,
    email: String,
    phone: String,
    insurance: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
