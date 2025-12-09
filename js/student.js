const user = JSON.parse(localStorage.getItem('loggedInUser'));
document.getElementById('studentName').textContent = user?.name || user?.username || 'Student';

async function loadMyAttendance(){
  const res = await fetch('http://localhost:5000/api/student/attendance?username=' + encodeURIComponent(user.username));
  const rows = await res.json();
  const tbody = document.querySelector('#attendanceTable tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${new Date(r.timestamp).toLocaleString()}</td><td>${r.status}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('rfidTag').textContent = rows[0]?.rfid_tag || '—';
}

loadMyAttendance();
