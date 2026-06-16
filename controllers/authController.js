const bcrypt = require('bcrypt');
const User = require('../models/User');
const Therapist = require('../models/Therapist');

exports.getLogin = (req, res) => {
  res.render('pages/login', { title: 'Sign In' });
};

exports.getRegister = (req, res) => {
  res.render('pages/register', { title: 'Create Account' });
};

exports.postRegister = async (req, res) => {
  try {
    const {
      name, email, password, confirmPassword, role,
      phone, emergencyContact, licenseNo, specialties, yearsExperience
    } = req.body;

    if (!name || !email || !password || !role) {
      req.flash('error', 'Please fill in all required fields.');
      return res.redirect('/register');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/register');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/register');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      phone: phone || '',
      emergencyContact: emergencyContact || ''
    });

    if (role === 'therapist') {
      const specList = specialties
        ? (Array.isArray(specialties) ? specialties : [specialties])
        : [];
      await Therapist.create({
        userId: user._id,
        licenseNo: licenseNo || 'PENDING',
        specialties: specList,
        yearsExperience: parseInt(yearsExperience, 10) || 0,
        bio: ''
      });
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };

    req.flash('success', 'Welcome! Your account has been created.');
    if (role === 'parent') return res.redirect('/parent/dashboard');
    if (role === 'therapist') return res.redirect('/therapist/dashboard');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Please enter your email and password.');
      return res.redirect('/login');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };

    const returnTo = req.session.returnTo || null;
    delete req.session.returnTo;

    if (returnTo) return res.redirect(returnTo);
    if (user.role === 'parent') return res.redirect('/parent/dashboard');
    if (user.role === 'therapist') return res.redirect('/therapist/dashboard');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Login failed. Please try again.');
    res.redirect('/login');
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
