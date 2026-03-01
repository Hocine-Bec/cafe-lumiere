# Software Requirements Specification (SRS)
## Café Lumière — Restaurant & Café Management Platform

| Field | Detail |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Final |
| **Author** | Hocine Bechebil |
| **Standard** | IEEE 830 (adapted) |
| **Last Updated** | 2026-03-01 |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [Data Requirements](#6-data-requirements)
7. [Security Requirements](#7-security-requirements)
8. [System Constraints](#8-system-constraints)
9. [Acceptance Criteria](#9-acceptance-criteria)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for Café Lumière. It serves as the authoritative reference for system behavior, data contracts, and quality standards during development and verification.

### 1.2 Scope

The Café Lumière system consists of:

- **REST API** — A .NET 10 Web API providing all data services.
- **Web Frontend** — A React 18 + TypeScript single-page application.
- **PostgreSQL Database** — Persistent storage for all application data.

The system supports two user roles: **Public Visitor** (unauthenticated) and **Admin User** (authenticated via JWT).

### 1.3 Definitions

| Term | Definition |
|---|---|
| **SPA** | Single-Page Application — the frontend is loaded once and navigates without full page reloads |
| **JWT** | JSON Web Token — a signed token used for stateless authentication |
| **DTO** | Data Transfer Object — a typed contract for API request and response bodies |
| **EF Core** | Entity Framework Core — the ORM used for database access |
| **Result Pattern** | A `Result<T>` return type that encapsulates success/failure without using exceptions for control flow |
| **RTL** | Right-to-Left — layout direction used for Arabic language content |
| **LTR** | Left-to-Right — layout direction used for English language content |
| **UoW** | Unit of Work — a pattern that coordinates repository operations within a single database transaction |

### 1.4 References

- ASP.NET Core 10 Documentation
- React 18 Documentation
- Entity Framework Core 10 Documentation
- Tailwind CSS v4 Documentation
- Framer Motion Documentation
- IEEE 830-1998 Recommended Practice for Software Requirements Specifications

---

## 2. Overall Description

### 2.1 Product Perspective

Café Lumière is a standalone, self-hosted web application. It has no dependency on external SaaS platforms for core functionality. The system follows a standard client–server architecture where the React SPA communicates with the .NET REST API over HTTPS, and the API persists data to a PostgreSQL database.

```
┌──────────────────────────┐          ┌─────────────────────────────┐
│     React SPA (Vite)     │  HTTPS   │     .NET 10 REST API        │
│  - Public Pages          │◄────────►│  - Controllers              │
│  - Admin Panel           │  /api/*  │  - Application Services     │
│  - i18n (EN / AR)        │          │  - Infrastructure Layer     │
└──────────────────────────┘          └──────────────┬──────────────┘
                                                     │
                                          ┌──────────▼──────────┐
                                          │   PostgreSQL DB     │
                                          │   (EF Core / Npgsql)│
                                          └─────────────────────┘
```

### 2.2 Product Functions

The system provides the following top-level functions:

| Function | User Role |
|---|---|
| Browse bilingual menu by category | Public |
| View full menu item details | Public |
| Submit a table reservation | Public |
| Submit a contact inquiry | Public |
| Authenticate as admin | Admin |
| Manage menu items (CRUD) | Admin |
| Manage menu categories (CRUD) | Admin |
| View and manage reservations | Admin |
| Read and manage contact messages | Admin |
| View operational dashboard | Admin |

### 2.3 User Characteristics

| Role | Technical Level | Access Method |
|---|---|---|
| Public Visitor | Non-technical | Browser (mobile-first) |
| Admin User | Low-to-moderate | Browser (desktop-primary) |

### 2.4 Operating Environment

- **Frontend:** Deployed on Vercel CDN; any modern browser (Chrome, Firefox, Safari, Edge) with ES2020+ support.
- **Backend:** Deployed on a Linux container (Railway/Render); .NET 10 runtime.
- **Database:** PostgreSQL 15+ managed instance.
- **Minimum browser support:** Last 2 versions of major browsers; no IE11 support.

---

## 3. Functional Requirements

### 3.1 Authentication Module

| ID | Requirement |
|---|---|
| SRS-AUTH-01 | The system shall expose `POST /api/auth/register` to create a new admin user with FullName, Email, and Password. |
| SRS-AUTH-02 | The system shall expose `POST /api/auth/login` to authenticate an existing user and return a signed JWT. |
| SRS-AUTH-03 | Passwords shall be validated to be at least 8 characters and to contain at least one uppercase letter, one lowercase letter, and one digit. |
| SRS-AUTH-04 | The JWT shall encode the user's Id, Email, and Role claims and expire after the duration specified in `JWT_LIFETIME_MINUTES`. |
| SRS-AUTH-05 | All admin-facing endpoints shall respond with `401 Unauthorized` when called without a valid Bearer token. |
| SRS-AUTH-06 | Login with incorrect credentials shall return `401 Unauthorized` with a generic error message (no information leak). |

### 3.2 Category Module

| ID | Requirement |
|---|---|
| SRS-CAT-01 | The system shall expose `GET /api/categories` (public) returning all categories ordered by `DisplayOrder`. |
| SRS-CAT-02 | The system shall expose `GET /api/categories/{id}` (public) returning a single category by GUID. |
| SRS-CAT-03 | The system shall expose `POST /api/categories` (admin) to create a category with NameEn, NameAr, DisplayOrder, and IsActive fields. |
| SRS-CAT-04 | The system shall expose `PUT /api/categories/{id}` (admin) to fully update a category record. |
| SRS-CAT-05 | The system shall expose `DELETE /api/categories/{id}` (admin) to delete a category. |
| SRS-CAT-06 | Deleting a category that has associated menu items shall return `409 Conflict`. |

### 3.3 Menu Item Module

| ID | Requirement |
|---|---|
| SRS-MENU-01 | The system shall expose `GET /api/menuitems` (public) returning all menu items with their category. |
| SRS-MENU-02 | The system shall expose `GET /api/menuitems/{id}` (public) returning a single item by GUID. |
| SRS-MENU-03 | The system shall expose `GET /api/menuitems/category/{categoryId}` (public) returning items belonging to a category. |
| SRS-MENU-04 | The system shall expose `POST /api/menuitems` (admin) to create a menu item. Required fields: NameEn, NameAr, Price, CategoryId. Optional: DescriptionEn, DescriptionAr, ImageUrl, IsAvailable, IsFeatured, DisplayOrder. |
| SRS-MENU-05 | The system shall expose `PUT /api/menuitems/{id}` (admin) to fully update a menu item. |
| SRS-MENU-06 | The system shall expose `DELETE /api/menuitems/{id}` (admin) to delete a menu item. |
| SRS-MENU-07 | Price shall be validated as a positive decimal with a maximum of 2 decimal places. |
| SRS-MENU-08 | A request referencing a non-existent CategoryId shall return `404 Not Found`. |

### 3.4 Reservation Module

| ID | Requirement |
|---|---|
| SRS-RES-01 | The system shall expose `POST /api/reservations` (public, anonymous) to create a new reservation. |
| SRS-RES-02 | Required reservation fields: CustomerName, Phone, Date, Time, PartySize. Optional: Email, SpecialRequests. |
| SRS-RES-03 | PartySize shall be validated as an integer between 1 and 20 inclusive. |
| SRS-RES-04 | Date shall be validated as today or a future date. |
| SRS-RES-05 | New reservations shall be created with `Status = Pending` and `WhatsAppNotified = false`. |
| SRS-RES-06 | The system shall expose `GET /api/reservations` (admin) returning all reservations. |
| SRS-RES-07 | The system shall expose `GET /api/reservations/date/{date}` (admin) returning reservations for a specific date. |
| SRS-RES-08 | The system shall expose `GET /api/reservations/status/{status}` (admin) returning reservations filtered by status. |
| SRS-RES-09 | The system shall expose `GET /api/reservations/{id}` (admin) returning a single reservation by GUID. |
| SRS-RES-10 | The system shall expose `PATCH /api/reservations/{id}/status` (admin) to update the status of a reservation. |
| SRS-RES-11 | The system shall expose `DELETE /api/reservations/{id}` (admin) to delete a reservation record. |
| SRS-RES-12 | Valid status transitions: Pending → Confirmed, Pending → Cancelled, Confirmed → Completed, Confirmed → Cancelled. |

### 3.5 Contact Message Module

| ID | Requirement |
|---|---|
| SRS-MSG-01 | The system shall expose `POST /api/contactmessages` (public, anonymous) to submit a contact message. |
| SRS-MSG-02 | Required contact message fields: Name, Email, Subject, Message. |
| SRS-MSG-03 | New messages shall be created with `IsRead = false`. |
| SRS-MSG-04 | The system shall expose `GET /api/contactmessages` (admin) returning all messages ordered by `CreatedAt` descending. |
| SRS-MSG-05 | The system shall expose `GET /api/contactmessages/{id}` (admin) returning a single message. |
| SRS-MSG-06 | The system shall expose `PATCH /api/contactmessages/{id}/read` (admin) to mark a message as read. |
| SRS-MSG-07 | The system shall expose `DELETE /api/contactmessages/{id}` (admin) to delete a message. |

### 3.6 Frontend — Public Pages

| ID | Requirement |
|---|---|
| SRS-FE-01 | The frontend shall implement client-side routing using React Router v7 with the following public routes: `/`, `/menu`, `/reservation`, `/about`, `/contact`. |
| SRS-FE-02 | The frontend shall implement an admin area at `/admin` with sub-routes: `/admin/login`, `/admin/dashboard`, `/admin/menu`, `/admin/reservations`, `/admin/messages`. |
| SRS-FE-03 | Unauthenticated access to any `/admin/*` route (except `/admin/login`) shall redirect to `/admin/login`. |
| SRS-FE-04 | All public pages shall display a navigation header with links to all public routes and a language toggle. |
| SRS-FE-05 | All public pages shall display a footer with contact info, social links, and copyright. |
| SRS-FE-06 | Menu items shall be fetched from `GET /api/menuitems` and displayed in a responsive grid. |
| SRS-FE-07 | Category filter tabs shall update the displayed items without a page reload. |
| SRS-FE-08 | The reservation form shall submit to `POST /api/reservations` and display the WhatsApp deep link on success. |
| SRS-FE-09 | The contact form shall submit to `POST /api/contactmessages` and display a success confirmation. |
| SRS-FE-10 | All pages shall display loading skeleton components during async data fetches. |
| SRS-FE-11 | All pages shall display a user-friendly error message if an API request fails. |

### 3.7 Frontend — Admin Panel

| ID | Requirement |
|---|---|
| SRS-ADM-01 | The admin login form shall submit credentials to `POST /api/auth/login` and store the returned JWT in `localStorage`. |
| SRS-ADM-02 | The JWT shall be attached as a `Bearer` token in the `Authorization` header of all admin API requests. |
| SRS-ADM-03 | A 401 response from any admin endpoint shall clear the stored token and redirect to `/admin/login`. |
| SRS-ADM-04 | The dashboard shall display: total menu items, today's reservation count, pending reservations count, unread messages count. |
| SRS-ADM-05 | Menu management shall support create, edit, delete operations with a modal form. |
| SRS-ADM-06 | The reservation table shall support filtering by date (date picker) and status (dropdown). |
| SRS-ADM-07 | The reservation detail modal shall include a WhatsApp link pre-filled with the customer's phone number. |
| SRS-ADM-08 | Contact messages list shall visually distinguish read and unread messages. |

### 3.8 Internationalization

| ID | Requirement |
|---|---|
| SRS-I18N-01 | The language setting shall be persisted in `localStorage` and restored on page load. |
| SRS-I18N-02 | Switching language shall update all static UI strings immediately without a page reload. |
| SRS-I18N-03 | When Arabic is active, `dir="rtl"` shall be applied to the `<html>` element. |
| SRS-I18N-04 | All menu item names and descriptions shall be served in both languages from the API and displayed according to the active locale. |
| SRS-I18N-05 | Date displays on public pages shall be formatted using the locale-appropriate format. |

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

| ID | Requirement |
|---|---|
| SRS-PERF-01 | Time to First Contentful Paint (FCP) on the home page shall be ≤ 1.5 s on a simulated fast 3G connection. |
| SRS-PERF-02 | API read endpoints shall return a response within 300 ms at p95 under a load of 50 concurrent users. |
| SRS-PERF-03 | The production frontend bundle (excluding images) shall be ≤ 500 KB gzipped. |
| SRS-PERF-04 | Database queries shall use indexed columns for all filter operations (status, date, categoryId). |

### 4.2 Reliability Requirements

| ID | Requirement |
|---|---|
| SRS-REL-01 | The API shall return a structured JSON error response (with `message` and `errors` fields) for all 4xx and 5xx responses. |
| SRS-REL-02 | Unhandled exceptions in the API shall not expose stack traces in production. |
| SRS-REL-03 | Database migrations shall run automatically on application startup without requiring manual intervention. |

### 4.3 Usability Requirements

| ID | Requirement |
|---|---|
| SRS-USE-01 | The application shall be fully functional on viewport widths from 375px to 1920px. |
| SRS-USE-02 | Interactive elements (buttons, links) shall have a minimum touch target size of 44×44 px. |
| SRS-USE-03 | Form field validation errors shall appear inline, adjacent to the relevant field. |
| SRS-USE-04 | Page transitions and list animations shall complete within 400 ms. |

### 4.4 Maintainability Requirements

| ID | Requirement |
|---|---|
| SRS-MAIN-01 | No circular dependencies shall exist between Clean Architecture layers (Domain ← Application ← Infrastructure ← Presentation). |
| SRS-MAIN-02 | All TypeScript files shall compile with `strict: true` and zero errors under `noUnusedLocals` and `noUnusedParameters`. |
| SRS-MAIN-03 | API DTO contracts shall be reflected 1:1 in the frontend TypeScript interfaces in `types/index.ts`. |

---

## 5. External Interface Requirements

### 5.1 User Interface

- The UI shall use the Tailwind CSS v4 design token system defined in `frontend/src/index.css`.
- Color tokens: `copper`, `copper-dark`, `copper-light`, `cream`, `cream-dark`, `charcoal`, `charcoal-light`, `warm-white`, `warm-gray`, `sage`.
- Typography: Playfair Display (serif, headings), Inter (sans-serif, body).
- Animations shall use Framer Motion; no CSS keyframe animations for entrance effects.

### 5.2 API Interface

- The API base URL is configurable via the `/api` proxy in the Vite development server and via the `VITE_API_URL` environment variable in production.
- All API request and response bodies use `application/json` content type.
- All timestamps are returned in ISO 8601 UTC format.
- All identifiers are UUID v4 strings.
- Enum values in JSON payloads are serialized as strings (e.g., `"Pending"`, `"Confirmed"`).

### 5.3 Third-Party Integrations

| Integration | Purpose | Method |
|---|---|---|
| WhatsApp Deep Link | Reservation confirmation and admin quick-reply | `https://wa.me/{phone}?text={message}` URL |
| Unsplash / Cloudinary | Menu item and page imagery | External URL references; no file upload |
| Google Maps (embed) | Location display on Contact page | `<iframe>` embed |

---

## 6. Data Requirements

### 6.1 Entity Definitions

#### User
| Field | Type | Constraints |
|---|---|---|
| Id | `Guid` | PK, non-nullable |
| FullName | `string` | Required, max 100 chars |
| Email | `string` | Required, unique, valid email format |
| PasswordHash | `string` | Required, BCrypt hash |
| Role | `UserRole` (enum) | Required; values: `Admin`, `Staff` |
| CreatedAt | `DateTime` | UTC, auto-set on creation |

#### Category
| Field | Type | Constraints |
|---|---|---|
| Id | `Guid` | PK, non-nullable |
| NameEn | `string` | Required, max 100 chars |
| NameAr | `string` | Required, max 100 chars |
| DisplayOrder | `int` | Required, ≥ 0 |
| IsActive | `bool` | Required, default `true` |

#### MenuItem
| Field | Type | Constraints |
|---|---|---|
| Id | `Guid` | PK, non-nullable |
| CategoryId | `Guid` | FK → Category.Id, required |
| NameEn | `string` | Required, max 200 chars |
| NameAr | `string` | Required, max 200 chars |
| DescriptionEn | `string?` | Optional, max 1000 chars |
| DescriptionAr | `string?` | Optional, max 1000 chars |
| Price | `decimal(18,2)` | Required, > 0 |
| ImageUrl | `string?` | Optional, valid URL |
| IsAvailable | `bool` | Default `true` |
| IsFeatured | `bool` | Default `false` |
| DisplayOrder | `int` | Default `0` |
| CreatedAt | `DateTime` | UTC, auto-set |
| UpdatedAt | `DateTime` | UTC, updated on each write |

#### Reservation
| Field | Type | Constraints |
|---|---|---|
| Id | `Guid` | PK, non-nullable |
| CustomerName | `string` | Required, max 200 chars |
| Phone | `string` | Required, max 20 chars |
| Email | `string?` | Optional, valid email format |
| Date | `DateOnly` | Required, ≥ today |
| Time | `TimeOnly` | Required |
| PartySize | `int` | Required, 1–20 |
| SpecialRequests | `string?` | Optional, max 500 chars |
| Status | `ReservationStatus` (enum) | Default `Pending` |
| WhatsAppNotified | `bool` | Default `false` |
| CreatedAt | `DateTime` | UTC, auto-set |

#### ContactMessage
| Field | Type | Constraints |
|---|---|---|
| Id | `Guid` | PK, non-nullable |
| Name | `string` | Required, max 200 chars |
| Email | `string` | Required, valid email format |
| Subject | `string` | Required, max 200 chars |
| Message | `string` | Required, max 2000 chars |
| IsRead | `bool` | Default `false` |
| CreatedAt | `DateTime` | UTC, auto-set |

### 6.2 Enumeration Types

#### ReservationStatus
| Value | Meaning |
|---|---|
| `Pending` | Submitted by customer; awaiting admin action |
| `Confirmed` | Admin has confirmed the reservation |
| `Cancelled` | Reservation was cancelled by admin or customer |
| `Completed` | Customer visit is complete |

#### UserRole
| Value | Meaning |
|---|---|
| `Admin` | Full access to all admin operations |
| `Staff` | Read-only access (reserved for future expansion) |

### 6.3 Data Retention

- Reservation records are retained indefinitely; deletion is manual and admin-initiated.
- Contact messages are retained indefinitely; deletion is manual and admin-initiated.
- No automatic data archiving or purging is implemented in v1.

---

## 7. Security Requirements

| ID | Requirement |
|---|---|
| SRS-SEC-01 | The JWT signing key (`JWT_SECRET_KEY`) shall be at least 256 bits (32 characters). |
| SRS-SEC-02 | JWT tokens shall have a configurable expiry; `ClockSkew` is set to zero to prevent token acceptance beyond expiry. |
| SRS-SEC-03 | All admin API endpoints shall use `[Authorize]`; public endpoints that must remain unauthenticated shall be explicitly decorated with `[AllowAnonymous]`. |
| SRS-SEC-04 | CORS shall only allow the configured frontend origin(s); wildcard origins (`*`) are not permitted in production. |
| SRS-SEC-05 | Input validation shall be enforced server-side via FluentValidation on all request DTOs, independent of client-side validation. |
| SRS-SEC-06 | The `.env` file containing secrets shall never be committed to version control; it is covered by `.gitignore`. |
| SRS-SEC-07 | EF Core parameterized queries shall be used for all database operations; raw SQL string concatenation is prohibited. |
| SRS-SEC-08 | Error responses shall not expose internal exception details, stack traces, or database schema information. |

---

## 8. System Constraints

| Constraint | Description |
|---|---|
| **Runtime** | .NET 10 SDK required for backend; Node.js 20+ for frontend build tooling. |
| **Database** | PostgreSQL 15 or later; database must be created and accessible before first launch. |
| **Environment Variables** | Backend requires: `DEFAULTCONNECTION`, `JWT_SECRET_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_LIFETIME_MINUTES`. |
| **Single Tenant** | The application is designed for a single restaurant; multi-tenancy is not supported. |
| **File Storage** | Menu item images are referenced by URL; the application does not store binary files. |
| **Stateless API** | The REST API is fully stateless; all session state is carried in the JWT. |

---

## 9. Acceptance Criteria

A release of Café Lumière v1.0 is considered acceptable when all of the following conditions are verified:

### Functional Acceptance
- [ ] All 5 public pages render correctly in English and Arabic on mobile and desktop.
- [ ] Menu page correctly filters items by category with smooth animation.
- [ ] Reservation form completes all 5 steps and submits successfully to the API.
- [ ] WhatsApp deep link opens with pre-filled reservation details.
- [ ] Contact form submits and displays a success confirmation.
- [ ] Admin login authenticates with valid credentials and redirects to the dashboard.
- [ ] Admin login rejects invalid credentials with an error message.
- [ ] Admin can perform full CRUD on menu items and categories.
- [ ] Admin can view, filter, and update the status of reservations.
- [ ] Admin can view and delete contact messages.

### Non-Functional Acceptance
- [ ] Lighthouse Performance score ≥ 90 on the Home and Menu pages.
- [ ] Lighthouse Accessibility score ≥ 90 on all public pages.
- [ ] All TypeScript files compile with zero errors under strict mode.
- [ ] API returns structured JSON error responses for all 4xx status codes.
- [ ] No secrets or `.env` files are present in the git repository.
