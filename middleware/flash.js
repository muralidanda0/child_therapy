module.exports = (req, res, next) => {
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  delete req.session.success;
  delete req.session.error;

  req.flash = (type, message) => {
    req.session[type] = message;
  };

  next();
};
