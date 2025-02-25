const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log("🔐 Generating Token for User ID:", user._id);
  }
  
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
