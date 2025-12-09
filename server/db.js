const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // default for XAMPP
  database: 'rfid_attendance'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected (XAMPP)');
});

module.exports = db;
