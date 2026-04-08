const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const { id, displayName, emails, photos } = profile;
      const email = emails[0].value;
      const profilePicture = photos[0]?.value;

      // Try to find existing user
      let user = await User.findOne({
        where: {
          email: email
        }
      });

      if (user) {
        // Update existing user with Google ID if not already set
        if (!user.googleId) {
          await user.update({
            googleId: id,
            googleProfilePicture: profilePicture,
            authProvider: 'google'
          });
        }
      } else {
        // Create new user
        user = await User.create({
          name: displayName,
          email: email,
          googleId: id,
          googleProfilePicture: profilePicture,
          role: 'seeker',
          authProvider: 'google'
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = googleStrategy;
