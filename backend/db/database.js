const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',   // or your actual MySQL host
  user: 'root',        // your MySQL username
  password: 'wahiba@+123',        // your MySQL password
  database: 'small_platform', // use your DB name
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database!');
  }
});

module.exports = db;
