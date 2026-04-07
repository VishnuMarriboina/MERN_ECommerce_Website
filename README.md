
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
MERN_ECommerce_Website/
│
├── FrontEnd/
│   └── WebSite/             # React + Vite frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── dashboard/
│       │   ├── Redux/
│       │   └── utils/
│       └── package.json
│
├── Backend/                 # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewear/
│   ├── seed.js              # Database seeder
│   ├── index.js
│   └── package.json
│
├── .gitignore
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

Sensitive credentials are stored in a `.env` file that is **never committed to version control**.

### Why `.env` must stay out of git

| Risk | Detail |
|---|---|
| Leaked DB credentials | Anyone with the URI can access/wipe your database |
| Leaked JWT secrets | Attackers can forge valid auth tokens for any user |
| Irreversible exposure | Even after deletion, git history retains the secrets |

### Setup

A `.env.example` file is included in the repo as a safe template. Copy it and fill in your own values:

```bash
cd Backend
cp .env.example .env
```

Then edit `.env`:

```
PORT=5500
MDB_URI=mongodb://localhost:27017/myStore
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
JWT_SECRET=your_long_random_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret
```

### Generate secure secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice — once for `JWT_SECRET`, once for `JWT_REFRESH_SECRET`.

> ⚠️ **Never commit `.env` to git.** It is listed in `.gitignore` and must stay there.
> ✅ **Always commit `.env.example`** — it shows the required keys without exposing real values.

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository

```
git clone https://github.com/yourusername/MERN_ECommerce_Website.git
cd MERN_ECommerce_Website
```

### Step 2: Backend Setup

```
cd Backend
npm install
```

### Step 3: Seed the Database

Before starting the server, populate the database with sample users, products, and orders:

```
npm run seed
```

This will insert:

| Collection | Records |
|---|---|
| Users | 5 (2 Admins, 3 Users) |
| Shirts | 5 products |
| T-Shirts | 5 products |
| Belts | 4 products |
| Watches | 5 products |
| Shoes | 5 products |
| Sandals | 5 products |
| Orders | 9 sample orders |

**Seed credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | arjun.admin@store.com | Admin@123 |
| Admin | sneha.admin@store.com | Admin@456 |
| User | priya.mehta@gmail.com | User@123 |
| User | rahul.verma@gmail.com | User@456 |
| User | ananya.k@gmail.com | User@789 |

> ℹ️ The seed script is **idempotent** — running it multiple times will not create duplicate records.

### Step 4: Start the Backend

```
npm start
```

### Step 5: Frontend Setup

```
cd ../FrontEnd/WebSite
npm install
npm run dev
```

### Application URLs

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5500](http://localhost:5500)

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