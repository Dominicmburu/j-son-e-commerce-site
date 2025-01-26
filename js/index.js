function toggleForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  loginForm.classList.toggle("active");
  registerForm.classList.toggle("active");
}


const API_URL = 'http://localhost:3500';

let currentUser = null;

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/users`)
    .then((response) => response.json())
    .then((users) => {
      const user = users.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        currentUser = user;
        localStorage.setItem("userId", user.id);
        if (user.role === "admin") {
          loadAdminPage();
        } else {
          loadUserPage();
        }
      } else {
        alert("Invalid credentials");
      }
    });
}
