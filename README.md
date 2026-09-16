# CodoMax Blog Application

A full-stack Blog Application developed as part of my CodoMax Internship.

## 🚀 Project Overview

This project is a full-stack blogging platform that allows users to register, log in securely, create and manage their own blog posts, and browse published blogs.

The application uses a Node.js and Express.js backend, MongoDB database, JWT authentication, and a responsive HTML/CSS/JavaScript frontend.

## ✨ Features

### Authentication
- User registration
- Secure password hashing using bcrypt
- User login
- JWT-based authentication
- Protected dashboard
- User profile
- Logout functionality

### Blog Management
- Create blog posts
- Edit blog posts
- Delete blog posts
- Publish blogs
- Save blogs as drafts
- View published blogs
- View individual blog details
- Users can manage only their own blogs

### Search & Filtering
- Search blogs by title, content, or author
- Filter blogs by category
- Combine search and category filtering

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Token)
- bcrypt
- dotenv

## 📁 Project Structure

```text
Blog-Application/
│
├── models/
│   ├── Blog.js
│   └── User.js
│
├── blog-details.html
├── create-blog.html
├── dashboard.html
├── index.html
├── login.html
├── register.html
├── script.js
├── style.css
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore