# Blog Application – Database Integration

## 📌 Project Overview

This is a full-stack Blog Application developed as part of **Module 3 – Database Integration**.

The application allows users to register and log in securely, create blog posts, view all available blogs, and open individual blog posts.

## 🚀 Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Security

* bcrypt password hashing
* Environment variables for database credentials

## ✨ Features

* User registration
* Secure password hashing
* User login authentication
* Create and store blog posts
* Retrieve all blogs from MongoDB
* Display blogs on the dashboard
* View individual blog details
* Blog categories and status
* MongoDB database integration
* REST API integration between frontend and backend

## 📂 Project Structure

```text
Blog-Application/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── script.js
├── style.css
│
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## 🔗 API Endpoints

### User Registration

```text
POST /api/register
```

### User Login

```text
POST /api/login
```

### Create Blog

```text
POST /api/blogs
```

### Get All Blogs

```text
GET /api/blogs
```

### Get Individual Blog

```text
GET /api/blogs/:id
```

## 🔐 Security

User passwords are hashed using **bcrypt** before being stored in MongoDB.

The MongoDB connection string is stored in an `.env` file and is excluded from GitHub using `.gitignore`.

```text
.env
node_modules/
```

## ▶️ How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### 3. Start the server

```bash
node server.js
```

The backend will run at:

```text
http://localhost:3000
```

## 🎯 Module 3 Deliverables

* ✅ MongoDB Integration
* ✅ Secure User Authentication
* ✅ Blog Data Storage
* ✅ Retrieve All Blogs
* ✅ Individual Blog Details
* ✅ GitHub Repository

## 🔗 GitHub Repository

https://github.com/grieshmas13-design/Blog-Application

## 👩‍💻 Project

Developed as part of an internship project to practice full-stack web development and database integration.
