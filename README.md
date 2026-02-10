
# Web Development Application (MERN Stack)

A **full-stack web development application** built using the **MERN stack (MongoDB, Express.js, React.js, and Node.js)**.
This project demonstrates **role-based authentication**, **product management**, **order tracking**, and **secure backend APIs**, all maintained within a **single repository** containing both frontend and backend code.

---

## 📖 Project Overview

This application is designed as an **e-commerce–style platform** where users can browse and purchase products, while administrators manage products, orders, and users.

The system uses **role-based access control (RBAC)** to differentiate functionality between **Users** and **Admins**, ensuring secure access to sensitive operations such as product modification and user monitoring.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5 & CSS3
* Axios (API communication)

### Backend

* Node.js
* Express.js
* RESTful APIs
* JWT-based authentication

### Database

* MongoDB
* Mongoose ODM

---

## 🏗️ Application Architecture

### Frontend (React.js)

* Handles UI rendering and user interactions
* Communicates with backend APIs using Axios
* Manages authentication state and protected routes

### Backend (Node.js & Express.js)

* Manages authentication and authorization
* Handles business logic and API endpoints
* Secures routes using JWT middleware

### Database (MongoDB)

* Stores users, products, orders, and role-based data

All sensitive configurations are managed through **environment variables**.

---

## 📁 Folder Structure

```
WebApplication/
│
├── frontend/                # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
├── .gitignore               # Common ignore file
└── README.md
```

---

## 👤 User Roles & Features

### 🔹 User Role

Users can:

* Register and log in securely
* View available products
* Purchase products
* View order history
* Manage personal profile information

### 🔹 Admin Role

Admins can:

* Add new products
* Update existing product details
* Delete products
* View and track all orders
* Monitor registered users
* View total user count on the platform

---

## 🔐 Environment Configuration

Sensitive data is stored using environment variables.

### Backend `.env` Example

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> ⚠️ **Do not commit `.env` files to version control.**

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository

```
git clone https://github.com/yourusername/WebApplication.git
cd WebApplication
```

### Step 2: Backend Setup

```
cd backend
npm install
npm start
```

### Step 3: Frontend Setup

```
cd frontend
npm install
npm start
```

### Application URLs

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🔄 API & Data Flow

1. User interacts with the React frontend
2. Frontend sends API requests using Axios
3. Backend validates requests via JWT middleware
4. Business logic is processed
5. MongoDB stores or retrieves data
6. Response is sent back to the frontend

---

## 🔒 Security Practices

* JWT-based authentication
* Role-based authorization (Admin / User)
* Secure environment variable usage
* Protected routes for admin-only access
* Centralized error handling

---

## 🚧 Future Enhancements

* Payment gateway integration
* Product search and filtering
* Pagination and performance optimization
* Admin analytics dashboard
* Email notifications
* Refresh token implementation

---

## 📄 License

This project is licensed under the **MIT License**.

---

⭐ *If you find this project useful, consider giving it a star!*