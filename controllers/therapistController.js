const bcrypt = require('bcrypt');
const User = require('../models/User');
const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');
const SessionNote = require('../models/SessionNote');
const Message = require('../models/Message');
const Child = require('../models/Child');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const therapist = await Therapist.findOne({ userId: req.session.userId });

    if (!therapist) {
      req.flash('error', 'Therapist profile not found.');
      return res.redirect('/');
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySessions = await Appointment.find({
      therapistId: therapist._id,
      dateTime: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: 'cancelled' }
    }).sort({ dateTime: 1 });

    const allSessions = await Appointment.find({
      therapistId: therapist._id,
      status: { $ne: 'cancelled' }
    }).sort({ dateTime: -1 });

    const parentIds = [...new Set(allSessions.map(s => s.parentId.toString()))];
    const children = await Child.find({ parentId: { $in: parentIds } });

    const messages = await Message.find({
      $or: [{ fromId: req.session.userId }, { toId: req.session.userId }]
    })
      .populate('fromId', 'name role')
      .populate('toId', 'name role')
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadMessages = await Message.countDocuments({
      toId: req.session.userId,
      read: false
    });

    const availabilityObj = therapist.availability
      ? Object.fromEntries(therapist.availability)
      : {};

    res.render('pages/therapist-dashboard', {
      title: 'Therapist Dashboard',
      user,
      therapist,
      todaySessions,
      allSessions,
      children,
      messages,
      availability: availabilityObj,
      unreadMessages,
      section: req.query.section || 'schedule',
      activeAppointmentId: req.query.appointment || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', { title: 'Error', message: 'Something went wrong.' });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({ userId: req.session.userId });
    const sessions = await Appointment.find({ therapistId: therapist._id })
      .sort({ dateTime: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

exports.saveSessionNote = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({ userId: req.session.userId });
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      therapistId: therapist._id
    });

    if (!appointment) {
      req.flash('error', 'Session not found.');
      return res.redirect('/therapist/dashboard?section=notes');
    }

    const goals = req.body.goals
      ? (Array.isArray(req.body.goals) ? req.body.goals : [req.body.goals])
      : [];

    const noteData = {
      appointmentId: appointment._id,
      therapistId: therapist._id,
      childName: appointment.childName,
      sessionDate: appointment.dateTime,
      duration: parseInt(req.body.duration, 10) || 45,
      goals,
      observations: req.body.observations || '',
      nextPlan: req.body.nextPlan || '',
      sharedWithParent: req.body.sharedWithParent === 'on',
      isDraft: req.body.action === 'draft'
    };

    let note = await SessionNote.findOne({ appointmentId: appointment._id });
    if (note) {
      Object.assign(note, noteData);
      await note.save();
    } else {
      note = await SessionNote.create(noteData);
    }

    if (req.body.action === 'finalize') {
      appointment.status = 'completed';
      await appointment.save();
    }

    req.flash('success', note.isDraft ? 'Draft saved.' : 'Session note finalized.');
    res.redirect('/therapist/dashboard?section=notes');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not save session note.');
    res.redirect('/therapist/dashboard?section=notes');
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({ userId: req.session.userId });
    const slots = req.body.slots || {};

    const availabilityMap = new Map();
    Object.entries(slots).forEach(([day, hours]) => {
      availabilityMap.set(day, Array.isArray(hours) ? hours : [hours]);
    });

    therapist.availability = availabilityMap;
    await therapist.save();

    req.flash('success', 'Availability updated.');
    res.redirect('/therapist/dashboard?section=availability');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update availability.');
    res.redirect('/therapist/dashboard?section=availability');
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { toId, body } = req.body;
    if (!toId || !body) {
      req.flash('error', 'Message cannot be empty.');
      return res.redirect('/therapist/dashboard?section=messages');
    }

    await Message.create({ fromId: req.session.userId, toId, body });
    req.flash('success', 'Message sent.');
    res.redirect('/therapist/dashboard?section=messages');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not send message.');
    res.redirect('/therapist/dashboard?section=messages');
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { name, bio, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.userId);
    const therapist = await Therapist.findOne({ userId: req.session.userId });

    if (name) user.name = name;
    if (bio !== undefined && therapist) therapist.bio = bio;

    if (newPassword && currentPassword) {
      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) {
        req.flash('error', 'Current password is incorrect.');
        return res.redirect('/therapist/dashboard?section=settings');
      }
      user.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    if (therapist) await therapist.save();
    req.session.user.name = user.name;

    req.flash('success', 'Settings updated.');
    res.redirect('/therapist/dashboard?section=settings');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update settings.');
    res.redirect('/therapist/dashboard?section=settings');
  }
};
