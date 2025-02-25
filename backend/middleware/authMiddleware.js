const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("❌ No valid token provided");
    }
    return res.status(401).json({ message: 'Access denied. No token provided or incorrect format.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (process.env.NODE_ENV !== 'production') {
      console.log("✅ Decoded User:", decoded);
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("❌ JWT verification failed:", error.message);
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
