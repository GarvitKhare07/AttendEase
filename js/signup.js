document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const collegeId = document.getElementById("collegeId").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  let rfidTag = document.getElementById("rfidTag").value.trim();

  if (!name || !username || !collegeId || !password) {
    alert("⚠️ Please fill all required fields!");
    return;
  }

  // Auto-generate RFID tag if left blank
  if (!rfidTag) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    rfidTag = random.match(/.{1,2}/g).join(":");
  }

  try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, collegeId, password, role, rfidTag }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Registration successful! You can now log in.");
      window.location.href = "index.html";
    } else {
      alert("❌ Signup failed: " + (data.message || "Please try again."));
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Cannot connect to the server. Make sure Node.js backend is running!");
  }
});
