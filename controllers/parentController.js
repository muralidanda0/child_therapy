const bcrypt = require('bcrypt');
const User = require('../models/User');
const Child = require('../models/Child');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const SessionNote = require('../models/SessionNote');
const Therapist = require('../models/Therapist');

exports.getDashboard = async (req, res) => {
  try {
    const parentId = req.session.userId;
    const user = await User.findById(parentId);
    const children = await Child.find({ parentId });
    const now = new Date();

    const upcoming = await Appointment.find({
      parentId,
      dateTime: { $gte: now },
      status: { $ne: 'cancelled' }
    })
      .populate({ path: 'therapistId', populate: { path: 'userId', select: 'name' } })
      .sort({ dateTime: 1 });

    const past = await Appointment.find({
      parentId,
      $or: [{ dateTime: { $lt: now } }, { status: 'completed' }]
    })
      .populate({ path: 'therapistId', populate: { path: 'userId', select: 'name' } })
      .sort({ dateTime: -1 })
      .limit(20);

    const completedCount = await Appointment.countDocuments({ parentId, status: 'completed' });
    const unreadMessages = await Message.countDocuments({ toId: parentId, read: false });

    const messages = await Message.find({
      $or: [{ fromId: parentId }, { toId: parentId }]
    })
      .populate('fromId', 'name role')
      .populate('toId', 'name role')
      .sort({ createdAt: -1 })
      .limit(20);

    const sessionNotes = await SessionNote.find({
      sharedWithParent: true,
      isDraft: false
    }).populate({
      path: 'appointmentId',
      match: { parentId }
    });

    const visibleNotes = sessionNotes.filter(n => n.appointmentId);

    res.render('pages/parent-dashboard', {
      title: 'Parent Dashboard',
      user,
      children,
      upcoming,
      past,
      messages,
      sessionNotes: visibleNotes,
      stats: {
        upcoming: upcoming.length,
        completed: completedCount,
        children: children.length,
        unread: unreadMessages
      },
      section: req.query.section || 'home'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', { title: 'Error', message: 'Something went wrong.' });
  }
};

exports.addChild = async (req, res) => {
  try {
    const { name, dob, concern } = req.body;
    if (!name || !dob || !concern) {
      req.flash('error', 'Please fill in all child fields.');
      return res.redirect('/parent/dashboard?section=children');
    }

    await Child.create({
      parentId: req.session.userId,
      name,
      dob: new Date(dob),
      concern
    });

    req.flash('success', 'Child added successfully.');
    res.redirect('/parent/dashboard?section=children');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not add child.');
    res.redirect('/parent/dashboard?section=children');
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { toId, body } = req.body;
    if (!toId || !body) {
      req.flash('error', 'Message cannot be empty.');
      return res.redirect('/parent/dashboard?section=messages');
    }

    await Message.create({
      fromId: req.session.userId,
      toId,
      body
    });

    req.flash('success', 'Message sent.');
    res.redirect('/parent/dashboard?section=messages');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not send message.');
    res.redirect('/parent/dashboard?section=messages');
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { name, phone, emergencyContact, notifyEmail, notifySms, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.userId);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    user.notifyEmail = notifyEmail === 'on';
    user.notifySms = notifySms === 'on';

    if (newPassword && currentPassword) {
      const match = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!match) {
        req.flash('error', 'Current password is incorrect.');
        return res.redirect('/parent/dashboard?section=settings');
      }
      user.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    req.session.user.name = user.name;
    req.flash('success', 'Settings updated.');
    res.redirect('/parent/dashboard?section=settings');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update settings.');
    res.redirect('/parent/dashboard?section=settings');
  }
};
