const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db/database');

// ✅ Secret key (same as in index.js)
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

// ================= Dashboard Route =================
router.get('/dashboard', authenticateToken, (req, res) => {
  const { id, role } = req.user;

  if (role === 'admin') {
    // ✅ For admin: show total employees + recent logins
    const totalQuery = `SELECT COUNT(*) AS totalEmployees FROM users WHERE role = 'employee'`;
    const recentQuery = `SELECT id, name, email, role, last_login 
                         FROM users ORDER BY last_login DESC LIMIT 5`;

    db.query(totalQuery, (err, totalResult) => {
      if (err) {
        console.error('❌ Error fetching total employees:', err);
        return res.status(500).json({ message: 'Database error (total employees)', error: err.message });
      }

      db.query(recentQuery, (err, recentResult) => {
        if (err) {
          console.error('❌ Error fetching recent logins:', err);
          return res.status(500).json({ message: 'Database error (recent logins)', error: err.message });
        }

        return res.json({
          role: 'admin',
          totalEmployees: totalResult[0].totalEmployees,
          recentLogins: recentResult,
          message: 'Welcome Admin',
        });
      });
    });
  } else if (role === 'employee') {
    // ✅ For employee: show their own profile
    db.query(
      `SELECT id, name, email, role, last_login FROM users WHERE id = ?`,
      [id],
      (err, rows) => {
        if (err) {
          console.error('❌ Error fetching user info:', err);
          return res.status(500).json({ message: 'Database error (user)', error: err.message });
        }
        if (!rows.length) return res.status(404).json({ message: 'User not found' });

        // 🔥 Main update: send flat object instead of nested "user"
        const user = rows[0];
        return res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          last_login: user.last_login,
          message: `Welcome ${user.name}`,
        });
      }
    );
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
});

module.exports = router;
