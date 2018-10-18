const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(User.createStrategy());



passport.use(new GoogleStrategy({
    clientID: "864762085004-c18mona5nie3i1kagid5an1mcogjqufv.apps.googleusercontent.com",
    clientSecret: "hPFhEBcALzfuMP3aVC-JnIXE",
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }
  
      const newUser = new User({
        googleID: profile.id
      });
  
      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        done(null, newUser);
      });
    });
  
  }));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;