document.addEventListener("DOMContentLoaded", () => {//processes to be executed after the page is loaded
    const token = localStorage.getItem("token");//get the token from the local storage
    const loginLink = document.getElementById("loginLink");//get the login link element

    //If there is a token (= logged in), change the link to "Logout"
    if (token && loginLink) {
        loginLink.textContent = "Logout";
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token");
            alert("You have been logged out.");
            window.location.href = "login.html";
        });
    }

    //Initialize the Lightbox plugin
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });
});

// Processing of login form submissions.
document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("https://www.fulek.com/data/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("Login response:", data); // Logging the response

        if (response.ok && data.data?.token) { // Retrieve tokens from data.data
            localStorage.setItem("token", data.data.token); // Save JWT tokens.
            alert("Login successful!");
            window.location.href = "curriculum.html"; // Go to curriculum page
        } else {
            alert(`Login failed: ${data.message || "Invalid credentials"}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while logging in. Please try again.");
    }
});

// Submission process for registration forms.
document.getElementById("registerForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!username || !password || !confirmPassword) {
        alert("All fields must be filled.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch("https://www.fulek.com/data/api/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.isSuccess) {
            alert("Registration successful! Please log in.");
            window.location.href = "login.html"; // Go to the login page
        } else {
            alert(`Registration failed: ${data.errorMessages.join(", ")}`);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An unexpected error occurred. Please try again later.");
    }
});

let selectedCourses = [];
let totalECTS = 0;
let originalCourses = [];

// Obtaining curriculum data
async function fetchCurriculum() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to view the curriculum.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://www.fulek.com/data/api/supit/curriculum-list/en", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        if (response.ok) {
            originalCourses = data.data;
            displayCourses(originalCourses);
        } else {
            throw new Error("Failed to fetch curriculum");
        }
    } catch (error) {
        console.error("Error fetching curriculum:", error);
        alert("Failed to load curriculum data.");
    }
}

// View courses in list format.
function displayCourses(courses) {
    const curriculumContainer = document.getElementById("curriculumContainer");
    curriculumContainer.innerHTML = "";

    courses.forEach(course => {
        const courseElement = document.createElement("div");
        courseElement.className = "course";
        courseElement.setAttribute("data-id", course.id);
        courseElement.innerHTML = `
            <p><strong>${course.course}</strong></p>
            <button onclick="addCourse(${course.id}, '${course.course}', ${course.ects}); event.stopPropagation();">+</button>
        `;
        
        curriculumContainer.appendChild(courseElement);
    });

     // Correctly set up click events.
     document.querySelectorAll('#curriculumContainer .course').forEach(item => {
        item.addEventListener('click', function() {
            const courseId = this.getAttribute('data-id');
            showCourseDetails(courseId);
        });
    });
}

// Course search function
function applyFilters() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const semester = document.getElementById("semesterFilter").value;
    const type = document.getElementById("typeFilter").value;

    const filteredCourses = originalCourses.filter(course => {
        return (
            (!query || course.course.toLowerCase().includes(query)) &&
            (!semester || course.semester == semester) &&
            (!type || course.type === type)
        );
    });

    displayCourses(filteredCourses);
}



// Add course to selection list
function addCourse(courseId) {
    const course = originalCourses.find(c => c.id === courseId);
    if (!selectedCourses.find(c => c.id === courseId)) {
        selectedCourses.push(course);
        totalECTS += parseInt(course.ects);
        updateSelectedCourses();
    }
}

// Ability to view and delete selected courses.
function updateSelectedCourses() {
    const container = document.getElementById("selectedCoursesContainer");
    container.innerHTML = "";

    selectedCourses.forEach(course => {
        const courseElement = document.createElement("div");
        courseElement.className = "course";
        courseElement.innerHTML = `
            <span>${course.course}</span>
            <button class="remove-btn" onclick="removeCourse(${course.id})">-</button>
        `;
        container.appendChild(courseElement);
    });

    document.getElementById("totalECTS").innerText = `Total ECTS: ${totalECTS}`;
}

// Course deletion
function removeCourse(courseId) {
    selectedCourses = selectedCourses.filter(course => course.id !== courseId);
    totalECTS = selectedCourses.reduce((sum, course) => sum + parseInt(course.ects), 0);
    updateSelectedCourses();
}

// full reset function
document.getElementById("resetCourses").addEventListener("click", () => {
    selectedCourses = [];
    totalECTS = 0;
    updateSelectedCourses();
});

// Display of detailed information on individual courses (modal).
// Showing/hiding the modal is managed by Bootstrap.
// modal display processing
function showCourseDetails(courseId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to view course details.");
      return;
    }
  
    fetch(`https://www.fulek.com/data/api/supit/get-curriculum/${courseId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
      // Modal content update
      $('#modalTitle').text(data.data?.kolegij || "N/A");
      $('#modalContent').html(`
        <p><strong>ECTS:</strong> ${data.data?.ects || "N/A"}</p>
        <p><strong>Hours:</strong> ${data.data?.sati || "N/A"}</p>
        <p><strong>Lectures:</strong> ${data.data?.predavanja || "N/A"}</p>
        <p><strong>Exercises:</strong> ${data.data?.vjezbe || "N/A"}</p>
        <p><strong>Type:</strong> ${data.data?.tip || "N/A"}</p>
        <p><strong>Semester:</strong> ${data.data?.semestar || "N/A"}</p>
      `);
      
      // Show Bootstrap modal.
      $('#courseModal').modal('show'); 
    })
    .catch(error => {
      console.error("Error fetching course details:", error);
      alert("Failed to load course details.");
    });
  }
  
  // Modal closing process changed to Bootstrap method.
  function closeModal() {
    $('#courseModal').modal('hide');
  }


  // processing of contact form submissions
document.addEventListener("DOMContentLoaded", () => {
    // Force reinitialisation of Bootstrap Collapse components.
    $('#navbarNav').collapse({ toggle: false });
    
    // Navigational toggle button click events.
    $('.navbar-toggler').off('click').on('click', function() {
        $('#navbarNav').collapse('toggle'); 
    });
});

// autocomplete function
document.getElementById("searchInput").addEventListener("input", async function(e) {
    const query = e.target.value.toLowerCase();
    const suggestions = originalCourses.filter(course => 
        course.course.toLowerCase().includes(query)
    ).map(course => course.course);
    
    const datalist = document.getElementById("courseSuggestions");
    datalist.innerHTML = suggestions.map(s => `<option value="${s}">`).join("");
});

// Search filter application event listeners
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("semesterFilter").addEventListener("change", applyFilters);
document.getElementById("typeFilter").addEventListener("change", applyFilters);

// Initial processing on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchCurriculum();
    updateSelectedCourses();
});

// logout process
function handleLogout() {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    window.location.href = "login.html";
}

// Change of status of login/logout links in navigation menus
function updateLoginLogoutLink() {
    document.addEventListener("DOMContentLoaded", () => {
        const loginLink = document.getElementById("loginLink");
        if (!loginLink) {
            console.error("Error: loginLink element not found");
            return;
        }
        const token = localStorage.getItem("token");
        console.log("Token retrieved:", token);

        if (token) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
            loginLink.onclick = handleLogout;
        } else {
            loginLink.textContent = "Login";
            loginLink.href = "login.html";
            loginLink.onclick = null;
        }
    });
}

// Update login/logout links on page load
updateLoginLogoutLink();

// Token display for debugging.
console.log("Stored Token:", localStorage.getItem("token"));



// Add Bootstrap dependencies.
document.addEventListener("DOMContentLoaded", () => {
    $('.navbar-toggler').off('click').on('click', function() {
        $('#navbarNav').collapse('toggle'); 
    });
});

// Processing of contact form submissions.
document.getElementById("contactForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch(event.target.action, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Your message has been sent successfully!");
            event.target.reset(); // Reset form.
        } else {
            alert("There was an error sending your message. Please try again.");
        }
    } catch (error) {
        console.error("Error during form submission:", error);
        alert("An unexpected error occurred. Please try again later.");
    }
});


// Reinitialise Bootstrap's Collapse component.
$(document).ready(function() {
    $('#navbarNav').collapse({
        toggle: false // Set initial status as closed.
    });
});