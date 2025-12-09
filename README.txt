# RFID Attendance (HTML + Node + MySQL)

## Quick Start
1) Import SQL
```
cd server
mysql -u root -p < setup.sql
```
2) Install & run backend
```
npm init -y
npm install express mysql2 cors
node server.js
```
3) Open `index.html` in your browser.

## Dummy Logins
- Admin: admin / admin123
- Teacher: teacher1 / teach123
- Student: student1 / stud123

RFID device can POST to `http://<PC-IP>:5000/api/rfid` with JSON: `{ "rfidTag":"A1:B2:C3", "deviceId":"room101" }`.
