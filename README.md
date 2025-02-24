# Backend Setup Guide

## 📌 Introduction
This guide provides step-by-step instructions to set up and run the backend of the challenge. The backend is built using **Node.js (pure, without frameworks)** and follows **SOLID principles**, handling **routes, streams, and security**.

---

## 📦 Requirements
Ensure you have the following installed:
- **Node.js** (v22+ recommended)
- **npm** or **yarn**

---

## 🚀 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Felipebasilio/ReactiveBeerBack.git
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```
   or if using Yarn:
   ```sh
   yarn install
   ```

---

## ▶️ Running the Backend Server
To start the backend:
```sh
npm run dev
```


This will start the backend on `http://localhost:3333/`.

---

## 🔄 API Endpoints
### **1️⃣ Products API**
- **GET `/products`** → Returns all products with stock & price.

### **2️⃣ Stock & Price API**
- **GET `/stock-price/:sku`** → Returns stock and price for a single SKU.

---

## 📁 Project Structure
```
backend/
│── data/
│   ├── products.js          # Product database
│   ├── stock-price.js       # Stock and price database
│── middlewares/
│   ├── json.js              # Middleware for JSON parsing
│── routes/
│   ├── routes.js            # API routes configuration
│── utils/
│   ├── build-route-path.js  # Utility for building route paths
│   ├── extract-query-params.js # Utility for extracting query params
│── database.js              # Local database handler
│── server.js                # Server entry file
│── package.json             # Project dependencies
│── README.md                # This guide
```

---

## 🔄 Environment Variables
If needed, create a `.env` file in the root directory:
```sh
PORT=3333
```
By default, the backend runs on port **3333**.

---

## 🔥 Features Implemented
✅ **Node.js API (No Frameworks)** – Pure Node.js implementation.
✅ **SOLID Architecture** – Modular and maintainable design.
✅ **Data Persistence** – Stores data locally in JSON files.
✅ **CORS Support** – Enables frontend communication.
✅ **Efficient Stock & Price Updates** – Supports bulk SKU queries.
✅ **Security Best Practices** – Handles invalid requests properly.

---

## 🛠️ Troubleshooting
- **Port already in use?** Try changing it in `.env`.
- **Cannot connect to frontend?** Ensure frontend is running on `http://localhost:5173/`.
- **Missing dependencies?** Run:
  ```sh
  npm install
  ```

---

## 👨‍💻 Author
Developed by **Felipe Basilio**.

---