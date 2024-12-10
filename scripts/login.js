const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

loginBtn.addEventListener("click", () => {
  loginBtn.style.backgroundColor = "#21264D";
  registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

  loginForm.style.left = "50%";
  registerForm.style.left = "-50%";

  loginForm.style.opacity = 1;
  registerForm.style.opacity = 0;
});

registerBtn.addEventListener("click", () => {
  loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  registerBtn.style.backgroundColor = "#21264D";

  loginForm.style.left = "150%";
  registerForm.style.left = "50%";

  loginForm.style.opacity = 0;
  registerForm.style.opacity = 1;
});

const logInputField = document.getElementById("logPassword");
const logInputIcon = document.getElementById("log-pass-icon");

const regInputField = document.getElementById("regPassword");
const regInputIcon = document.getElementById("reg-pass-icon");

function myLogPassword() {
  if (logInputField.type === "password") {
    logInputField.type = "text";
    logInputIcon.classList.remove("fa-lock");
    logInputIcon.classList.add("fa-eye");
    logInputIcon.style.cursor = "pointer";
  } else {
    logInputField.type = "password";
    logInputIcon.classList.remove("fa-eye");
    logInputIcon.classList.add("fa-lock");
    logInputIcon.style.cursor = "pointer";
  }
}

function myRegPassword() {
  if (regInputField.type === "password") {
    regInputField.type = "text";
    regInputIcon.classList.remove("fa-lock");
    regInputIcon.classList.add("fa-eye");
  } else {
    regInputField.type = "password";
    regInputIcon.classList.remove("fa-eye");
    regInputIcon.classList.add("fa-lock");
  }
}

function changeIcon(value) {
  if (value.length > 0) {
    logInputIcon.name = "eye-outline";
    regInputIcon.name = "eye-outline";
  } else {
    logInputIcon.name = "lock-closed-outline";
    regInputIcon.name = "lock-closed-outline";
  }
}
