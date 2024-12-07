const menuToggle = document.getElementById("menu-toggle");
const navbarContent = document.querySelector(".navbar-info");

menuToggle.addEventListener("click", () => {
  navbarContent.classList.toggle("hidden");
});
