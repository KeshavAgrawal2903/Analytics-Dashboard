const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const { rows } = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!rows[0]) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request object
    req.user = rows[0];
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Check admin role middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Refresh token middleware
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = generateToken(decoded.userId);

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [decoded.userId]
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// WebSocket authentication middleware
const authenticateWsConnection = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

module.exports = {
  authenticateToken,
  isAdmin,
  generateToken,
  refreshToken,
  authenticateWsConnection
};
