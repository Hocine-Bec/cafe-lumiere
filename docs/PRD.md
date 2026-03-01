# Product Requirements Document (PRD)
## Café Lumière — Restaurant & Café Management Platform

| Field | Detail |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Final |
| **Author** | Hocine Bechebil |
| **Last Updated** | 2026-03-01 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Objectives](#3-goals--objectives)
4. [User Personas](#4-user-personas)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [User Stories](#7-user-stories)
8. [Out of Scope](#8-out-of-scope)
9. [Success Metrics](#9-success-metrics)
10. [Assumptions & Constraints](#10-assumptions--constraints)

---

## 1. Executive Summary

Café Lumière is a full-stack restaurant and café management web application that bridges the gap between a restaurant's online presence and its day-to-day operational needs. The platform provides:

- A premium, bilingual (English / Arabic) public-facing website for customers to browse the menu, submit table reservations, and contact the establishment.
- A secure admin panel for restaurant staff to manage the menu catalog, track reservations, and respond to customer inquiries.

The application is designed as a production-ready template that any café or restaurant owner can adopt with minimal configuration.

---

## 2. Problem Statement

Small and mid-sized restaurants and cafés face several recurring challenges:

| Challenge | Impact |
|---|---|
| No online presence or an outdated static website | Lost customers who search online before visiting |
| Manual reservation handling via phone | Double bookings, missed calls, no digital record |
| No easy way to update the menu without a developer | Stale menu content, wrong prices displayed |
| Customer inquiries buried in email | Slow response times, poor customer experience |
| Single-language websites in Arabic-speaking markets | Excludes a significant segment of the customer base |

Café Lumière addresses all of these through a single, integrated platform.

---

## 3. Goals & Objectives

### Primary Goals

1. **Customer Acquisition** — Provide a visually compelling online presence that converts website visitors into in-store customers.
2. **Operational Efficiency** — Replace manual reservation and inquiry management with a structured digital workflow.
3. **Menu Autonomy** — Enable non-technical restaurant staff to maintain and update the menu independently.

### Objectives

- Deliver a complete, deployable web application with zero third-party SaaS dependencies for core functionality.
- Support both Arabic (RTL) and English (LTR) languages across all customer-facing surfaces.
- Achieve a Lighthouse performance score of ≥ 90 across all public pages.
- Provide a mobile-first experience, as the majority of restaurant discovery happens on smartphones.

---

## 4. User Personas

### Persona 1 — The Restaurant Guest (Public User)

> **Name:** Sara M., 28, working professional
> **Device:** iPhone (primary), desktop (secondary)
> **Goals:** Find the menu and prices before visiting; book a table without calling
> **Frustrations:** Websites that are slow, hard to navigate on mobile, or only in one language
> **Language:** Bilingual (Arabic/English)

### Persona 2 — The Restaurant Manager (Admin User)

> **Name:** Karim B., 42, café owner
> **Technical level:** Low — comfortable with phones and basic apps, not with code
> **Goals:** Know today's reservations at a glance; add new items to the menu; read customer messages
> **Frustrations:** Needing a developer to change a menu price; losing reservation requests in WhatsApp chats

### Persona 3 — The Technical Reviewer (Developer / Client Evaluator)

> **Name:** Technical decision-maker on a freelance platform
> **Goals:** Assess code quality, architecture, and completeness of the delivered product
> **Evaluation criteria:** Clean architecture, typed code, realistic functionality, API quality

---

## 5. Functional Requirements

### 5.1 Public Website

#### FR-01 — Menu Browsing
- The system shall display all available menu items organized by category.
- Items shall be filterable by category via a tab/pill navigation component.
- Each item shall display: name (in the active language), description, price, and food image.
- Clicking an item shall open a modal with full details.
- Unavailable items shall be hidden or visually marked as unavailable.

#### FR-02 — Bilingual Support
- All customer-facing content shall be available in English and Arabic.
- The header shall provide a language toggle that switches the entire UI without a page reload.
- When Arabic is active, the layout direction shall switch to RTL.
- Category and menu item names and descriptions are stored bilingually in the database.

#### FR-03 — Table Reservation
- The system shall provide a multi-step reservation form:
  1. **Step 1 — Date & Time:** Date picker + selectable time slot grid.
  2. **Step 2 — Party Details:** Party size selection and special requests.
  3. **Step 3 — Guest Details:** Name, phone number (required), email (optional).
  4. **Step 4 — Confirmation:** Summary review before submission.
  5. **Step 5 — Success:** Confirmation screen with a WhatsApp deep link.
- The form shall validate all fields on the client and server.
- Submitted reservations are stored with `Pending` status.
- A WhatsApp button shall open `wa.me/{restaurantNumber}?text={preformattedMessage}` with reservation details pre-filled.

#### FR-04 — Contact Form
- The system shall provide a contact form with fields: Name, Email, Subject, Message.
- Submitted messages are stored in the database and marked as unread.
- The contact page shall display the restaurant address, phone number, opening hours, and a map embed.

#### FR-05 — About Page
- The system shall present the restaurant's story, values, and team members.

#### FR-06 — Home Page
- The home page shall include: hero section with CTA buttons, featured menu items, about teaser, testimonials section, and location/hours section.
- Featured menu items are driven by the `IsFeatured` flag on `MenuItem` entities.

### 5.2 Admin Panel

#### FR-07 — Admin Authentication
- Admin users shall log in with email and password.
- Successful authentication returns a JWT Bearer token stored in the browser.
- All admin API endpoints shall require a valid JWT token.
- Invalid or expired tokens shall result in a 401 response and redirect to the login page.

#### FR-08 — Dashboard
- The dashboard shall display: total menu items, today's reservation count, pending reservations count, and unread messages count.
- A recent activity feed shall show the latest reservations and messages.

#### FR-09 — Menu Management
- Admin users shall be able to create, read, update, and delete menu items.
- Each menu item form shall include: name (EN/AR), description (EN/AR), price, image URL, category, availability toggle, featured toggle, and display order.
- Admin users shall be able to create, edit, and delete categories.
- Display order shall be adjustable via drag-and-drop reordering.

#### FR-10 — Reservation Management
- Admin users shall see all reservations in a sortable, filterable table.
- Filters: by date, by status (Pending, Confirmed, Cancelled, Completed).
- Admin users shall be able to update a reservation's status via a dropdown.
- Clicking a reservation shall open a detail modal showing all fields.
- A WhatsApp quick-reply button shall open a chat to the customer's phone number.

#### FR-11 — Contact Message Management
- Admin users shall see all contact messages with read/unread status indicators.
- Clicking a message shall display the full content.
- Admin users shall be able to delete messages.

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Public pages shall achieve a Lighthouse Performance score of ≥ 90.
- API response times shall be < 300 ms for read operations under normal load.
- Menu items list shall load within 1.5 seconds on a 4G connection.

### 6.2 Usability
- The UI shall be fully responsive across mobile (≥ 375px), tablet (≥ 768px), and desktop (≥ 1280px) viewports.
- All interactive elements shall have hover and focus states.
- Loading states (skeleton screens) shall be shown during all asynchronous data fetches.
- Error messages shall be human-readable and actionable.

### 6.3 Security
- All admin API endpoints shall be protected by JWT Bearer authentication.
- Passwords shall be stored as BCrypt hashes; plaintext passwords shall never be persisted or logged.
- The API shall enforce CORS, allowing only the configured frontend origin(s).
- Environment variables shall manage all secrets; no credentials shall be committed to version control.
- Input validation shall be performed on both client and server sides.

### 6.4 Accessibility
- All images shall have descriptive `alt` attributes.
- Forms shall use `<label>` elements associated with their inputs.
- Color contrast ratios shall meet WCAG AA standards.
- The application shall be navigable by keyboard.

### 6.5 Maintainability
- Backend code shall follow Clean Architecture layering; no cross-layer dependency violations.
- Frontend components shall use TypeScript strict mode with no `any` types.
- All API contracts shall be defined in typed DTOs and TypeScript interfaces.

### 6.6 Localization
- All static UI strings shall originate from translation files (`en.json`, `ar.json`).
- No hardcoded human-readable strings shall appear in component code.
- Date and number formatting shall respect the active locale.

---

## 7. User Stories

### Public — Menu
- **US-001** As a customer, I want to browse the full menu so that I can decide what to order before visiting.
- **US-002** As a customer, I want to filter menu items by category so that I can quickly find what I'm looking for.
- **US-003** As a customer, I want to view full details of a menu item so that I can see the description, price, and photo.
- **US-004** As an Arabic-speaking customer, I want to switch the website to Arabic so that I can read everything in my language.

### Public — Reservation
- **US-005** As a customer, I want to book a table online so that I don't have to call the restaurant.
- **US-006** As a customer, I want to select my preferred date and time from available slots so that I can plan my visit.
- **US-007** As a customer, I want to receive a WhatsApp confirmation so that I have a record of my booking.
- **US-008** As a customer, I want to add special requests to my reservation so that the restaurant can accommodate my needs.

### Public — Contact
- **US-009** As a customer, I want to send a message to the restaurant so that I can ask questions without calling.

### Admin — Menu
- **US-010** As an admin, I want to add new menu items so that the website always reflects our current offerings.
- **US-011** As an admin, I want to mark items as unavailable so that customers don't order something that's out of stock.
- **US-012** As an admin, I want to feature specific items on the home page so that I can highlight our specialties.
- **US-013** As an admin, I want to manage categories so that the menu structure reflects our actual sections.

### Admin — Reservations
- **US-014** As an admin, I want to see all of today's reservations at a glance so that I can prepare for the day.
- **US-015** As an admin, I want to confirm or cancel a reservation so that customers know whether their booking is accepted.
- **US-016** As an admin, I want to filter reservations by status so that I can focus on pending requests.

### Admin — Messages
- **US-017** As an admin, I want to see unread customer messages highlighted so that I don't miss any inquiries.
- **US-018** As an admin, I want to reply to a customer via WhatsApp directly from the message view so that I can respond quickly.

---

## 8. Out of Scope

The following are explicitly excluded from version 1.0:

| Feature | Rationale |
|---|---|
| Online payment / ordering | Increases integration complexity; outside core MVP scope |
| Real-time seat availability | Requires WebSocket infrastructure; not needed for table bookings |
| Customer accounts / login | Reservations are anonymous by design for simplicity |
| SMS / email notifications | Requires third-party service integration (Twilio, SendGrid) |
| Multi-branch / multi-location | Architecture supports single-tenant only in v1 |
| Mobile native apps (iOS/Android) | Web-first approach covers 95% of the use case |
| Loyalty / points system | Post-MVP feature |
| Automated WhatsApp Business API | WhatsApp deep link (wa.me) is used instead of the API |

---

## 9. Success Metrics

| Metric | Target | Measurement Method |
|---|---|---|
| Lighthouse Performance (public pages) | ≥ 90 | Chrome DevTools Lighthouse audit |
| Lighthouse Accessibility | ≥ 90 | Chrome DevTools Lighthouse audit |
| Mobile responsiveness | All pages render correctly at 375px+ | Manual + BrowserStack testing |
| API response time (p95) | < 300 ms | Network tab / API monitoring |
| Admin task completion | All CRUD operations function without error | End-to-end manual testing |
| Bilingual coverage | 100% of UI strings translated | Translation key audit |
| Form validation coverage | All required fields validated client + server | Test case execution |

---

## 10. Assumptions & Constraints

### Assumptions
- The restaurant operates in a single location.
- Admin access is limited to a small number of trusted staff (no role-based access beyond Admin/Staff distinction needed in v1).
- Customers have access to WhatsApp for reservation confirmations.
- Menu images are externally hosted (Unsplash URLs or Cloudinary); the application does not handle file uploads in v1.

### Constraints
- The backend is a stateless REST API; no WebSocket or real-time features are in scope.
- The deployment target is a PaaS environment (Vercel + Railway/Render); no Kubernetes or container orchestration is required.
- The database is a single PostgreSQL instance; read replicas and sharding are not required.
- Environment variables must be configured on the hosting platform; no configuration management system (Vault, AWS SSM) is used.
