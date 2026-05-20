document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = AuthService.login(
      document.getElementById("loginUsername").value.trim(),
      document.getElementById("loginPassword").value.trim()
    );
    showMessage("loginMessage", result);
    if (result.ok) {
      setTimeout(() => {
        window.location.href = result.user.role === "admin" ? "admin.html" : "plan.html";
      }, 500);
    }
  });

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = AuthService.register({
      username: document.getElementById("registerUsername").value.trim(),
      password: document.getElementById("registerPassword").value.trim(),
      phone: document.getElementById("registerPhone").value.trim(),
      homeAddress: document.getElementById("registerAddress").value.trim()
    });
    showMessage("registerMessage", result);
    if (result.ok) registerForm.reset();
  });
});

function showMessage(id, result) {
  const box = document.getElementById(id);
  box.textContent = result.message;
  box.className = `form-message ${result.ok ? "success" : "error"}`;
}

