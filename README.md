# MERN Task Manager Application

A full-stack Task Management application built using the MERN (MongoDB, Express, React, Node.js) stack.

## 🚀 Features

- **User Authentication**: Secure login and signup using JWT.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Search & Filter**: Find tasks efficiently.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB 
- **Authentication**: JSON Web Tokens (JWT), BcryptJS

---
## 🚦 API Endpoints (Quick Overview)

### Auth
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login and get a JWT

### Tasks
- `GET /tasks`: Get all tasks for the logged-in user
- `POST /tasks`: Create a new task
- `PUT /tasks/:id`: Update an existing task
- `DELETE /tasks/:id`: Delete a task

### Admin
- `GET /admin/users`: List all users (Admin only)
- `GET /admin/tasks`: List all tasks (Admin only)

---

