const express = require('express');
const db = require('../db/database');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/reports', authenticateToken, authorizeRoles('admin'), (req, res) => {
  db.all('SELECT name, role, last_login FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(rows);
  });
});

module.exports = router;
