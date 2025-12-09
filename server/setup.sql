CREATE DATABASE IF NOT EXISTS rfid_attendance;
USE rfid_attendance;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  username VARCHAR(50) UNIQUE,
  college_id VARCHAR(50),
  password VARCHAR(100),
  role ENUM('admin','teacher','student') DEFAULT 'student'
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  enrollment_no VARCHAR(50) UNIQUE,
  college_id VARCHAR(50),
  rfid_tag VARCHAR(50),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  faculty_id VARCHAR(50) UNIQUE,
  college_id VARCHAR(50),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(10),
  device_id VARCHAR(50),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO users (name, username, password, role)
VALUES ('Administrator', 'admin', 'admin123', 'admin');
