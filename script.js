// ================================
// BLOGSPACE - FRONTEND JAVASCRIPT
// ================================

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

                alert(
                    data.message ||
                    "Invalid email or password."
                );

                return;
            }


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

                alert(
                    data.message ||
                    "Blog creation failed."
                );

                return;
            }


            alert("Blog created successfully!");

            window.location.href = "dashboard.html";


        } catch (error) {

            console.error(
                "Blog creation error:",
                error
            );

            alert(
                "Unable to connect to the backend. Make sure the server is running."
            );

        }

    });

}


// ================================
// EDIT BLOG
// ================================

async function editBlog(blogId) {

    try {

        const response =
            await fetch(
                `${API_URL}/blogs/${blogId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to load blog."
            );

            return;
        }


        const blog =
            data.blog;


        const title =
            prompt(
                "Enter blog title:",
                blog.title
            );


        if (title === null) {
            return;
        }


        const category =
            prompt(
                "Enter blog category:",
                blog.category
            );


        if (category === null) {
            return;
        }


        const author =
            prompt(
                "Enter author name:",
                blog.author
            );


        if (author === null) {
            return;
        }


        const content =
            prompt(
                "Enter blog content:",
                blog.content
            );


        if (content === null) {
            return;
        }


        const status =
            prompt(
                "Enter status (Published or Draft):",
                blog.status || "Published"
            );


        if (status === null) {
            return;
        }


        if (
            !title.trim() ||
            !category.trim() ||
            !author.trim() ||
            !content.trim()
        ) {

            alert("All fields are required.");

            return;
        }


        const updateResponse =
            await fetch(
                `${API_URL}/blogs/${blogId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        title: title.trim(),

                        category: category.trim(),

                        author: author.trim(),

                        content: content.trim(),

                        status: status.trim()

                    })

                }
            );


        const updateData =
            await updateResponse.json();


        if (!updateResponse.ok) {

            alert(
                updateData.message ||
                "Blog update failed."
            );

            return;
        }


        alert("Blog updated successfully!");

        loadDashboard();


    } catch (error) {

        console.error(
            "Edit blog error:",
            error
        );

        alert(
            "Unable to connect to the backend. Make sure the server is running."
        );

    }

}


// ================================
// DELETE BLOG
// ================================

async function deleteBlog(blogId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this blog?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/blogs/${blogId}`,
                {

                    method: "DELETE"

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Blog deletion failed."
            );

            return;
        }


        alert("Blog deleted successfully!");

        loadDashboard();


    } catch (error) {

        console.error(
            "Delete blog error:",
            error
        );

        alert(
            "Unable to connect to the backend. Make sure the server is running."
        );

    }

}


// ================================
// DASHBOARD
// ================================

let allBlogs = [];

let searchText = "";

let selectedCategory = "all";


async function loadDashboard() {

    const dashboardList =
        document.getElementById(
            "dashboardBlogList"
        );


    if (!dashboardList) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/blogs`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch blogs"
            );

        }


        allBlogs =
            data.blogs || [];


        updateStatistics();


        displayBlogs();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


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


// ================================
// UPDATE DASHBOARD STATISTICS
// ================================

function updateStatistics() {

    const totalBlogs =
        document.getElementById(
            "totalBlogs"
        );


    const publishedBlogs =
        document.getElementById(
            "publishedBlogs"
        );


    const draftBlogs =
        document.getElementById(
            "draftBlogs"
        );


    if (totalBlogs) {

        totalBlogs.textContent =
            allBlogs.length;

    }


    if (publishedBlogs) {

        publishedBlogs.textContent =
            allBlogs.filter(
                blog =>
                    blog.status === "Published"
            ).length;

    }


    if (draftBlogs) {

        draftBlogs.textContent =
            allBlogs.filter(
                blog =>
                    blog.status === "Draft"
            ).length;

    }

}


// ================================
// DISPLAY BLOGS
// ================================

function displayBlogs() {

    const dashboardList =
        document.getElementById(
            "dashboardBlogList"
        );


    if (!dashboardList) {
        return;
    }


    // Apply search and category filter
    const filteredBlogs =
        allBlogs.filter(function (blog) {

            const title =
                (blog.title || "").toLowerCase();

            const content =
                (blog.content || "").toLowerCase();

            const author =
                (blog.author || "").toLowerCase();

            const category =
                blog.category || "Other";


            const matchesSearch =
                title.includes(searchText) ||
                content.includes(searchText) ||
                author.includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    // No matching blogs
    if (filteredBlogs.length === 0) {

        dashboardList.innerHTML = `

            <div class="empty-dashboard">

                <div>🔍</div>

                <h3>No blogs found</h3>

                <p>
                    Try a different search or category.
                </p>

            </div>

        `;

        return;
    }


    dashboardList.innerHTML = "";


    filteredBlogs.forEach(function (blog) {

        const blogCard =
            document.createElement(
                "article"
            );


        blogCard.className =
            "created-blog";


        const statusClass =
            blog.status === "Published"
                ? "status-published"
                : "status-draft";


        const date =
            blog.createdAt
                ? new Date(
                    blog.createdAt
                ).toLocaleDateString()
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

            <br><br>

            <button
                class="edit-blog-btn"
                type="button"
            >
                ✏️ Edit
            </button>

            <button
                class="delete-blog-btn"
                type="button"
            >
                🗑️ Delete
            </button>

        `;


        // Edit button
        const editButton =
            blogCard.querySelector(
                ".edit-blog-btn"
            );


        editButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                editBlog(blog._id);

            }
        );


        // Delete button
        const deleteButton =
            blogCard.querySelector(
                ".delete-blog-btn"
            );


        deleteButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                deleteBlog(blog._id);

            }
        );


        // Open blog details
        blogCard.addEventListener(
            "click",
            function () {

                window.location.href =
                    `blog-details.html?id=${blog._id}`;

            }
        );


        dashboardList.appendChild(
            blogCard
        );

    });

}


// ================================
// SEARCH BLOGS
// ================================

const searchInput =
    document.getElementById(
        "searchBlogs"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();


            displayBlogs();

        }
    );

}


// ================================
// CATEGORY FILTER
// ================================

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        function () {

            selectedCategory =
                categoryFilter.value;


            displayBlogs();

        }
    );

}


// ================================
// LOAD DASHBOARD
// ================================

loadDashboard();


// ================================
// HOME PAGE
// SHOW PUBLISHED BLOGS
// ================================

async function loadHomeBlogs() {

    const blogGrid =
        document.querySelector(
            ".blog-grid"
        );


    if (!blogGrid) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/blogs`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch blogs"
            );

        }


        const blogs =
            data.blogs || [];


        const publishedBlogs =
            blogs.filter(
                blog =>
                    blog.status === "Published"
            );


        if (publishedBlogs.length === 0) {
            return;
        }


        publishedBlogs.forEach(
            function (blog) {

                const blogCard =
                    document.createElement(
                        "article"
                    );


                blogCard.className =
                    "blog-card";


                const date =
                    blog.createdAt
                        ? new Date(
                            blog.createdAt
                        ).toLocaleDateString()
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


                blogCard.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            `blog-details.html?id=${blog._id}`;

                    }
                );


                blogGrid.appendChild(
                    blogCard
                );

            }
        );


    } catch (error) {

        console.error(
            "Home page error:",
            error
        );

    }

}


// ================================
// LOAD HOME BLOGS
// ================================

loadHomeBlogs();


// ================================
// SINGLE BLOG DETAILS
// ================================

async function loadBlogDetails() {

    const blogDetails =
        document.getElementById(
            "blogDetails"
        );


    if (!blogDetails) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const blogId =
        params.get("id");


    if (!blogId) {

        blogDetails.innerHTML = `

            <h2>Blog not found</h2>

            <p>
                No blog ID was provided.
            </p>

        `;

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/blogs/${blogId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load blog"
            );

        }


        const blog =
            data.blog;


        const date =
            blog.createdAt
                ? new Date(
                    blog.createdAt
                ).toLocaleDateString()
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

            <h2>
                Unable to load blog
            </h2>

            <p>
                Please make sure the backend server is running.
            </p>

        `;

    }

}


// ================================
// LOAD INDIVIDUAL BLOG
// ================================

loadBlogDetails();