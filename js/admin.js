async function loadAttendance(){
  const res = await fetch('http://localhost:5000/api/attendance');
  const rows = await res.json();
  const tbody = document.querySelector('#logsTable tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.name}</td><td>${r.enrollment_no||''}</td><td>${new Date(r.timestamp).toLocaleString()}</td><td>${r.status}</td>`;
    tbody.appendChild(tr);
  });
}

async function addStudent(){
  const name = document.getElementById('sName').value.trim();
  const enrollment = document.getElementById('sEnroll').value.trim();
  const rfid = document.getElementById('sRFID').value.trim();
  const msg = document.getElementById('addStudentMsg');
  if(!name || !enrollment){ msg.textContent='Name and Enrollment are required'; return; }
  const res = await fetch('http://localhost:5000/api/admin/add-student',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, enrollment_no: enrollment, rfid_tag: rfid })
  });
  const data = await res.json();
  msg.textContent = data.success ? 'Student added' : (data.message||'Error');
  if(data.success){ document.getElementById('sName').value=''; document.getElementById('sEnroll').value=''; document.getElementById('sRFID').value=''; }
}

window.onload = loadAttendance;
