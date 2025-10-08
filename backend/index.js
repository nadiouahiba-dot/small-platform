const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db/database');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key'; // In production, store in environment variable

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
}

app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password, role, last_login) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, role, null],
      function (err) {
        if (err) {
          return res.status(500).json({ message: 'Registration failed', error: err.message });
        }
        return res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    db.run('UPDATE users SET last_login = datetime("now") WHERE id = ?', [user.id]);
    return res.json({ message: 'Login successful', token, role: user.role });
  });
});

app.get('/dashboard', authenticateToken, (req, res) => {
  const { id, role } = req.user;
  if (role === 'admin') {
    db.get('SELECT COUNT(*) AS totalEmployees FROM users WHERE role = ?', ['employee'], (err, total) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      db.all('SELECT name, email, role, last_login FROM users ORDER BY last_login DESC LIMIT 5', [], (err, recentLogins) => {
        if (err) return res.status(500).json({ message: 'DB error', error: err.message });
        return res.json({
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
      return res.json({
        role: 'employee',
        user,
        message: `Welcome ${user.name}`,
      });
    });
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
});

app.get('/reports', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  db.all('SELECT name, role, last_login FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching reports', error: err.message });
    return res.json(rows);
  });
});

app.get('/employees', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  db.all('SELECT id, name, email, role, last_login FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching employees', error: err.message });
    return res.json(rows);
  });
});

// ————— New endpoint: get user by ID —————
app.get('/users/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  if (req.user.role !== 'admin' && req.user.id !== Number(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  db.get(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    }
  );
});

// ————— New endpoint: update user —————
app.put('/users/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;
  if (req.user.role !== 'admin' && req.user.id !== Number(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  if (password) {
    try {
      const hashed = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(hashed);
    } catch (e) {
      return res.status(500).json({ message: 'Password hashing failed', error: e.message });
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  params.push(userId);
  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Update failed', error: err.message });
    }
    return res.json({ message: 'User updated successfully' });
  });
});

// Serve React static build
app.use(express.static(path.join(__dirname, 'frontend-react', 'build')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-react', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
