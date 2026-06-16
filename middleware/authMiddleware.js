const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'Please sign in to continue.');
  res.redirect('/login');
};

const isParent = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'parent') {
    return next();
  }
  req.flash('error', 'This area is for parents only.');
  res.redirect('/login');
};

const isTherapist = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'therapist') {
    return next();
  }
  req.flash('error', 'This area is for therapists only.');
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    return next();
  }
  req.flash('error', 'Admin access required.');
  res.redirect('/login');
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    const role = req.session.role;
    if (role === 'parent') return res.redirect('/parent/dashboard');
    if (role === 'therapist') return res.redirect('/therapist/dashboard');
    return res.redirect('/');
  }
  next();
};

module.exports = { isAuthenticated, isParent, isTherapist, isAdmin, redirectIfAuthenticated };
