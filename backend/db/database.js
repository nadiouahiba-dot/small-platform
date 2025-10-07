const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'new_database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'employee')),
        last_login TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table ready.');

        // admin 
        const bcrypt = require('bcrypt');
        const defaultAdminEmail = 'admin@example.com';
        const defaultEmployeeEmail = 'employee@example.com';

        db.get(`SELECT * FROM users WHERE email = ?`, [defaultAdminEmail], async (err, row) => {
          if (!row) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.run(
              `INSERT INTO users (name, email, password, role, last_login) VALUES (?, ?, ?, ?, ?)`,
              ['Admin User', defaultAdminEmail, hashedPassword, 'admin', null],
              (err) => {
                if (err) console.error('Error inserting admin:', err.message);
                else console.log('Default admin user created.');
              }
            );
          }
        });

        //  employee 
        db.get(`SELECT * FROM users WHERE email = ?`, [defaultEmployeeEmail], async (err, row) => {
          if (!row) {
            const hashedPassword = await bcrypt.hash('employee123', 10);
            db.run(
              `INSERT INTO users (name, email, password, role, last_login) VALUES (?, ?, ?, ?, ?)`,
              ['Employee User', defaultEmployeeEmail, hashedPassword, 'employee', null],
              (err) => {
                if (err) console.error('Error inserting employee:', err.message);
                else console.log('Default employee user created.');
              }
            );
          }
        });
      }
    });
  }
});

module.exports = db;
