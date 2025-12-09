// ==============================
// ✅ RFID Attendance Server.js
// ==============================

const express = require("express");
const cors = require("cors");
const db = require("./db"); // database connection from db.js
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===================================
// 1️⃣ SIGNUP - New User Registration
// ===================================
app.post("/api/signup", (req, res) => {
  const { name, username, collegeId, password, role, rfidTag } = req.body;

  if (!name || !username || !collegeId || !password || !role) {
    return res.json({ success: false, message: "Missing required fields." });
  }

  // Check for duplicate username
  db.query("SELECT id FROM users WHERE username = ?", [username], (err, rows) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }
    if (rows.length > 0) {
      return res.json({ success: false, message: "Username already exists." });
    }

    // Insert new user
    const userSql = `
      INSERT INTO users (name, username, college_id, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(userSql, [name, username, collegeId, password, role], (err2, result) => {
      if (err2) {
        console.error("Insert User Error:", err2);
        return res.status(500).json({ success: false, message: "User creation failed." });
      }

      const userId = result.insertId;

      // Role-based entries
      if (role === "student") {
        const studentSql = `
          INSERT INTO students (name, enrollment_no, college_id, rfid_tag, user_id)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.query(studentSql, [name, username, collegeId, rfidTag || null, userId], (err3) => {
          if (err3) {
            console.error("Student Insert Error:", err3);
            return res.status(500).json({ success: false, message: "Student registration failed." });
          }
          res.json({ success: true, message: "Student registered successfully!" });
        });
      } else if (role === "teacher") {
        const teacherSql = `
          INSERT INTO teachers (name, faculty_id, college_id, user_id)
          VALUES (?, ?, ?, ?)
        `;
        db.query(teacherSql, [name, username, collegeId, userId], (err4) => {
          if (err4) {
            console.error("Teacher Insert Error:", err4);
            return res.status(500).json({ success: false, message: "Teacher registration failed." });
          }
          res.json({ success: true, message: "Teacher registered successfully!" });
        });
      } else {
        res.json({ success: false, message: "Invalid role provided." });
      }
    });
  });
});

// ===================================
// 2️⃣ LOGIN - Validate User Credentials
// ===================================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, rows) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }

    if (rows.length === 0)
      return res.json({ success: false, message: "Invalid credentials." });

    res.json({ success: true, user: rows[0] });
  });
});

// ===================================
// 3️⃣ RFID Attendance Scan API
// ===================================
app.post("/api/rfid", (req, res) => {
  const { rfidTag, deviceId } = req.body;
  if (!rfidTag) return res.json({ success: false, message: "Missing RFID Tag." });

  db.query("SELECT id FROM students WHERE rfid_tag=?", [rfidTag], (err, rows) => {
    if (err) {
      console.error("RFID Lookup Error:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }

    if (rows.length === 0)
      return res.json({ success: false, message: "Unknown RFID Tag." });

    const studentId = rows[0].id;

    db.query(
      "INSERT INTO attendance (student_id, device_id, status) VALUES (?, ?, 'P')",
      [studentId, deviceId || "RFID-READER"],
      (err2) => {
        if (err2) {
          console.error("Attendance Insert Error:", err2);
          return res.status(500).json({ success: false, message: "Insert failed." });
        }
        res.json({ success: true, message: "Attendance marked by RFID." });
      }
    );
  });
});

// ===================================
// 4️⃣ MANUAL Attendance Entry (Teacher/Admin)
// ===================================
app.post("/api/teacher/manual", (req, res) => {
  const { enrollment_no, status } = req.body;

  if (!enrollment_no || !status)
    return res.json({ success: false, message: "Missing enrollment number or status." });

  db.query("SELECT id FROM students WHERE enrollment_no = ?", [enrollment_no], (err, rows) => {
    if (err) {
      console.error("DB Lookup Error:", err);
      return res.status(500).json({ success: false, message: "Database lookup failed." });
    }

    if (rows.length === 0)
      return res.json({ success: false, message: "Student not found!" });

    const studentId = rows[0].id;

    db.query(
      "INSERT INTO attendance (student_id, status, device_id) VALUES (?, ?, 'MANUAL')",
      [studentId, status],
      (err2) => {
        if (err2) {
          console.error("Insert Error:", err2);
          return res.status(500).json({ success: false, message: "Attendance insert failed." });
        }
        res.json({ success: true, message: "✅ Attendance marked manually." });
      }
    );
  });
});

// ===================================
// 5️⃣ FETCH Attendance Records (Teacher/Admin)
// ===================================
app.get("/api/attendance", (req, res) => {
  const sql = `
    SELECT s.name, s.enrollment_no, a.timestamp, a.status
    FROM attendance a
    JOIN students s ON s.id = a.student_id
    ORDER BY a.timestamp DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(rows);
  });
});

// ===================================
// 6️⃣ FETCH Attendance for Logged-in Student
// ===================================
app.get("/api/student/attendance", (req, res) => {
  const { username } = req.query;
  const sql = `
    SELECT s.name, a.timestamp, a.status
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE u.username = ?
    ORDER BY a.timestamp DESC
  `;
  db.query(sql, [username], (err, rows) => {
    if (err) {
      console.error("Student Attendance Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(rows);
  });
});

// ===================================
// 🚀 START SERVER
// ===================================
app.listen(5000, () => {
  console.log("✅ MySQL Connected (via db.js)");
  console.log("🚀 Server running on http://localhost:5000");
});
