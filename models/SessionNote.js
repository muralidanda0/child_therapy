const mongoose = require('mongoose');

const sessionNoteSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
  childName: { type: String, required: true },
  sessionDate: { type: Date, required: true },
  duration: { type: Number, default: 45 },
  goals: [{ type: String }],
  observations: { type: String, default: '' },
  nextPlan: { type: String, default: '' },
  sharedWithParent: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SessionNote', sessionNoteSchema);
