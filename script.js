// ================================
// BLOGSPACE - FRONTEND JAVASCRIPT
// MODULE 5 - AUTHENTICATION & DASHBOARD
// ================================

const API_URL = "https://codomax-blog-application-t2.onrender.com/api";


// ================================
// AUTHENTICATION HELPERS
// ================================

// Get JWT token
function getToken() {
    return localStorage.getItem("token");
}


// Get logged-in user
function getLoggedInUser() {

    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        return null;
    }
}


// Check whether user is logged in
function isLoggedIn() {
    return !!getToken();
}


// Create authorization headers
function authHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };

}


// Logout function
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");

    alert("You have been logged out.");

    window.location.href = "login.html";
}


// ================================
// PROTECT DASHBOARD
// ================================

function protectDashboard() {

    const dashboardList =
        document.getElementById("dashboardBlogList");

    if (!dashboardList) {
        return;
    }

    if (!isLoggedIn()) {

        alert("Please login to access your dashboard.");

        window.location.href = "login.html";

        return;
    }

}


// ================================
// REGISTER
// ================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                alert("Please fill in all fields.");

                return;
            }


            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Registration failed."
                    );

                    return;
                }


                alert(
                    "Registration successful! Please login."
                );


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                alert(
                    "Unable to connect to the backend. Make sure the server is running."
                );

            }

        }
    );

}


// ================================
// LOGIN
// ================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: email,

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Invalid email or password."
                    );

                    return;
                }


                // Store JWT token
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Store user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // Keep login flag
                localStorage.setItem(
                    "loggedIn",
                    "true"
                );


                alert("Login successful!");


                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                alert(
                    "Unable to connect to the backend. Make sure the server is running."
                );

            }

        }
    );

}


// ================================
// PROFILE
// ================================

async function loadProfile() {

    const profileName =
        document.getElementById("profileName");


    const profileEmail =
        document.getElementById("profileEmail");


    if (!profileName && !profileEmail) {
        return;
    }


    if (!isLoggedIn()) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/profile`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                logout();

                return;
            }


            throw new Error(
                data.message ||
                "Failed to load profile"
            );

        }


        const user =
            data.user;


        if (profileName) {

            profileName.textContent =
                user.name;

        }


        if (profileEmail) {

            profileEmail.textContent =
                user.email;

        }


        // Update localStorage
        localStorage.setItem(
            "user",
            JSON.stringify({

                id: user._id,

                name: user.name,

                email: user.email

            })
        );


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

    }

}


// ================================
// CREATE BLOG
// ================================

const blogForm =
    document.getElementById("blogForm");


if (blogForm) {

    blogForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // User must be logged in
            if (!isLoggedIn()) {

                alert(
                    "Please login before creating a blog."
                );

                window.location.href =
                    "login.html";

                return;
            }


            // Get blog title
            const title =
                document
                    .getElementById("blogTitle")
                    .value
                    .trim();


            // Get category
            const category =
                document
                    .getElementById("blogCategory")
                    .value
                    .trim();


            // Get content
            const content =
                document
                    .getElementById("blogContent")
                    .value
                    .trim();


            // Get author
            const authorInput =
                document.getElementById("blogAuthor");


            let author = "";


            // First try author input
            if (authorInput) {

                author =
                    authorInput.value
                        .trim();

            }


            // If empty, use logged-in user's name
            if (!author) {

                const loggedInUser =
                    getLoggedInUser();


                if (
                    loggedInUser &&
                    loggedInUser.name
                ) {

                    author =
                        loggedInUser.name
                            .trim();


                    if (authorInput) {

                        authorInput.value =
                            author;

                    }

                }

            }


            // Get status
            const status =
                document
                    .getElementById("blogStatus")
                    .value
                    .trim();


            // ================================
            // VALIDATION
            // ================================

            if (!title) {

                alert("Please enter a blog title.");

                document
                    .getElementById("blogTitle")
                    .focus();

                return;
            }


            if (!category) {

                alert("Please select a category.");

                document
                    .getElementById("blogCategory")
                    .focus();

                return;
            }


            if (!content) {

                alert("Please enter blog content.");

                document
                    .getElementById("blogContent")
                    .focus();

                return;
            }


            if (!author) {

                alert("Please enter the Author Name.");

                if (authorInput) {
                    authorInput.focus();
                }

                return;
            }


            // ================================
            // SEND BLOG TO BACKEND
            // ================================

            try {

                const response =
                    await fetch(
                        `${API_URL}/blogs`,
                        {

                            method: "POST",

                            headers:
                                authHeaders(),

                            body: JSON.stringify({

                                title:
                                    title,

                                category:
                                    category,

                                content:
                                    content,

                                author:
                                    author,

                                status:
                                    status

                            })

                        }
                    );


                const data =
                    await response.json();


                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    alert(
                        "Your session has expired. Please login again."
                    );

                    logout();

                    return;
                }


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Blog creation failed."
                    );

                    return;
                }


                alert(
                    "Blog created successfully!"
                );


                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Blog creation error:",
                    error
                );


                alert(
                    "Unable to connect to the backend. Make sure the server is running."
                );

            }

        }
    );

}


// ================================
// EDIT BLOG
// ================================

async function editBlog(blogId) {

    if (!isLoggedIn()) {

        alert(
            "Please login to edit your blog."
        );

        window.location.href =
            "login.html";

        return;
    }


    try {

        // Get blog details
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
            !content.trim()
        ) {

            alert(
                "All fields are required."
            );

            return;
        }


        const updateResponse =
            await fetch(
                `${API_URL}/blogs/${blogId}`,
                {

                    method: "PUT",

                    headers:
                        authHeaders(),

                    body: JSON.stringify({

                        title:
                            title.trim(),

                        category:
                            category.trim(),

                        content:
                            content.trim(),

                        status:
                            status.trim()

                    })

                }
            );


        const updateData =
            await updateResponse.json();


        if (
            updateResponse.status === 401 ||
            updateResponse.status === 403
        ) {

            alert(
                "Your session has expired. Please login again."
            );

            logout();

            return;
        }


        if (!updateResponse.ok) {

            alert(
                updateData.message ||
                "Blog update failed."
            );

            return;
        }


        alert(
            "Blog updated successfully!"
        );


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

    if (!isLoggedIn()) {

        alert(
            "Please login to delete your blog."
        );

        window.location.href =
            "login.html";

        return;
    }


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

                    method: "DELETE",

                    headers:
                        authHeaders()

                }
            );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Your session has expired. Please login again."
            );

            logout();

            return;
        }


        if (!response.ok) {

            alert(
                data.message ||
                "Blog deletion failed."
            );

            return;
        }


        alert(
            "Blog deleted successfully!"
        );


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


    // ================================
    // CHECK LOGIN
    // ================================

    if (!isLoggedIn()) {

        alert(
            "Please login to access your dashboard."
        );

        window.location.href =
            "login.html";

        return;
    }


    // ================================
    // GET LOGGED-IN USER
    // ================================

    const user =
        getLoggedInUser();


    if (!user || !user.name) {

        console.error(
            "Logged-in user information not found."
        );


        dashboardList.innerHTML = `

            <div class="empty-dashboard">

                <div>⚠️</div>

                <h3>User information not found</h3>

                <p>
                    Please login again.
                </p>

            </div>

        `;

        return;
    }


    try {

        // ================================
        // GET ALL BLOGS
        // ================================

        const response =
            await fetch(
                `${API_URL}/blogs`,
                {
                    method: "GET"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch blogs"
            );

        }


        // ================================
        // GET BLOGS FROM DATABASE
        // ================================

        const blogs =
            data.blogs || [];


        // ================================
        // SHOW ONLY LOGGED-IN USER BLOGS
        // ================================

        allBlogs =
            blogs.filter(
                function (blog) {

                    return (

                        String(
                            blog.author || ""
                        )
                            .trim()
                            .toLowerCase()

                        ===

                        String(
                            user.name || ""
                        )
                            .trim()
                            .toLowerCase()

                    );

                }
            );


        console.log(
            "Logged-in user:",
            user.name
        );


        console.log(
            "User blogs:",
            allBlogs
        );


        // ================================
        // UPDATE STATISTICS
        // ================================

        updateStatistics();


        // ================================
        // DISPLAY BLOGS
        // ================================

        displayBlogs();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        dashboardList.innerHTML = `

            <div class="empty-dashboard">

                <div>⚠️</div>

                <h3>Unable to load your blogs</h3>

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
// DISPLAY USER'S BLOGS
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
        allBlogs.filter(
            function (blog) {

                const title =
                    (blog.title || "")
                        .toLowerCase();


                const content =
                    (blog.content || "")
                        .toLowerCase();


                const author =
                    (blog.author || "")
                        .toLowerCase();


                const category =
                    blog.category ||
                    "Other";


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

            }
        );


    // No matching blogs
    if (filteredBlogs.length === 0) {

        dashboardList.innerHTML = `

            <div class="empty-dashboard">

                <div>📝</div>

                <h3>No blogs found</h3>

                <p>
                    Start sharing your ideas by creating your first blog post.
                </p>

                <a
                    href="create-blog.html"
                    class="dashboard-btn"
                >
                    + Create Blog
                </a>

            </div>

        `;

        return;
    }


    dashboardList.innerHTML = "";


    filteredBlogs.forEach(
        function (blog) {

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

                    editBlog(
                        blog._id
                    );

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

                    deleteBlog(
                        blog._id
                    );

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

        }
    );

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


        if (
            publishedBlogs.length === 0
        ) {

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

            <h2>
                Blog not found
            </h2>

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
// PAGE INITIALIZATION
// ================================

// Protect dashboard
protectDashboard();


// Load dashboard
loadDashboard();


// Load profile
loadProfile();


// Load home blogs
loadHomeBlogs();


// Load individual blog
loadBlogDetails();