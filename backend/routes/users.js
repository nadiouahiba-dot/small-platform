// backend/routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../db/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
console.log("✅ users.js routes loaded successfully");

// ========================
// 🔐 Middleware: Auth check
// ========================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalid or expired" });
    req.user = user;
    next();
  });
}

// ======================================
// ✅ POST - Create new user (Admin only)
// ======================================
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "employee"],
      (err) => {
        if (err) {
          console.error("❌ Error inserting user:", err);
          return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.status(201).json({ message: "User created successfully" });
      }
    );
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ==================================================
// ✅ PUT - Change Password (Employee self-service)
// ==================================================
router.put("/change-password", authenticateToken, async (req, res) => {
  console.log("🟢 /change-password route was called!");
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(403).json({ message: "Invalid or expired token (no user id)" });
    }

    console.log("🔍 Fetching user from database with ID:", userId);

    // ✅ Check user existence and password
    db.query("SELECT password FROM users WHERE id = ?", [userId], async (err, results) => {
      if (err) {
        console.error("❌ Database SELECT error:", err);
        return res.status(500).json({ message: "Database error (SELECT)", error: err.message });
      }

      if (results.length === 0) {
        console.error("❌ User not found for ID:", userId);
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId], (err2) => {
        if (err2) {
          console.error("❌ Database UPDATE error:", err2);
          return res.status(500).json({ message: "Database error (UPDATE)", error: err2.message });
        }

        console.log("✅ Password updated successfully for user ID:", userId);
        res.json({ message: "Password updated successfully" });
      });
    });
  } catch (err) {
    console.error("💥 Unexpected error in /change-password:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// ======================================
// ✅ PUT - Update user (Admin only)
// ======================================
router.put("/:id", authenticateToken, (req, res) => {
  const { name, email, role } = req.body;
  db.query(
    "UPDATE users SET name=?, email=?, role=? WHERE id=?",
    [name, email, role, req.params.id],
    (err) => {
      if (err) {
        console.error("❌ Database UPDATE user error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// ======================================
// ✅ DELETE - Delete user (Admin only)
// ======================================
router.delete("/:id", authenticateToken, (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) {
      console.error("❌ Database DELETE error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;
