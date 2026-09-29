# SupportFlow — REST API Documentation

SupportFlow provides a versioned, secure REST API for managing support tickets, workflow status transitions, comments, activity history, users, and operational analytics.

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** `Bearer <JWT_TOKEN>` in the `Authorization` header

---

## Response Envelope Standard

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional descriptive message",
  "meta": {
    "total": 48,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": {
    "fieldName": "Specific field validation failure"
  }
}
```

---

## Authentication Endpoints

### 1. Register User
- **Endpoint:** `POST /api/v1/auth/register`
- **Auth Required:** No
- **Rate Limit:** 100 requests / 15 minutes
- **Request Body:**
```json
{
  "name": "Elena Rostova",
  "email": "elena@acme.com",
  "password": "Password123!",
  "role": "CUSTOMER"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6724abc...",
      "name": "Elena Rostova",
      "email": "elena@acme.com",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2026-09-29T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```
- **Errors:**
  - `400 Bad Request` — Validation failure (weak password, invalid email format, missing required fields)
  - `409 Conflict` — Email already registered

---

### 2. Login User
- **Endpoint:** `POST /api/v1/auth/login`
- **Auth Required:** No
- **Rate Limit:** 100 requests / 15 minutes
- **Request Body:**
```json
{
  "email": "admin@supportflow.dev",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6724abc...",
      "name": "Marcus Vance",
      "email": "admin@supportflow.dev",
      "role": "ADMIN",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```
- **Errors:**
  - `401 Unauthorized` — Invalid email or password
  - `403 Forbidden` — Account deactivated

---

### 3. Get Current User Profile
- **Endpoint:** `GET /api/v1/auth/me`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6724abc...",
      "name": "Marcus Vance",
      "email": "admin@supportflow.dev",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-09-29T10:00:00.000Z"
    }
  }
}
```
- **Errors:**
  - `401 Unauthorized` — Missing, malformed, or expired token

---

## Ticket Endpoints

### 1. List Tickets
- **Endpoint:** `GET /api/v1/tickets`
- **Auth Required:** Yes
- **Query Parameters:**
  - `page` (integer, default: 1)
  - `limit` (integer, default: 10, max: 100)
  - `status` (`OPEN` | `IN_PROGRESS` | `WAITING_FOR_CUSTOMER` | `RESOLVED` | `CLOSED`)
  - `priority` (`Low` | `Medium` | `High` | `Critical`)
  - `category` (`Technical` | `Billing` | `Account` | `Security` | `General`)
  - `search` (string — searches ticketNumber, title, and description)
  - `sortBy` (`createdAt` | `updatedAt` | `title` | `priority` | `status`)
  - `order` (`asc` | `desc`, default: `desc`)
  - `assignedOnly` (boolean — filters tickets assigned to the authenticated agent)
- **Role Scoping:**
  - `CUSTOMER`: Automatically scoped to own tickets only (`createdBy = user._id`)
  - `AGENT` & `ADMIN`: Global queue access
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "_id": "6724b123...",
        "ticketNumber": "SF-1001",
        "title": "Stripe webhook signature verification failure on recurring renewals",
        "description": "...",
        "category": "Billing",
        "priority": "Critical",
        "status": "IN_PROGRESS",
        "createdBy": { "_id": "...", "name": "David Kim", "email": "david@fintechlabs.com" },
        "assignedTo": { "_id": "...", "name": "Sarah Chen", "email": "sarah@supportflow.dev" },
        "createdAt": "2026-09-29T08:30:00.000Z",
        "updatedAt": "2026-09-29T09:15:00.000Z"
      }
    ]
  },
  "meta": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### 2. Create Ticket
- **Endpoint:** `POST /api/v1/tickets`
- **Auth Required:** Yes (`CUSTOMER` or `ADMIN`)
- **Request Body:**
```json
{
  "title": "OAuth2 refresh token revoked prematurely after cluster failover",
  "description": "During our scheduled Kubernetes maintenance, tokens older than 12 hours fail.",
  "category": "Security",
  "priority": "High"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "ticket": {
      "_id": "6724c987...",
      "ticketNumber": "SF-1009",
      "title": "OAuth2 refresh token revoked prematurely after cluster failover",
      "category": "Security",
      "priority": "High",
      "status": "OPEN",
      "createdBy": { "_id": "...", "name": "Elena Rostova" },
      "assignedTo": null,
      "createdAt": "2026-09-29T11:00:00.000Z"
    }
  }
}
```
- **Errors:**
  - `400 Bad Request` — Missing or invalid title (min 3 chars), description (min 10 chars), category, or priority

---

### 3. Get Ticket By ID
- **Endpoint:** `GET /api/v1/tickets/:id`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "_id": "6724c987...",
      "ticketNumber": "SF-1001",
      "title": "Stripe webhook signature verification failure on recurring renewals",
      "description": "...",
      "category": "Billing",
      "priority": "Critical",
      "status": "IN_PROGRESS",
      "createdBy": { "_id": "...", "name": "David Kim", "email": "david@fintechlabs.com" },
      "assignedTo": { "_id": "...", "name": "Sarah Chen", "email": "sarah@supportflow.dev" }
    }
  }
}
```
- **Errors:**
  - `400 Bad Request` — Invalid MongoDB ObjectId format
  - `403 Forbidden` — Customer attempting to view another customer's ticket
  - `404 Not Found` — Ticket does not exist

---

### 4. Update Ticket Details
- **Endpoint:** `PATCH /api/v1/tickets/:id`
- **Auth Required:** Yes
- **Permissions:**
  - `CUSTOMER`: Can edit title, description, category, and priority only while in `OPEN` status
  - `AGENT`: Can edit category and priority
  - `ADMIN`: Full edit access
- **Request Body (all optional):**
```json
{
  "title": "Updated Ticket Title",
  "description": "Updated incident reproduction steps",
  "category": "Technical",
  "priority": "High"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket updated successfully",
  "data": {
    "ticket": { ... }
  }
}
```

---

### 5. Transition Ticket Status
- **Endpoint:** `PATCH /api/v1/tickets/:id/status`
- **Auth Required:** Yes
- **Workflow State Machine:**
  - `OPEN` -> `IN_PROGRESS`, `CLOSED`
  - `IN_PROGRESS` -> `WAITING_FOR_CUSTOMER`, `RESOLVED`, `CLOSED`
  - `WAITING_FOR_CUSTOMER` -> `IN_PROGRESS`, `RESOLVED`, `CLOSED`
  - `RESOLVED` -> `CLOSED`, `IN_PROGRESS`
  - `CLOSED` -> `OPEN` (Admin only)
- **Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket status updated successfully",
  "data": {
    "ticket": { ... }
  }
}
```
- **Errors:**
  - `400 Bad Request` — Invalid status transition (e.g. attempting to jump from `OPEN` to `RESOLVED`)

---

### 6. Assign Ticket
- **Endpoint:** `PATCH /api/v1/tickets/:id/assign`
- **Auth Required:** Yes (`ADMIN` role)
- **Request Body:**
```json
{
  "assignedTo": "6724a1b2c3d4..."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket assigned successfully",
  "data": {
    "ticket": { ... }
  }
}
```

---

### 7. Delete Ticket
- **Endpoint:** `DELETE /api/v1/tickets/:id`
- **Auth Required:** Yes (`ADMIN` role)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Ticket deleted successfully",
  "data": {
    "id": "6724c987..."
  }
}
```

---

## Comments and Activity Endpoints

### 1. Add Comment
- **Endpoint:** `POST /api/v1/tickets/:id/comments`
- **Auth Required:** Yes
- **Permissions:**
  - Customers may only comment on tickets they created
  - Agents and Admins may comment on any ticket
  - Note: Customer reply automatically transitions tickets in `WAITING_FOR_CUSTOMER` back to `IN_PROGRESS`
- **Request Body:**
```json
{
  "message": "We have uploaded the requested gateway proxy logs to our S3 bucket."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "_id": "6724f111...",
      "ticket": "6724c987...",
      "author": { "_id": "...", "name": "Elena Rostova", "role": "CUSTOMER" },
      "message": "We have uploaded the requested gateway proxy logs...",
      "createdAt": "2026-09-29T11:30:00.000Z"
    }
  }
}
```

---

### 2. List Ticket Comments
- **Endpoint:** `GET /api/v1/tickets/:id/comments`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "comments": [ ... ]
  }
}
```

---

### 3. Get Ticket Audit Activity Trail
- **Endpoint:** `GET /api/v1/tickets/:id/activity`
- **Auth Required:** Yes
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "6724e555...",
        "ticket": "6724c987...",
        "action": "STATUS_CHANGED",
        "performedBy": { "_id": "...", "name": "Sarah Chen", "role": "AGENT" },
        "previousValue": "OPEN",
        "newValue": "IN_PROGRESS",
        "details": "Status changed from OPEN to IN_PROGRESS",
        "createdAt": "2026-09-29T09:00:00.000Z"
      }
    ]
  }
}
```

---

## User Management Endpoints (Admin Only)

### 1. List Users
- **Endpoint:** `GET /api/v1/users`
- **Auth Required:** Yes (`ADMIN` role)
- **Query Parameters:** `page`, `limit`, `role`, `isActive`, `search`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [ ... ]
  },
  "meta": { "total": 6, "page": 1, "limit": 10, "totalPages": 1 }
}
```

---

### 2. Update User Role & Status
- **Endpoint:** `PATCH /api/v1/users/:id`
- **Auth Required:** Yes (`ADMIN` role)
- **Request Body:**
```json
{
  "role": "AGENT",
  "isActive": true
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": { ... }
  }
}
```
- **Errors:**
  - `400 Bad Request` — Administrator cannot demote or deactivate their own active account

---

### 3. Delete User
- **Endpoint:** `DELETE /api/v1/users/:id`
- **Auth Required:** Yes (`ADMIN` role)

---

### 4. List Assignees
- **Endpoint:** `GET /api/v1/users/assignees`
- **Auth Required:** Yes
- **Response (200 OK):** Returns all active agents and administrators available for ticket assignment.

---

## Analytics Endpoints

### 1. Get Role-Adaptive Dashboard Telemetry
- **Endpoint:** `GET /api/v1/analytics/dashboard`
- **Auth Required:** Yes
- **Response (200 OK):** Returns role-tailored metrics, status distributions, volume trends, agent workload, and real-time activity streams.
