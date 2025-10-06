PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'employee')),
    last_login TEXT
);
INSERT INTO users VALUES(1,'Admin User','admin@example.com','hashed_password','admin','2025-10-02 12:00:00');
INSERT INTO sqlite_sequence VALUES('users',1);
COMMIT;
