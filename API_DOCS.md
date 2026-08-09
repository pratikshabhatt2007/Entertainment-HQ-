# EventSphere API Documentation 📖

Comprehensive API documentation for the **EventSphere** backend service.

---

## 📋 Base URL

```http
http://localhost:5000/api
```

---

## 🏥 Health Check

### 1. GET `/health`
- **Auth Requirement**: Public
- **Description**: Verify backend server availability and status.
- **Request Body**: None

#### Success Response (`200 OK`)
```json
{
  "status": "ok",
  "timestamp": "2026-08-06T10:17:00.000Z"
}
```

---

## 🔑 1. Authentication Endpoints (`/auth`)

### 1.1 POST `/auth/register`
- **Auth Requirement**: Public
- **Description**: Registers a new user with Supabase Auth and populates the `public.users` table.
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "role": "attendee"
}
```
*Note: `role` must be either `"attendee"` or `"admin"`. Defaults to `"attendee"`.*

#### Success Response (`201 Created`)
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "attendee",
    "created_at": "2026-08-06T10:00:00.000Z"
  }
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "error": "User already registered"
}
```

---

### 1.2 POST `/auth/login`
- **Auth Requirement**: Public
- **Description**: Authenticates user credentials via Supabase Auth and returns an access token & profile.
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```

#### Success Response (`200 OK`)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "v1.N2Fi...",
  "user": {
    "id": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "attendee",
    "created_at": "2026-08-06T10:00:00.000Z"
  }
}
```

#### Error Response (`401 Unauthorized`)
```json
{
  "error": "Invalid login credentials"
}
```

---

### 1.3 GET `/auth/me`
- **Auth Requirement**: Protected (Bearer Token)
- **Description**: Retrieves current logged-in user details verified from JWT header.
- **Headers**:
  - `Authorization`: `Bearer <token>`

#### Success Response (`200 OK`)
```json
{
  "user": {
    "id": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "attendee",
    "created_at": "2026-08-06T10:00:00.000Z"
  }
}
```

#### Error Response (`401 Unauthorized`)
```json
{
  "error": "No authorization token provided"
}
```

---

## 📅 2. Event Endpoints (`/events`)

### 2.1 GET `/events`
- **Auth Requirement**: Public
- **Description**: Returns list of all events ordered by `event_date` ascending.
- **Query Parameters (Optional)**:
  - `search` (string): Title search filter (case-insensitive)
  - `category` (string): Category filter (e.g. `Technology`, `Music`)
  - `date` (string): Filter events occurring on or after date (`YYYY-MM-DD`)

#### Success Response (`200 OK`)
```json
{
  "events": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "AI Developer Summit 2026",
      "description": "Join leading AI engineers for hands-on sessions.",
      "category": "Technology",
      "event_date": "2026-09-15",
      "event_time": "10:00:00",
      "location": "Convention Center, SF",
      "capacity": 200,
      "image_url": "https://images.unsplash.com/photo-1540575467063",
      "created_by": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
      "created_at": "2026-08-06T10:00:00.000Z"
    }
  ]
}
```

---

### 2.2 GET `/events/:id`
- **Auth Requirement**: Public
- **Description**: Returns details for a single event by UUID.

#### Success Response (`200 OK`)
```json
{
  "event": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "AI Developer Summit 2026",
    "description": "Join leading AI engineers for hands-on sessions.",
    "category": "Technology",
    "event_date": "2026-09-15",
    "event_time": "10:00:00",
    "location": "Convention Center, SF",
    "capacity": 200,
    "image_url": "https://images.unsplash.com/photo-1540575467063",
    "created_by": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
    "created_at": "2026-08-06T10:00:00.000Z"
  }
}
```

#### Error Response (`404 Not Found`)
```json
{
  "error": "Event not found"
}
```

---

### 2.3 POST `/events`
- **Auth Requirement**: Protected + Admin Only
- **Description**: Creates a new event. Sets `created_by` to authenticated admin user ID.
- **Headers**:
  - `Authorization`: `Bearer <admin_token>`
- **Request Body**:
```json
{
  "title": "Cloud Native Masterclass",
  "description": "Deep dive into Kubernetes and serverless architectures.",
  "category": "Workshop",
  "event_date": "2026-10-01",
  "event_time": "14:00",
  "location": "Tech Hub & Online",
  "capacity": 150,
  "image_url": "https://images.unsplash.com/photo-1511578314322"
}
```

#### Success Response (`201 Created`)
```json
{
  "message": "Event created successfully",
  "event": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Cloud Native Masterclass",
    "description": "Deep dive into Kubernetes and serverless architectures.",
    "category": "Workshop",
    "event_date": "2026-10-01",
    "event_time": "14:00:00",
    "location": "Tech Hub & Online",
    "capacity": 150,
    "image_url": "https://images.unsplash.com/photo-1511578314322",
    "created_by": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
    "created_at": "2026-08-06T10:05:00.000Z"
  }
}
```

#### Error Response (`403 Forbidden`)
```json
{
  "error": "Access denied. Admin privileges required."
}
```

---

### 2.4 PUT `/events/:id`
- **Auth Requirement**: Protected + Admin Only
- **Description**: Updates fields for an existing event.
- **Request Body**: (Provide fields to update)
```json
{
  "title": "Updated Cloud Native Masterclass",
  "capacity": 180
}
```

#### Success Response (`200 OK`)
```json
{
  "message": "Event updated successfully",
  "event": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Updated Cloud Native Masterclass",
    "capacity": 180, ...
  }
}
```

---

### 2.5 DELETE `/events/:id`
- **Auth Requirement**: Protected + Admin Only
- **Description**: Deletes an event by ID.

#### Success Response (`200 OK`)
```json
{
  "message": "Event deleted successfully"
}
```

---

### 2.6 GET `/events/:id/attendees`
- **Auth Requirement**: Protected + Admin Only
- **Description**: Returns all user registrations joined with attendee names and emails for the specified event.

#### Success Response (`200 OK`)
```json
{
  "event": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Updated Cloud Native Masterclass"
  },
  "totalAttendees": 1,
  "attendees": [
    {
      "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
      "ticket_id": "TCKT-8F3A2B1C",
      "status": "registered",
      "registered_at": "2026-08-06T10:10:00.000Z",
      "users": {
        "id": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  ]
}
```

---

## 🎟️ 3. Registration Endpoints (`/registrations`)

### 3.1 POST `/registrations`
- **Auth Requirement**: Protected (Attendee / User Token)
- **Description**: Registers logged-in user for an event, checks remaining capacity, prevents duplicates, and generates a unique `TCKT-XXXX` ID.
- **Request Body**:
```json
{
  "event_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

#### Success Response (`201 Created`)
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    "user_id": "96b7efe0-859d-43c0-aa15-b4e51fa520cd",
    "event_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "status": "registered",
    "ticket_id": "TCKT-8F3A2B1C",
    "registered_at": "2026-08-06T10:10:00.000Z"
  },
  "event": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "AI Developer Summit 2026"
  }
}
```

#### Error Response (`400 Bad Request`)
```json
{
  "error": "You are already registered for this event."
}
```

---

### 3.2 PUT `/registrations/:id/cancel`
- **Auth Requirement**: Protected (Ticket Owner or Admin)
- **Description**: Cancels a registration and updates status to `"cancelled"`.

#### Success Response (`200 OK`)
```json
{
  "message": "Registration cancelled successfully",
  "registration": {
    "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    "status": "cancelled",
    "ticket_id": "TCKT-8F3A2B1C"
  }
}
```

---

### 3.3 GET `/registrations/my`
- **Auth Requirement**: Protected
- **Description**: Retrieves all registrations for the logged-in user joined with event details.

#### Success Response (`200 OK`)
```json
{
  "registrations": [
    {
      "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
      "status": "registered",
      "ticket_id": "TCKT-8F3A2B1C",
      "registered_at": "2026-08-06T10:10:00.000Z",
      "events": {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "title": "AI Developer Summit 2026",
        "category": "Technology",
        "event_date": "2026-09-15",
        "event_time": "10:00:00",
        "location": "Convention Center, SF",
        "capacity": 200
      }
    }
  ]
}
```

---

### 3.4 GET `/registrations/my/history`
- **Auth Requirement**: Protected
- **Description**: Retrieves past event registrations for the logged-in user where `event_date` is earlier than today.

#### Success Response (`200 OK`)
```json
{
  "registrations": []
}
```
