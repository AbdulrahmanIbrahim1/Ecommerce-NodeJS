# 🛒 Ecommerce REST API

A complete Ecommerce Backend RESTful API built with Node.js, Express.js, and MongoDB.

This project provides a scalable backend architecture for managing users, authentication, products, categories, carts, and orders.

---

## 🚀 Features

- 🔐 JWT Authentication & Authorization
- 👤 User Management (CRUD)
- 🛍 Product Management (CRUD)
- 🗂 Category Management
- 🛒 Shopping Cart System
- 📦 Order Management
- 🛡 Role-Based Access Control (Admin/User)
- 📑 API Documentation using Swagger
- ⚡ Clean MVC Architecture

---

## 🏗 Project Structure

```bash
Ecommerce-NodeJS/
│
├── config/         # App & Database configuration
├── controllers/    # Application business logic
├── middleware/     # Authentication, validation & error handling
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── utils/          # Helper utilities
├── server.js       # Application entry point
├── swagger.js      # Swagger documentation setup
└── package.json
```

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Swagger

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/AbdulrahmanIbrahim1/Ecommerce-NodeJS.git
cd Ecommerce-NodeJS
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

### 4️⃣ Run the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server will run on:

```
http://localhost:5000
```

---

## 🔐 Authentication

After successful login, a JWT token is returned.

Use the token in request headers:

```
Authorization: Bearer your_token_here
```

---

## 📌 API Endpoints (Examples)

### Authentication
- POST /api/v1/auth/signup
- POST /api/v1/auth/login

### Users
- GET /api/v1/users
- GET /api/v1/users/:id
- PUT /api/v1/users/:id
- DELETE /api/v1/users/:id

### Products
- POST /api/v1/products
- GET /api/v1/products
- GET /api/v1/products/:id
- PUT /api/v1/products/:id
- DELETE /api/v1/products/:id

### Orders
- POST /api/v1/orders
- GET /api/v1/orders
- GET /api/v1/orders/:id

---

## 📑 API Documentation

Swagger documentation available at:

http://localhost:5000/api-docs

---

## 🧠 Future Improvements

- 💳 Online payment integration
- 📧 Email verification
- 🖼 Product image upload (Cloudinary)
- ❤️ Wishlist system
- 📊 Admin dashboard analytics

---

## 👨‍💻 Author

Abdelrahman Ibrahim  
Backend Developer | Cybersecurity Engineer