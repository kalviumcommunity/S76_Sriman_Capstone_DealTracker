const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("Authorization Header:", authHeader); 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("❌ No valid token provided");
    return res.status(401).json({ message: 'Access denied. No token provided or incorrect format.' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Extracted Token:", token); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Decoded User:", decoded);
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
  
};

module.exports = authMiddleware;
