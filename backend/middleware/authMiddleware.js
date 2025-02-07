const jwt = require('jsonwebtoken');

console.log("JWT Secret in authMiddleware:", process.env.JWT_SECRET); 

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided or incorrect format.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User:", decoded); 
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); 
    res.status(400).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;
