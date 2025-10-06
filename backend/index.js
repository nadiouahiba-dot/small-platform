const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db/database');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key'; // Should be stored in .env in production

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};

// Register
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password, role, last_login) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, null],
      function (err) {
        if (err) {
          return res.status(500).json({ message: 'Registration failed', error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    // Update last login time
    db.run('UPDATE users SET last_login = datetime("now") WHERE id = ?', [user.id]);

    res.json({ message: 'Login successful', token, role: user.role });
  });
});

// Dashboard Route
app.get('/dashboard', authenticateToken, (req, res) => {
  const { id, role } = req.user;

  if (role === 'admin') {
    db.get('SELECT COUNT(*) as totalEmployees FROM users WHERE role = ?', ['employee'], (err, total) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });

      db.all('SELECT name, email, role, last_login FROM users ORDER BY last_login DESC LIMIT 5', [], (err, recentLogins) => {
        if (err) return res.status(500).json({ message: 'DB error', error: err.message });

        res.json({
          role: 'admin',
          totalEmployees: total.totalEmployees,
          recentLogins,
          message: 'Welcome Admin',
        });
      });
    });
  } else if (role === 'employee') {
    db.get('SELECT name, email, role FROM users WHERE id = ?', [id], (err, user) => {
      if (err || !user) return res.status(500).json({ message: 'User not found' });

      res.json({
        role: 'employee',
        user,
        message: `Welcome ${user.name}`,
      });
    });
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
});

// Reports route
app.get('/reports', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  db.all('SELECT name, role, last_login FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching reports', error: err.message });
    res.json(rows);
  });
});

// Employees route
app.get('/employees', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  db.all('SELECT id, name, email, role, last_login FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching employees', error: err.message });
    res.json(rows);
  });
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
