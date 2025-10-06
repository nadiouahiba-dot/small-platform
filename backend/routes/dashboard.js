const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware'); // We'll add this middleware to verify JWT

const router = express.Router();

// GET /api/dashboard
router.get('/', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole === 'admin') {
    // For admin: get total employees and recent logins
    db.all('SELECT id, name, email, role, last_login FROM users', (err, users) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      const totalEmployees = users.filter(u => u.role === 'employee').length;
      const recentLogins = users
        .filter(u => u.last_login)
        .sort((a, b) => new Date(b.last_login) - new Date(a.last_login))
        .slice(0, 5); // last 5 logins

      res.json({
        totalEmployees,
        recentLogins,
      });
    });
  } else if (userRole === 'employee') {
    // For employee: show personal info
    db.get('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        welcomeMessage: `Welcome back, ${user.name}!`
      });
    });
  } else {
    res.status(403).json({ message: 'Unauthorized role' });
  }
});

module.exports = router;
