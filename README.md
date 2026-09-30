# SupportFlow

**SupportFlow** is a production-oriented, full-stack enterprise support ticket management platform built with **Node.js, Express, MongoDB, React, Vite, and Tailwind CSS**.

The project demonstrates **role-based access control (RBAC), workflow state machines, API validation, audit logging, server-side search and filtering, pagination, and automated integration testing**.

---

## ✨ Features

- **Role-Based Access Control**
  - `CUSTOMER`
  - `AGENT`
  - `ADMIN`

- **Ticket Workflow Engine**
  - Explicit finite-state workflow
  - Validates every status transition
  - Prevents invalid state jumps

- **Audit Logging**
  - Ticket creation
  - Status changes
  - Assignments
  - Priority changes
  - Comments

---

## 🏗️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Express Validator
- Vitest
- Supertest

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 7+ or MongoDB Atlas
- npm

---

## 1. Clone the Repository

```bash
git clone https://github.com/rookiedev07/supportflow.git
cd supportflow
```

## 2. Install Dependencies

```bash
npm run install:all
```

Or install separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## 3. Environment Configuration

### Backend

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/supportflow
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 4. Seed the Database

```bash
npm run seed --prefix backend
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@supportflow.dev` | `Password123!` |
| Support Agent | `sarah.chen@supportflow.dev` | `Password123!` |
| Support Agent | `alex.rivera@supportflow.dev` | `Password123!` |
| Customer | `david.kim@fintechlabs.com` | `Password123!` |
| Customer | `elena.rostova@acmecorp.io` | `Password123!` |
| Customer | `sophia.martinez@cloudscale.net` | `Password123!` |

> These credentials are intended for local development and demonstration only.

---

## ▶️ Running the Application

### Run Backend and Frontend Together

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Frontend:

```text
http://localhost:5173
```

### Run Services Separately

Backend:

```bash
npm run dev:backend
```

Frontend:

```bash
npm run dev:frontend
```

---

## 🧪 Testing

Run the backend test suite:

```bash
npm run test --prefix backend
```

Tests cover:

- Authentication
- User registration
- Duplicate detection
- JWT authentication
- RBAC
- Ticket isolation
- Ticket creation
- Workflow transitions
- Invalid state transitions
- Comments
- Activity logging
- Search
- Filtering
- Pagination

---

## 🏭 Production Build

```bash
npm run build --prefix frontend
```

The production build is generated in:

```text
frontend/dist
```

---

## 📄 API Documentation

Full REST API documentation is available in:

```text
API.md
```

---

## ⭐ SupportFlow

A full-stack enterprise support ticket management system demonstrating modern backend architecture, RBAC, workflow management, audit logging, testing, and React-based UI development.
