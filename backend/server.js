const express = require('express');
const cors = require('cors');
const pool = require('./db/database'); // connects to MySQL
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// ====================== LOGIN ENDPOINT ==========================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'mysecretkey', { expiresIn: '1h' });
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====================== START SERVER ==========================
app.listen(5000, () => console.log('✅ Server running on port 5000'));
