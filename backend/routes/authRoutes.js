const express = require("express");
const User = require("../models/UserModel");
const passport = require("passport");

const router = express.Router();

// Google Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`http://localhost:5173/auth-success?token=${req.user.token}`);
  }
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
