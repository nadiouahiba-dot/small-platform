// backend/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your-secret-key';

// ========================
// 🔐 Middleware: Auth check
// ========================
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

// ======================================
// ✅ POST - Create new user (Admin only)
// ======================================
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'employee'],
      (err) => {
        if (err) {
          console.error('❌ Error inserting user:', err);
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ message: 'User created successfully' });
      }
    );
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// ======================================
// ✅ PUT - Update user (Admin only)
// ======================================
router.put('/:id', authenticateToken, (req, res) => {
  const { name, email, role } = req.body;
  db.query(
    'UPDATE users SET name=?, email=?, role=? WHERE id=?',
    [name, email, role, req.params.id],
    (err) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err.message });
      res.json({ message: 'User updated successfully' });
    }
  );
});

// ======================================
// ✅ DELETE - Delete user (Admin only)
// ======================================
router.delete('/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM users WHERE id=?', [req.params.id], (err) => {
    if (err)
      return res.status(500).json({ message: 'Database error', error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
});

// ==================================================
// ✅ PUT - Change Password (Employee self-service)
// ==================================================
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Identify user from JWT
    const userId = req.user.id;

    // 1️⃣ Retrieve user from database
    db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: 'User not found' });

      const user = results[0];

      // 2️⃣ Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Incorrect current password' });

      // 3️⃣ Hash and update new password
      const hashed = await bcrypt.hash(newPassword, 10);
      db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId], (err2) => {
        if (err2)
          return res
            .status(500)
            .json({ message: 'Database error', error: err2.message });
        res.json({ message: 'Password updated successfully' });
      });
    });
  } catch (err) {
    console.error('❌ Error changing password:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;
