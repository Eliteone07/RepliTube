const passport = require('passport');
const { OAuth2Strategy } = require('passport-google-oauth');
const User = require('../models/user');

// Passport Configuration
passport.use(new OAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        accessToken,
        refreshToken,
        profilePicture: profile.photos[0].value
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Login Route
exports.login = passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.upload'] });

// Callback Route
exports.callback = passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: '/dashboard'
});