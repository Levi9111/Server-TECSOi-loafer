# TEKSOi Leather — Backend Server

## Overview

The backend is a lightweight **Express.js + TypeScript** server with **MongoDB** as the database. It handles order processing for the storefront and provides management endpoints for the admin dashboard.

---

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Runtime     | Node.js (v20+)       |
| Framework   | Express.js           |
| Language    | TypeScript           |
| Database    | MongoDB (Mongoose)   |
| Email       | Nodemailer (SMTP)    |
| Container   | Docker               |

---

## Environment Variables (`.env`)

The server requires the following environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...

# SMTP config for Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# Manager email — receives all order notifications
MANAGER_EMAIL=...

# Admin credentials (seeded to DB on startup)
ADMIN_EMAIL=admin@teksoileather.com
ADMIN_PASSWORD=your-secure-password
```

---

## Getting Started

### Running Locally
1. Navigate to the server directory:
   ```bash
   cd server-teksoi-leather
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start in development mode:
   ```bash
   npm run dev
   ```

### Running with Docker
The server is fully containerized. To run it using Docker Compose:
```bash
cd server-teksoi-leather
docker compose up --build
```

---

## Authentication & Seeding

- **Admin Seeding**: On every startup, the server checks if a user with `ADMIN_EMAIL` exists. If not, it creates one with `ADMIN_PASSWORD`. If it exists but the password differs from `.env`, it updates the password.
- **Login**: Simple email/password validation. No JWT is used currently for simplicity.

---

## API Endpoints

### Storefront Endpoints
- `POST /api/orders`: Create a new order.

### Admin Endpoints
- `POST /api/admin/login`: Admin login.
- `GET /api/admin/orders`: List all orders (supports `status`, `search`, `page`, `limit` queries).
- `GET /api/admin/orders/:id`: Get single order details.
- `PATCH /api/admin/orders/:id/status`: Update order status.
- `GET /api/admin/stats`: Dashboard statistics.

---

## Project Structure

```
src/
├── controllers/    # Request handlers
├── models/         # Mongoose schemas
├── routes/         # API route definitions
├── services/       # Business logic (e.g., Email)
├── middleware/     # Express middlewares
├── types/          # TypeScript interfaces
└── index.ts        # App entry point & seeding logic
```
