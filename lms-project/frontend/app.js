const apiUrl = "http://localhost:5005/api";

// Handle user registration
document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        document.getElementById("error-message").textContent = "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();

        if (data.success) {
            window.location.href = "login.html"; // Redirect to login page after successful registration
        } else {
            document.getElementById("error-message").textContent = data.message || "Registration failed";
        }
    } catch (error) {
        document.getElementById("error-message").textContent = "Server error. Please try again later.";
    }
});

// Handle login request
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("error-message").textContent = "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html"; // Redirect to course list page
        } else {
            document.getElementById("error-message").textContent = data.message || "Login failed";
        }
    } catch (error) {
        document.getElementById("error-message").textContent = "Server error. Please try again later.";
    }
});

// Fetch and display courses
async function fetchCourses() {
    const response = await fetch(`${apiUrl}/courses`);
    const courses = await response.json();

    const coursesContainer = document.getElementById("courses");
    coursesContainer.innerHTML = "";

    courses.forEach(course => {
        const courseElement = document.createElement("div");
        courseElement.classList.add("course");
        courseElement.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <p><strong>Category:</strong> ${course.category}</p>
            <p><strong>Level:</strong> ${course.level}</p>
            <p><strong>Instructor:</strong> ${course.instructor}</p>
        `;
        coursesContainer.appendChild(courseElement);
    });
}

// Handle course creation
document.getElementById("create-course-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const level = document.getElementById("level").value;

    if (!title || !description || !category || !level) {
        alert("Please fill in all fields.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/courses`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        alert(data.message);
        window.location.href = "index.html"; // Redirect to the course list page
    } catch (error) {
        alert("Error creating course.");
    }
});

// Load courses on page load
if (document.getElementById("courses")) {
    fetchCourses();
}
