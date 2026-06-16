const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');
const Child = require('../models/Child');

exports.getBooking = async (req, res) => {
  try {
    const therapists = await Therapist.find().populate('userId', 'name email');
    res.render('pages/booking', { title: 'Book an Appointment', therapists, success: false });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', { title: 'Error', message: 'Something went wrong.' });
  }
};

exports.postNewAppointment = async (req, res) => {
  try {
    const {
      childName, childDOB, concern, additionalNotes,
      therapistId, dateTime, parentName, parentEmail, parentPhone, insurance
    } = req.body;

    if (!childName || !concern || !therapistId || !dateTime) {
      req.flash('error', 'Please complete all required fields.');
      return res.redirect('/appointments/new');
    }

    const appointment = await Appointment.create({
      childName,
      childDOB: childDOB ? new Date(childDOB) : null,
      concern,
      notes: additionalNotes || '',
      therapistId,
      parentId: req.session.userId,
      dateTime: new Date(dateTime),
      type: concern,
      status: 'pending',
      parentInfo: {
        name: parentName || req.session.user.name,
        email: parentEmail || req.session.user.email,
        phone: parentPhone || '',
        insurance: insurance || ''
      }
    });

    const therapists = await Therapist.find().populate('userId', 'name email');
    const therapist = await Therapist.findById(therapistId).populate('userId', 'name');

    res.render('pages/booking', {
      title: 'Booking Confirmed',
      therapists,
      success: true,
      appointment,
      therapist
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not create appointment. Please try again.');
    res.redirect('/appointments/new');
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      parentId: req.session.userId
    });

    if (!appointment) {
      req.flash('error', 'Appointment not found.');
      return res.redirect('/parent/dashboard');
    }

    appointment.status = 'cancelled';
    await appointment.save();
    req.flash('success', 'Appointment cancelled.');
    res.redirect('/parent/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not cancel appointment.');
    res.redirect('/parent/dashboard');
  }
};
