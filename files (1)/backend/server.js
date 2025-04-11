require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const User = require('./models/user');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Routes
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);

// Home Page (Login)
app.get('/', (req, res) => {
  res.render('index');
});

// Dashboard
app.get('/dashboard', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  try {
    const user = await User.findById(req.user.id);
    res.render('dashboard', { user, error: null });
  } catch (err) {
    console.error(err);
    res.render('dashboard', { user: null, error: 'Failed to load user data' });
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));