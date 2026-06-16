const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNo: { type: String, required: true },
  specialties: [{ type: String }],
  yearsExperience: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  title: { type: String, default: 'Licensed Therapist' },
  photoUrl: { type: String, default: '' },
  availability: {
    type: Map,
    of: [String],
    default: {}
  }
});

therapistSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

therapistSchema.set('toJSON', { virtuals: true });
therapistSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Therapist', therapistSchema);
