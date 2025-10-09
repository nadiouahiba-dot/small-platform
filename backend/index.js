const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db/database');

// Import route files
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Secret key (store in .env for production)
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

// ================= API Routes =================
app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/reports', reportsRoutes);

// ================= Default Route =================
app.get('/', (req, res) => {
  res.json({ message: '✅ API is running successfully.' });
});

// ================= Start Server =================
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
