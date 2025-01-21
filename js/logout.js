function logoutUser() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
  
  const logoutButton = document.querySelector(".logout");
  
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
  