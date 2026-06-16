const User = require('../models/User');
const Therapist = require('../models/Therapist');

exports.getHome = async (req, res) => {
  try {
    res.render('pages/index', { title: 'Little Hearts Therapy Center' });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', { title: 'Error', message: 'Something went wrong.' });
  }
};

exports.getServices = async (req, res) => {
  try {
    const therapists = await Therapist.find().populate('userId', 'name email');
    res.render('pages/services', { title: 'Our Services', therapists });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', { title: 'Error', message: 'Something went wrong.' });
  }
};

exports.getAbout = async (req, res) => {
  try {
    const therapists = await Therapist.find().populate('userId', 'name email');
    res.render('pages/about', { title: 'About Us', therapists });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/error', { title: 'Error', message: 'Something went wrong.' });
  }
};

exports.getContact = (req, res) => {
  res.render('pages/contact', { title: 'Contact Us' });
};
