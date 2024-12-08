// const coll = document.getElementsByClassName("collapsible");

// coll.forEach((collapsible) => {
//   collapsible.addEventListener("click", () => {
//     collapsible.classList.toggle("active");
//   });
// });

const collapsibles = document.querySelectorAll(".collapsible");

collapsibles.forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null; // Close the section
    } else {
      content.style.maxHeight = content.scrollHeight + "px"; // Open the section
    }
  });
});
