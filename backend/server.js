require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/database');
const productRoutes = require('./routes/productRoutes');
const apiRoutes = require('./routes/apiRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const session = require("express-session");
const User = require("./models/UserModel");
const passport = require("passport");
require("./auth/googleAuth"); 
const jwt = require("jsonwebtoken");
const path = require('path');

const app = express();
app.use("/api/auth", require("./routes/authRoutes"))
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", 
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const { emails } = req.user.profile;
      const email = emails[0].value;

      // Check if user already exists
      let user = await User.findOne({ email });

      if (!user) {
        // Store email in session to be used in the next request
        req.session.tempEmail = email;

        // Redirect to frontend to ask for a username
        return res.redirect(`http://localhost:5173/enter-username?email=${email}`);
      }

      // Generate JWT token for existing user
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
      );

      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.redirect("/");
    }
  }
);

app.post("/api/auth/google-register", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and Name are required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // If user exists, generate a new token and send it to the frontend
      const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({ token }); 
    }

    // If user doesn't exist, create new user
    user = new User({ name, email, isGoogleUser: true });
    await user.save();

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Google Register Error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

app.get("/api/user/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: decoded.id, name: decoded.name, email: decoded.email });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api', apiRoutes);
app.use('/api', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to DealTracker - Your AI-Powered Price Comparison App!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
