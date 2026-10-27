# ShopAI — AI-Powered Luxury Atelier & E-Commerce Platform

ShopAI is a full-stack e-commerce platform and merchant marketplace built according to the course technical specifications.

---

## 🛠️ Tech Stack Overview

| # | Technology | Implementation Details |
|---|---|---|
| **1** | **MongoDB + Mongoose** | Data persistence using Mongoose Schemas & Models: `User` (with unique email, subdocument address), `Product` (pricing, stock, reviews subdocument), and `Order` (items, total, shippingAddress, status). Resilient connection lifecycle with automatic database seeding (`seed.js`). |
| **2** | **NodeJS + ExpressJS** | High-performance Express server (`server.js`), modular routes (`auth.routes.js`, `product.routes.js`, `order.routes.js`, `upload.routes.js`), EventEmitters, centralized middleware chain, and global error handling. |
| **3** | **Authentication (Bcrypt + RegEx)** | Secure registration & login flow: 12-round salt password hashing via `bcryptjs`, and strict regular expression validation on email (`EMAIL_REGEX`), password complexity (`PASSWORD_REGEX`), and user names (`NAME_REGEX`). |
| **4** | **JWT (JSON Web Tokens)** | Stateless token-based session management (`jsonwebtoken`). `verifyToken` middleware extracts Bearer tokens, protects private endpoints (`/api/auth/me`), and enforces Role-Based Access Control (`requireAdmin`, `requireRole`). |
| **5** | **Multer** | Multipart form-data image upload engine (`multer.config.js`). Enforces regex-based image MIME type validation (`/^image\/(jpeg\|jpg\|png\|webp\|gif)$/`), 5MB file size limits, UUID filename generation, and static hosting under `/uploads`. |
| **6** | **React JS** | React 19 + Vite + Tailwind CSS frontend featuring custom luxury atelier aesthetic, AI shopping assistant modal, Cart & Wishlist, interactive Admin panel with Multer image upload UI, and push notification center. |

---

## 🚀 Quick Start Guide

### 1. Environment Configuration
Ensure `aishoppingassistant/.env` is configured (pre-configured with secure defaults):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/shopai
JWT_SECRET=62669b376dee1eb9c7e1548df24571ab07f5cedd53c93b7722bc4fa6459ffce5489169ccd05a894d8ce06556148c57e000d0efd3faa888cfb5f89f682e9c14b8
JWT_EXPIRES_IN=7d
```

> **Note on MongoDB**: If MongoDB is installed locally or a MongoDB Atlas URI is provided in `MONGODB_URI`, the server connects automatically and seeds the database. If MongoDB is not yet running, the server gracefully activates its resilient fallback mode so you can continue testing without interruption.

### 2. Run Backend Server (Node.js + Express)
```powershell
cd aishoppingassistant
npm run server
```
* Server URL: **http://localhost:5000**
* Health Status: **http://localhost:5000/api/health**

### 3. Run Frontend (React + Vite)
In a second terminal window:
```powershell
cd aishoppingassistant
npm run dev
```
* Storefront UI: **http://localhost:5173**

### 4. Run Automated Tech Stack Verification Test
```powershell
cd aishoppingassistant
npm test
```
Verifies all 6 requirements (MongoDB schemas, Express routes, Bcrypt hashing, RegEx checks, JWT tokens, Multer config, and React build) with 68 passing assertions.

---

## 👥 Pre-Seeded Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Customer** | `demo@shopai.com` | `Demo@1234` | Browse atelier, AI chat, cart, checkout, profile |
| **Admin** | `admin@shopai.com` | `Admin@1234` | Manage inventory, fulfill orders, upload product images via Multer |

*(Use the "Quick Auto-Fill Demo Credentials" button on the Login page for one-click access)*

---

## 📡 API Endpoint Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register account (validates with RegEx, hashes password with Bcrypt, signs JWT).
* `POST /api/auth/login` — Sign in (verifies password with Bcrypt compare, returns JWT).
* `GET  /api/auth/me` — Get profile for authenticated user (`Authorization: Bearer <token>`).
* `PUT  /api/auth/profile` — Update address or name for current user.
* `GET  /api/auth/users` — Admin only: list all registered users.

### Products (`/api/products`)
* `GET    /api/products` — List catalog products with search, category filter, price filter, and sorting.
* `GET    /api/products/:id` — Retrieve product details by ID.
* `POST   /api/products` — Admin only: create a new product.
* `PUT    /api/products/:id` — Admin only: update product inventory/details.
* `DELETE /api/products/:id` — Admin only: remove product from catalog.

### Orders (`/api/orders`)
* `POST /api/orders` — Place order (supports authenticated or guest users).
* `GET  /api/orders` — Retrieve user orders (or all orders if admin).
* `PUT  /api/orders/:id/status` — Admin only: update order fulfillment status.

### Image Upload (`/api/upload`)
* `POST   /api/upload/product-image` — Multer file upload (field name: `productImage`, JWT protected).
* `GET    /api/upload/files` — List uploaded image files.
* `DELETE /api/upload/files/:filename` — Admin only: remove uploaded file.
