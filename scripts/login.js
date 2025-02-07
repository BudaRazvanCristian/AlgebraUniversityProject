document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("#login");
  const registerBtn = document.querySelector("#register");
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");

  // Schimbă stilul butoanelor Login/Register
  loginBtn?.addEventListener("click", () => {
    loginBtn.style.backgroundColor = "#21264D";
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";
    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
  });

  registerBtn?.addEventListener("click", () => {
    loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    registerBtn.style.backgroundColor = "#21264D";
    loginForm.style.left = "150%";
    registerForm.style.left = "50%";
    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;
  });

  // Funcția pentru afișare/ascundere parolă
  function togglePasswordVisibility(inputId, iconId) {
    const inputField = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (inputField.type === "password") {
      inputField.type = "text";
      icon.classList.remove("fa-lock");
      icon.classList.add("fa-eye");
    } else {
      inputField.type = "password";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-lock");
    }
  }

  // Eveniment pentru login
  loginForm?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document
      .querySelector(".login-form input[name='username']")
      .value.trim();
    const password = document.getElementById("logPassword").value.trim();

    try {
      const response = await fetch(
        "https://www.fulek.com/data/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert(`Login failed: ${data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  });

  // Eveniment pentru înregistrare
  registerForm?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document
      .querySelector(".register-form input[name='username']")
      .value.trim();
    const email = document
      .querySelector(".register-form input[name='email']")
      .value.trim();
    const password = document.getElementById("regPassword").value.trim();

    try {
      const response = await fetch(
        "https://www.fulek.com/data/api/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();
      console.log("Register response:", data);

      if (response.ok) {
        alert("Registration successful! You can now log in.");
      } else {
        alert(
          `Registration failed: ${data.message || "Error during registration"}`
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred while registering. Please try again.");
    }
  });
});
