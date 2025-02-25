const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  console.log("Generating Token for User:", user);
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
