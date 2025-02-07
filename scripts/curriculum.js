// Verifică dacă utilizatorul este logat
let token = localStorage.getItem("token");

if (!token) {
  alert("You need to log in first!");
  window.location.href = "login.html";
}

// Lista de cursuri selectate
let selectedCourses = [];

// Funcția pentru căutarea cursurilor
async function searchCourses(query) {
  try {
    const response = await fetch(
      `https://www.fulek.com/data/api/supit/curriculum-list/en?q=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Eroare API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Cursuri primite:", data);

    return data.data || [];
  } catch (error) {
    console.error("Eroare la obținerea cursurilor:", error);
    return [];
  }
}

// Funcția pentru adăugarea unui curs selectat
function addCourse(course) {
  if (!selectedCourses.find((c) => c.id === course.id)) {
    selectedCourses.push(course);
    updateTotals();
    displaySelectedCourses();
  }
}

// Funcția pentru eliminarea unui curs selectat
function removeCourse(courseId) {
  selectedCourses = selectedCourses.filter((course) => course.id !== courseId);
  updateTotals();
  displaySelectedCourses();
}

// Funcția pentru actualizarea totalurilor ECTS și ore
function updateTotals() {
  let totalEcts = selectedCourses.reduce((sum, course) => sum + course.ects, 0);
  let totalHours = selectedCourses.reduce(
    (sum, course) => sum + course.sati,
    0
  );

  document.getElementById("total-ects").innerText = `Total ECTS: ${totalEcts}`;
  document.getElementById(
    "total-hours"
  ).innerText = `Total Hours: ${totalHours}`;
}

// Funcția pentru afișarea cursurilor selectate
function displaySelectedCourses() {
  const selectedCoursesContainer = document.getElementById("selected-courses");
  selectedCoursesContainer.innerHTML = ""; // Resetează lista existentă

  selectedCourses.forEach((course) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.course}</td>
      <td>${course.ects}</td>
      <td>${course.sati}</td>
      <td><button onclick="removeCourse(${course.id})">Remove</button></td>
    `;
    selectedCoursesContainer.appendChild(row);
  });
}

// Eveniment pentru căutarea cursurilor
document
  .getElementById("course-search")
  ?.addEventListener("input", async (e) => {
    const query = e.target.value;

    if (!query) {
      document.getElementById("course-list").innerHTML = "";
      return;
    }

    const courses = await searchCourses(query);
    const courseList = document.getElementById("course-list");
    courseList.innerHTML = ""; // Resetează lista existentă

    courses.forEach((course) => {
      const li = document.createElement("li");
      li.textContent = `${course.course} - ${course.ects} ECTS`;
      li.addEventListener("click", () => {
        addCourse(course);
      });
      courseList.appendChild(li);
    });
  });
