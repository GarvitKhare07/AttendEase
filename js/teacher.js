async function loadAttendance() {
  const res = await fetch("http://localhost:5000/api/attendance");
  const data = await res.json();
  const table = document.getElementById("attTable");
  table.innerHTML = `
    <thead><tr><th>Student Name</th><th>Enrollment No</th><th>Time</th><th>Status</th></tr></thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  data.forEach((a) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${a.name}</td>
      <td>${a.enrollment_no || ""}</td>
      <td>${new Date(a.timestamp).toLocaleString()}</td>
      <td>${a.status}</td>`;
    tbody.appendChild(row);
  });
}

// ✅ Manual Attendance Submission
async function markManual() {
  const enrollment = document.getElementById("manualEnroll").value.trim();
  const status = document.getElementById("manualStatus").value;
  const msg = document.getElementById("manualMsg");

  if (!enrollment) {
    msg.textContent = "⚠️ Please enter an enrollment number.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/teacher/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollment_no: enrollment, status }),
    });

    const data = await res.json();

    if (data.success) {
      msg.textContent = "✅ Attendance updated successfully!";
      loadAttendance(); // refresh table
    } else {
      msg.textContent = "❌ " + (data.message || "Failed to update attendance.");
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "⚠️ Server connection error!";
  }
}


// Load attendance when page opens
window.onload = loadAttendance;
