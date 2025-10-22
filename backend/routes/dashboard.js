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
  const { isoWeek } = req.query; // ✅ allow optional ?isoWeek=202543 filter

  if (role === 'admin') {
    // ✅ For admin: total employees + weekly logins + all users
    const totalQuery = `SELECT COUNT(*) AS totalEmployees FROM users WHERE role = 'employee'`;

    // ✅ Build dynamic recent logins query
    let recentQuery = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        MAX(h.login_time) AS last_login
      FROM login_history h
      JOIN users u ON u.id = h.user_id
    `;

    // 🗓️ Apply week filter if provided (example: isoWeek=202543)
    if (isoWeek) {
      recentQuery += ` WHERE YEARWEEK(h.login_time, 1) = ${db.escape(isoWeek)} `;
    }

    recentQuery += `
      GROUP BY u.id, u.name, u.email, u.role
      ORDER BY last_login DESC
      LIMIT 10;
    `;

    const allUsersQuery = `
      SELECT id, name, email, role, last_login 
      FROM users 
      ORDER BY id ASC
    `;

    // ================= Run Queries =================
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

        db.query(allUsersQuery, (err, allUsersResult) => {
          if (err) {
            console.error('❌ Error fetching all users:', err);
            return res.status(500).json({ message: 'Database error (all users)', error: err.message });
          }

          // ✅ Return combined dashboard data
          return res.json({
            role: 'admin',
            totalEmployees: totalResult[0].totalEmployees,
            recentLogins: recentResult,
            allUsers: allUsersResult,
            message: 'Welcome Admin',
          });
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
