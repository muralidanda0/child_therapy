module.exports = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.currentYear = new Date().getFullYear();
  next();
};
