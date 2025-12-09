document.getElementById('loginBtn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const res = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem('loggedInUser', JSON.stringify(data.user));
    const role = data.user.role;
    if (role === 'admin') window.location.href = 'admin.html';
    else if (role === 'teacher') window.location.href = 'teacher.html';
    else window.location.href = 'student.html';
  } else {
    alert(data.message || 'Invalid credentials');
  }
});
