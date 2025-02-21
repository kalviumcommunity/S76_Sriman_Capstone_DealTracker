const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // ✅ Generate a JWT Token
      const token = jwt.sign(
        { id: profile.id, email: profile.emails[0].value },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return done(null, { profile, token });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));