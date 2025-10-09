const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();
const JWT_SECRET = 'your-secret-key'; // You can also load this from process.env

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password, role, last_login) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, null],
        (err, result) => {
          if (err) {
            console.error('❌ Error inserting user:', err);
            return res.status(500).json({ message: 'Registration failed', error: err.message });
          }
          console.log('✅ New user registered:', email);
          return res.status(201).json({ message: 'User registered successfully' });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
});

// ================= LOGIN =================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  // Fetch user from MySQL
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = results[0];

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    // Update last login
    db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      role: user.role,
    });
  });
});

module.exports = router;
