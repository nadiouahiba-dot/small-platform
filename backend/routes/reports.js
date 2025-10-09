const express = require('express');
const router = express.Router();
const db = require('../db/database'); // keep this path if correct
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key';

// ================= Middleware =================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid or expired' });
    req.user = user;
    next();
  });
}

// ================= Reports Route =================
router.get('/', authenticateToken, (req, res) => {
  // Restrict access to admins
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  const query = 'SELECT id, name, email, role, last_login FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ message: 'Error fetching reports', error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
