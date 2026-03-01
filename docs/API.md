# API Reference
## Café Lumière REST API — v1

| Field | Detail |
|---|---|
| **Document Version** | 1.0 |
| **API Version** | v1 |
| **Base URL (dev)** | `http://localhost:5258` |
| **Base URL (prod)** | `https://api.cafelumiere.com` |
| **Interactive Docs** | `{base_url}/scalar/` |
| **OpenAPI JSON** | `{base_url}/openapi/v1.json` |
| **Author** | Hocine Bechebil |
| **Last Updated** | 2026-03-01 |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Error Handling](#3-error-handling)
4. [Auth Endpoints](#4-auth-endpoints)
5. [Category Endpoints](#5-category-endpoints)
6. [Menu Item Endpoints](#6-menu-item-endpoints)
7. [Reservation Endpoints](#7-reservation-endpoints)
8. [Contact Message Endpoints](#8-contact-message-endpoints)
9. [Data Types Reference](#9-data-types-reference)

---

## 1. Overview

The Café Lumière API is a RESTful HTTP API built with ASP.NET Core 10. All requests and responses use `application/json`. Timestamps are in ISO 8601 UTC format. All identifiers are UUID v4 strings. Enum values are serialized as strings.

### Request Format

```
Content-Type: application/json
Authorization: Bearer <token>   (required for admin endpoints)
```

### Response Format

All successful responses return the resource or resource collection directly as the JSON body. Error responses return a structured object — see [Error Handling](#3-error-handling).

---

## 2. Authentication

Admin endpoints require a `Bearer` token obtained from `POST /api/auth/login`.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The following endpoints are **public** (no token required):
- `GET /api/categories`
- `GET /api/categories/{id}`
- `GET /api/menuitems`
- `GET /api/menuitems/{id}`
- `GET /api/menuitems/category/{categoryId}`
- `POST /api/reservations`
- `POST /api/contactmessages`
- `POST /api/auth/login`
- `POST /api/auth/register`

All other endpoints require a valid JWT token.

---

## 3. Error Handling

All errors return a JSON body with a consistent structure.

### Error Response Schema

```json
{
  "message": "Human-readable description of the error.",
  "errors": {
    "fieldName": ["Validation error message 1", "Validation error message 2"]
  }
}
```

The `errors` object is only present for `400 Bad Request` validation failures.

### HTTP Status Codes

| Code | Meaning | Trigger |
|---|---|---|
| `200 OK` | Request succeeded | Successful read or update |
| `201 Created` | Resource created | Successful `POST` |
| `400 Bad Request` | Validation failed | Invalid request body |
| `401 Unauthorized` | Authentication required or failed | Missing/expired/invalid JWT, wrong credentials |
| `404 Not Found` | Resource does not exist | ID references non-existent record |
| `409 Conflict` | Business rule violation | Deleting a category with menu items |

### Example — 400 Validation Error

```json
{
  "message": "Validation failed.",
  "errors": {
    "customerName": ["Customer name is required."],
    "partySize": ["Party size must be between 1 and 20."]
  }
}
```

---

## 4. Auth Endpoints

### `POST /api/auth/register`

Creates a new admin user account.

**Auth required:** No

**Request Body**

```json
{
  "fullName": "Karim Bechebil",
  "email": "admin@cafelumiere.com",
  "password": "SecurePass123"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `fullName` | string | Yes | 1–100 characters |
| `email` | string | Yes | Valid email format, must be unique |
| `password` | string | Yes | Min 8 chars, 1 uppercase, 1 lowercase, 1 digit |

**Response — `201 Created`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@cafelumiere.com",
  "fullName": "Karim Bechebil",
  "role": "Admin"
}
```

**Errors**

| Status | Condition |
|---|---|
| `400` | Validation failed |
| `409` | Email already registered |

---

### `POST /api/auth/login`

Authenticates an existing user and returns a JWT.

**Auth required:** No

**Request Body**

```json
{
  "email": "admin@cafelumiere.com",
  "password": "SecurePass123"
}
```

**Response — `200 OK`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@cafelumiere.com",
  "fullName": "Karim Bechebil",
  "role": "Admin"
}
```

**Errors**

| Status | Condition |
|---|---|
| `400` | Validation failed |
| `401` | Invalid credentials |

---

## 5. Category Endpoints

### `GET /api/categories`

Returns all categories ordered by `displayOrder` ascending.

**Auth required:** No

**Response — `200 OK`**

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nameEn": "Hot Drinks",
    "nameAr": "المشروبات الساخنة",
    "displayOrder": 1,
    "isActive": true
  }
]
```

---

### `GET /api/categories/{id}`

Returns a single category by its UUID.

**Auth required:** No

**Path Parameters**

| Parameter | Type | Description |
|---|---|---|
| `id` | UUID | Category identifier |

**Response — `200 OK`** — Single category object (same schema as above)

**Errors:** `404` if not found.

---

### `POST /api/categories`

Creates a new menu category.

**Auth required:** Yes

**Request Body**

```json
{
  "nameEn": "Pastries",
  "nameAr": "المعجنات",
  "displayOrder": 3,
  "isActive": true
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `nameEn` | string | Yes | 1–100 characters |
| `nameAr` | string | Yes | 1–100 characters |
| `displayOrder` | integer | Yes | ≥ 0 |
| `isActive` | boolean | No | Default `true` |

**Response — `201 Created`** — Created category object.

**Errors:** `400` for validation failures.

---

### `PUT /api/categories/{id}`

Fully replaces a category record.

**Auth required:** Yes

**Path Parameters:** `id` — UUID of the category.

**Request Body:** Same schema as `POST /api/categories`.

**Response — `200 OK`** — Updated category object.

**Errors:** `400` validation, `404` not found.

---

### `DELETE /api/categories/{id}`

Deletes a category.

**Auth required:** Yes

**Path Parameters:** `id` — UUID of the category.

**Response — `200 OK`** — Empty body.

**Errors**

| Status | Condition |
|---|---|
| `404` | Category not found |
| `409` | Category has associated menu items |

---

## 6. Menu Item Endpoints

### `GET /api/menuitems`

Returns all menu items including their category information.

**Auth required:** No

**Response — `200 OK`**

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "categoryId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "categoryNameEn": "Hot Drinks",
    "categoryNameAr": "المشروبات الساخنة",
    "nameEn": "Signature Espresso",
    "nameAr": "إسبريسو مميز",
    "descriptionEn": "Our signature double shot with a rich crema.",
    "descriptionAr": "شوت مزدوج مميز بقشدة غنية.",
    "price": 18.00,
    "imageUrl": "https://images.unsplash.com/photo-example",
    "isAvailable": true,
    "isFeatured": true,
    "displayOrder": 1,
    "createdAt": "2026-02-25T17:17:19Z",
    "updatedAt": "2026-02-25T17:17:19Z"
  }
]
```

---

### `GET /api/menuitems/{id}`

Returns a single menu item by UUID.

**Auth required:** No

**Response — `200 OK`** — Single menu item object (same schema as above).

**Errors:** `404` if not found.

---

### `GET /api/menuitems/category/{categoryId}`

Returns all menu items belonging to a specific category.

**Auth required:** No

**Path Parameters:** `categoryId` — UUID of the category.

**Response — `200 OK`** — Array of menu item objects.

**Errors:** `404` if the category does not exist.

---

### `POST /api/menuitems`

Creates a new menu item.

**Auth required:** Yes

**Request Body**

```json
{
  "categoryId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "nameEn": "Signature Espresso",
  "nameAr": "إسبريسو مميز",
  "descriptionEn": "Our signature double shot with a rich crema.",
  "descriptionAr": "شوت مزدوج مميز بقشدة غنية.",
  "price": 18.00,
  "imageUrl": "https://images.unsplash.com/photo-example",
  "isAvailable": true,
  "isFeatured": false,
  "displayOrder": 1
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `categoryId` | UUID | Yes | Must reference an existing category |
| `nameEn` | string | Yes | 1–200 characters |
| `nameAr` | string | Yes | 1–200 characters |
| `descriptionEn` | string | No | Max 1000 characters |
| `descriptionAr` | string | No | Max 1000 characters |
| `price` | decimal | Yes | > 0, max 2 decimal places |
| `imageUrl` | string | No | Valid URL |
| `isAvailable` | boolean | No | Default `true` |
| `isFeatured` | boolean | No | Default `false` |
| `displayOrder` | integer | No | Default `0` |

**Response — `201 Created`** — Created menu item object.

**Errors:** `400` validation, `404` if `categoryId` does not exist.

---

### `PUT /api/menuitems/{id}`

Fully replaces a menu item record.

**Auth required:** Yes

**Request Body:** Same schema as `POST /api/menuitems`.

**Response — `200 OK`** — Updated menu item object.

**Errors:** `400` validation, `404` not found.

---

### `DELETE /api/menuitems/{id}`

Deletes a menu item.

**Auth required:** Yes

**Response — `200 OK`** — Empty body.

**Errors:** `404` if not found.

---

## 7. Reservation Endpoints

### `POST /api/reservations`

Submits a new table reservation. This endpoint is publicly accessible — no authentication required.

**Auth required:** No

**Request Body**

```json
{
  "customerName": "Sara Mansouri",
  "phone": "+213555123456",
  "email": "sara@example.com",
  "date": "2026-03-15",
  "time": "19:30:00",
  "partySize": 4,
  "specialRequests": "Window table preferred, nut allergy."
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `customerName` | string | Yes | 1–200 characters |
| `phone` | string | Yes | 1–20 characters |
| `email` | string | No | Valid email format |
| `date` | date (`YYYY-MM-DD`) | Yes | Today or future |
| `time` | time (`HH:mm:ss`) | Yes | Valid time of day |
| `partySize` | integer | Yes | 1–20 inclusive |
| `specialRequests` | string | No | Max 500 characters |

**Response — `201 Created`**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "customerName": "Sara Mansouri",
  "phone": "+213555123456",
  "email": "sara@example.com",
  "date": "2026-03-15",
  "time": "19:30:00",
  "partySize": 4,
  "specialRequests": "Window table preferred, nut allergy.",
  "status": "Pending",
  "whatsAppNotified": false,
  "createdAt": "2026-03-01T14:32:10Z"
}
```

**Errors:** `400` for validation failures.

---

### `GET /api/reservations`

Returns all reservations.

**Auth required:** Yes

**Response — `200 OK`** — Array of reservation objects (same schema as the `POST` response).

---

### `GET /api/reservations/{id}`

Returns a single reservation by UUID.

**Auth required:** Yes

**Response — `200 OK`** — Single reservation object.

**Errors:** `404` if not found.

---

### `GET /api/reservations/date/{date}`

Returns all reservations for a specific date.

**Auth required:** Yes

**Path Parameters**

| Parameter | Type | Description | Example |
|---|---|---|---|
| `date` | `YYYY-MM-DD` | The date to filter by | `2026-03-15` |

**Response — `200 OK`** — Array of reservation objects.

---

### `GET /api/reservations/status/{status}`

Returns all reservations with a specific status.

**Auth required:** Yes

**Path Parameters**

| Parameter | Type | Values |
|---|---|---|
| `status` | string (enum) | `Pending`, `Confirmed`, `Cancelled`, `Completed` |

**Response — `200 OK`** — Array of reservation objects.

---

### `PATCH /api/reservations/{id}/status`

Updates the status of a reservation.

**Auth required:** Yes

**Request Body**

```json
{
  "status": "Confirmed"
}
```

| Value | Description |
|---|---|
| `Pending` | Awaiting admin review |
| `Confirmed` | Reservation accepted |
| `Cancelled` | Reservation declined or cancelled |
| `Completed` | Customer has visited |

**Response — `200 OK`** — Updated reservation object.

**Errors:** `400` invalid status value, `404` not found.

---

### `DELETE /api/reservations/{id}`

Deletes a reservation record.

**Auth required:** Yes

**Response — `200 OK`** — Empty body.

**Errors:** `404` if not found.

---

## 8. Contact Message Endpoints

### `POST /api/contactmessages`

Submits a contact inquiry from the public contact form.

**Auth required:** No

**Request Body**

```json
{
  "name": "Youssef Hakim",
  "email": "youssef@example.com",
  "subject": "Private event inquiry",
  "message": "Hello, I would like to inquire about booking the venue for a private dinner on April 5th for 20 guests."
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | Yes | 1–200 characters |
| `email` | string | Yes | Valid email format |
| `subject` | string | Yes | 1–200 characters |
| `message` | string | Yes | 1–2000 characters |

**Response — `201 Created`**

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Youssef Hakim",
  "email": "youssef@example.com",
  "subject": "Private event inquiry",
  "message": "Hello, I would like to inquire about booking the venue for a private dinner on April 5th for 20 guests.",
  "isRead": false,
  "createdAt": "2026-03-01T10:15:00Z"
}
```

**Errors:** `400` for validation failures.

---

### `GET /api/contactmessages`

Returns all contact messages ordered by `createdAt` descending (newest first).

**Auth required:** Yes

**Response — `200 OK`** — Array of contact message objects (same schema as the `POST` response).

---

### `GET /api/contactmessages/{id}`

Returns a single contact message by UUID.

**Auth required:** Yes

**Response — `200 OK`** — Single contact message object.

**Errors:** `404` if not found.

---

### `PATCH /api/contactmessages/{id}/read`

Marks a contact message as read.

**Auth required:** Yes

**Request Body:** Empty.

**Response — `200 OK`** — Updated contact message object with `isRead: true`.

**Errors:** `404` if not found.

---

### `DELETE /api/contactmessages/{id}`

Deletes a contact message.

**Auth required:** Yes

**Response — `200 OK`** — Empty body.

**Errors:** `404` if not found.

---

## 9. Data Types Reference

### AuthResponse

```typescript
interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Staff';
}
```

### CategoryResponse

```typescript
interface CategoryResponse {
  id: string;           // UUID
  nameEn: string;
  nameAr: string;
  displayOrder: number;
  isActive: boolean;
}
```

### MenuItemResponse

```typescript
interface MenuItemResponse {
  id: string;           // UUID
  categoryId: string;   // UUID
  categoryNameEn: string;
  categoryNameAr: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;    // ISO 8601 UTC
  updatedAt: string;    // ISO 8601 UTC
}
```

### ReservationResponse

```typescript
interface ReservationResponse {
  id: string;           // UUID
  customerName: string;
  phone: string;
  email: string | null;
  date: string;         // YYYY-MM-DD
  time: string;         // HH:mm:ss
  partySize: number;
  specialRequests: string | null;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  whatsAppNotified: boolean;
  createdAt: string;    // ISO 8601 UTC
}
```

### ContactMessageResponse

```typescript
interface ContactMessageResponse {
  id: string;           // UUID
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;    // ISO 8601 UTC
}
```

### ErrorResponse

```typescript
interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;  // Present on 400 only
}
```
