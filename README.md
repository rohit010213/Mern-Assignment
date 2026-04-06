# MERN Assignment - Task Management System

## 🚀 Features
- **User Authentication**: Secure Login/Signup with JWT.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Admin Panel**: Manage users and oversee all tasks.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### 2. Backend Setup

1. **Navigate to the Backend directory:**
   cd Backend

2. **Install dependencies:**
   npm install

3. **Environment Configuration:**
   Create a `.env` file in the `Backend` directory and define the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. **Run the Backend server:**
   npm run dev
   The backend will be running at `http://localhost:5000`.

---

### 3. Frontend Setup

1. **Navigate to the Frontend directory:**

   cd Frontend

2. **Install dependencies:**

   npm install

3. **Environment Configuration:**
   Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. **Run the Frontend application:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

🚦 API Endpoints (Quick Overview)

Auth

POST /auth/register: Register a new user
POST /auth/login: Login and get a JWT

Tasks

GET /tasks: Get all tasks for the logged-in user
POST /tasks: Create a new task
PUT /tasks/:id: Update an existing task
DELETE /tasks/:id: Delete a task

Admin

GET /admin/users: List all users (Admin only)
GET /admin/tasks: List all tasks (Admin only)

