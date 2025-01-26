function toggleForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  loginForm.classList.toggle("active");
  registerForm.classList.toggle("active");
}

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  const usersResponse = await fetch("http://localhost:3500/users");
  const users = await usersResponse.json();
  
  const adminResponse = await fetch("http://localhost:3500/admin");
  const admins = await adminResponse.json();

  const managerResponse = await fetch("http://localhost:3500/manager");
  const managers = await managerResponse.json();

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  const admin = admins.find(
    (admin) => admin.email === email && admin.password === password
  );

  const manager = managers.find(
    (manager) => manager.email === email && manager.password === password
  );

  if (user) {
    alert("Login successful!");
    localStorage.setItem("user", JSON.stringify(user));

    window.location.href = "index.html";
  } else if (admin) {
    alert("Admin login successful!");
    localStorage.setItem("user", JSON.stringify(admin));

    window.location.href = "admin.html";
  }
  else if (manager) {
    alert("Manager login successful!");
    localStorage.setItem("user", JSON.stringify(admin));

    window.location.href = "manager.html";
  } 
  else {
    alert("Invalid credentials!");
  }
});

const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  const newUser = { name, email, password };

  const response = await fetch("http://localhost:3500/users");
  const users = await response.json();

  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    alert("User already exists!");
  } else {
    await fetch("http://localhost:3500/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    alert("Registration successful!");

    toggleForms();
  }
});

function checkUserLoggedIn() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    window.location.href = "index.html"; 
  }
}

checkUserLoggedIn();
