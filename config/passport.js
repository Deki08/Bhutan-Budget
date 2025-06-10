const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel'); // use your model

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      console.log("🔐 Authenticating:", email);
      
      const user = await userModel.findByEmail(email);
      if (!user) {
        console.log("❌ No user found with email:", email);
        return done(null, false, { message: 'No user with that email' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("❌ Incorrect password for:", email);
        return done(null, false, { message: 'Password incorrect' });
      }

      console.log("✅ User authenticated:", email);
      return done(null, user);
    } catch (err) {
      console.error("🔥 Error in passport local strategy:", err);
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = initialize;
