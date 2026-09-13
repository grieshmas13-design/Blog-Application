// ================================
// BLOGSPACE - BACKEND JAVASCRIPT
// ================================


// Backend API URL
const API_URL = "http://localhost:3000/api";


// ================================
// REGISTER
// ================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check passwords
        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        try {

            const response = await fetch(`${API_URL}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })

            });


            const data = await response.json();


            if (!response.ok) {

                alert(data.message || "Registration failed.");

                return;
            }


            alert("Registration successful! Please login.");

            window.location.href = "login.html";


        } catch (error) {

            console.error("Registration error:", error);

            alert(
                "Unable to connect to the backend. Make sure the server is running."
            );

        }

    });

}


// ================================
// LOGIN
// ================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        try {

            const response = await fetch(`${API_URL}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });


            const data = await response.json();


            if (!response.ok) {

                alert(data.message || "Invalid email or password.");

                return;
            }


            // Save logged-in user information
            localStorage.setItem(
                "loggedIn",
                "true"
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            alert("Login successful!");

            window.location.href = "dashboard.html";


        } catch (error) {

            console.error("Login error:", error);

            alert(
                "Unable to connect to the backend. Make sure the server is running."
            );

        }

    });

}


// ================================
// CREATE BLOG
// ================================

const blogForm =
    document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const title =
            document.getElementById("blogTitle").value.trim();

        const category =
            document.getElementById("blogCategory").value;

        const author =
            document.getElementById("blogAuthor").value.trim();

        const content =
            document.getElementById("blogContent").value.trim();

        const status =
            document.getElementById("blogStatus").value;


        // Check required fields
        if (!title || !category || !author || !content) {

            alert("Please fill in all required fields.");

            return;
        }


        try {

            const response = await fetch(`${API_URL}/blogs`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    title: title,

                    category: category,

                    content: content,

                    author: author,

                    status: status

                })

            });


            const data = await response.json();


            if (!response.ok) {

                alert(data.message || "Blog creation failed.");

                return;
            }


            alert("Blog created successfully!");


            // Redirect to dashboard
            window.location.href = "dashboard.html";


        } catch (error) {

            console.error("Blog creation error:", error);

            alert(
                "Unable to connect to the backend. Make sure the server is running."
            );

        }

    });

}


// ================================
// DASHBOARD
// ================================

async function loadDashboard() {

    const dashboardList =
        document.getElementById("dashboardBlogList");


    if (!dashboardList) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/blogs`);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to fetch blogs"
            );

        }


        const blogs = data.blogs || [];


        // =========================
        // STATISTICS
        // =========================

        const totalBlogs =
            document.getElementById("totalBlogs");

        const publishedBlogs =
            document.getElementById("publishedBlogs");

        const draftBlogs =
            document.getElementById("draftBlogs");


        if (totalBlogs) {

            totalBlogs.textContent =
                blogs.length;

        }


        if (publishedBlogs) {

            publishedBlogs.textContent =
                blogs.filter(
                    blog => blog.status === "Published"
                ).length;

        }


        if (draftBlogs) {

            draftBlogs.textContent =
                blogs.filter(
                    blog => blog.status === "Draft"
                ).length;

        }


        // =========================
        // NO BLOGS
        // =========================

        if (blogs.length === 0) {

            dashboardList.innerHTML = `

                <div class="empty-dashboard">

                    <div>📝</div>

                    <h3>No blog posts yet</h3>

                    <p>
                        Start sharing your ideas by creating
                        your first blog post.
                    </p>

                    <a
                        href="create-blog.html"
                        class="dashboard-btn"
                    >
                        Create Your First Blog
                    </a>

                </div>

            `;

            return;
        }


        // =========================
        // DISPLAY BLOGS
        // =========================

        dashboardList.innerHTML = "";


        blogs.forEach(function (blog) {

            const blogCard =
                document.createElement("article");

            blogCard.style.cursor = "pointer";

blogCard.addEventListener("click", function () {

    window.location.href =
        `blog-details.html?id=${blog._id}`;

});
            blogCard.className =
                "created-blog";


            const statusClass =
                blog.status === "Published"
                    ? "status-published"
                    : "status-draft";


            const date =
                blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "";


            blogCard.innerHTML = `

                <span class="category">
                    ${blog.category || "Other"}
                </span>

                <h3>
                    ${blog.title}
                </h3>

                <p>
                    ${blog.content}
                </p>

                <div class="blog-meta">

                    <span>
                        By ${blog.author}
                    </span>

                    <span>
                        ${date}
                    </span>

                </div>

                <br>

                <span class="status ${statusClass}">
                    ${blog.status || "Published"}
                </span>

            `;


            dashboardList.appendChild(blogCard);

        });


    } catch (error) {

        console.error("Dashboard error:", error);

        dashboardList.innerHTML = `

            <div class="empty-dashboard">

                <div>⚠️</div>

                <h3>Unable to load blogs</h3>

                <p>
                    Please make sure the backend server is running.
                </p>

            </div>

        `;

    }

}


// Run dashboard function
loadDashboard();


// ================================
// HOME PAGE - SHOW PUBLISHED BLOGS
// ================================

async function loadHomeBlogs() {

    const blogGrid =
        document.querySelector(".blog-grid");


    // Only run on Home page
    if (!blogGrid) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/blogs`);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to fetch blogs"
            );

        }


        const blogs =
            data.blogs || [];


        // Only published blogs
        const publishedBlogs =
            blogs.filter(
                blog => blog.status === "Published"
            );


        // If there are no published blogs,
        // keep the sample blogs
        if (publishedBlogs.length === 0) {
            return;
        }


        // Add published blogs
        publishedBlogs.forEach(function (blog) {

            const blogCard =
                document.createElement("article");

            blogCard.className =
                "blog-card";


            const date =
                blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "";


            blogCard.innerHTML = `

                <div class="blog-image">
                    📝
                </div>

                <div class="blog-content">

                    <span class="category">
                        ${blog.category || "Other"}
                    </span>

                    <h3>
                        ${blog.title}
                    </h3>

                    <p>
                        ${blog.content}
                    </p>

                    <div class="blog-info">

                        <span>
                            By ${blog.author}
                        </span>

                        <span>
                            ${date}
                        </span>

                    </div>

                </div>

            `;


            blogGrid.appendChild(blogCard);

        });


    } catch (error) {

        console.error("Home page error:", error);

    }

}


// Load published blogs
loadHomeBlogs();
// ================================
// SINGLE BLOG DETAILS
// ================================

async function loadBlogDetails() {

    const blogDetails =
        document.getElementById("blogDetails");

    if (!blogDetails) {
        return;
    }

    // Get blog ID from URL
    const params =
        new URLSearchParams(window.location.search);

    const blogId =
        params.get("id");

    if (!blogId) {

        blogDetails.innerHTML = `
            <h2>Blog not found</h2>
            <p>No blog ID was provided.</p>
        `;

        return;
    }

    try {

        const response =
            await fetch(`${API_URL}/blogs/${blogId}`);

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load blog"
            );

        }

        const blog =
            data.blog;

        const date =
            blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString()
                : "";

        blogDetails.innerHTML = `

            <article class="blog-card">

                <div class="blog-content">

                    <span class="category">
                        ${blog.category || "Other"}
                    </span>

                    <h1>
                        ${blog.title}
                    </h1>

                    <p>
                        ${blog.content}
                    </p>

                    <div class="blog-info">

                        <span>
                            By ${blog.author}
                        </span>

                        <span>
                            ${date}
                        </span>

                    </div>

                    <br>

                    <span class="status">
                        ${blog.status || "Published"}
                    </span>

                    <br><br>

                    <a href="index.html">
                        ← Back to Home
                    </a>

                </div>

            </article>

        `;

    } catch (error) {

        console.error(
            "Blog details error:",
            error
        );

        blogDetails.innerHTML = `

            <h2>Unable to load blog</h2>

            <p>
                Please make sure the backend server
                is running.
            </p>

        `;

    }

}


// Load individual blog
loadBlogDetails();