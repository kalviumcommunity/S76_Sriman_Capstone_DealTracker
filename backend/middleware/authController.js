const jwt = require('jsonwebtoken');

console.log("JWT Secret in authController:", process.env.JWT_SECRET); 

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
