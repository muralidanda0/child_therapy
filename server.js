require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');
const flashMiddleware = require('./middleware/flash');
const localsMiddleware = require('./middleware/locals');

const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const parentRoutes = require('./routes/parentRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const contactRoutes = require('./routes/contactRoutes');

connectDB();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(flashMiddleware);
app.use(localsMiddleware);

app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/parent', parentRoutes);
app.use('/therapist', therapistRoutes);
app.use('/sessions', sessionRoutes);
app.use('/contact', contactRoutes);

app.get('/book', (req, res) => res.redirect('/appointments/new'));

app.use((req, res) => {
  res.status(404).render('pages/error', { title: 'Page Not Found', message: 'The page you requested does not exist.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', { title: 'Server Error', message: 'Something went wrong on our end.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Little Hearts Therapy Center running at http://localhost:${PORT}`);
});
