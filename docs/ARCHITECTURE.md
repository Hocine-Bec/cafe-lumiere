# Architecture Document
## Café Lumière — System Design & Technical Decisions

| Field | Detail |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Final |
| **Author** | Hocine Bechebil |
| **Last Updated** | 2026-03-01 |

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Backend Architecture — Clean Architecture](#2-backend-architecture--clean-architecture)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Data Architecture](#4-data-architecture)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [API Design](#6-api-design)
7. [Internationalization Architecture](#7-internationalization-architecture)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Technology Decisions](#9-technology-decisions)

---

## 1. System Overview

Café Lumière follows a classic **three-tier architecture**: a React SPA (presentation), a .NET REST API (application/logic), and a PostgreSQL database (data). The tiers are independently deployable and communicate exclusively over HTTPS.

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
│                                                                  │
│   React 18 SPA (Vite)                                            │
│   ├── Public Pages  (/, /menu, /reservation, /about, /contact)   │
│   └── Admin Panel  (/admin/*)                                    │
│                                                                  │
│   Hosted on: Vercel CDN                                          │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS  /api/*
                           │ JWT Bearer token (admin routes)
┌──────────────────────────▼───────────────────────────────────────┐
│                       APPLICATION TIER                           │
│                                                                  │
│   .NET 10 REST API                                               │
│   ├── Presentation Layer  (Controllers, ResultExtensions)        │
│   ├── Application Layer   (Services, DTOs, Validators, Mappers)  │
│   ├── Infrastructure Layer (Repositories, UnitOfWork, AuthService│
│   └── Domain Layer        (Entities, Enums)                     │
│                                                                  │
│   Hosted on: Railway / Render (Linux container)                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ Npgsql / EF Core
┌──────────────────────────▼───────────────────────────────────────┐
│                          DATA TIER                               │
│                                                                  │
│   PostgreSQL 15+                                                 │
│   Tables: Users, Categories, MenuItems, Reservations,           │
│           ContactMessages                                        │
│                                                                  │
│   Hosted on: Supabase / Railway PostgreSQL                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Architecture — Clean Architecture

The backend follows **Clean Architecture** (Robert C. Martin), organizing code into four concentric layers where each layer may only depend on layers further inward.

### 2.1 Dependency Rule

```
Domain  ◄──  Application  ◄──  Infrastructure  ◄──  Presentation
(inner)                                               (outer)
```

Inner layers define abstractions (interfaces); outer layers provide implementations. This means:
- `Domain` has zero dependencies on other layers or NuGet packages.
- `Application` depends only on `Domain` — never on EF Core, Npgsql, or any infrastructure concern.
- `Infrastructure` depends on `Application` (to implement its interfaces) and `Domain`.
- `Presentation` depends on `Application` (to inject services) — it does not reference `Infrastructure` directly.

### 2.2 Layer Responsibilities

#### Domain Layer (`backend/Domain/`)

The innermost layer. Contains only pure C# business objects with no framework dependencies.

```
Domain/
├── Entities/
│   ├── Category.cs
│   ├── MenuItem.cs
│   ├── Reservation.cs
│   ├── ContactMessage.cs
│   └── User.cs
└── Enums/
    ├── ReservationStatus.cs   (Pending, Confirmed, Cancelled, Completed)
    └── UserRole.cs            (Admin, Staff)
```

**Key decisions:**
- Entities use auto-properties with default values; no domain logic is embedded in v1.
- Timestamps use `DateTime.UtcNow` — the domain does not depend on the host's timezone.

#### Application Layer (`backend/Application/`)

Defines all business use cases and the contracts that infrastructure must fulfill.

```
Application/
├── DTOs/           → Request/Response objects (API contracts)
├── Interfaces/
│   ├── Repositories/  → IUserRepository, ICategoryRepository, etc.
│   └── Services/      → IAuthService, ICategoryService, etc.
├── Mappers/        → Mapster TypeAdapterConfig
├── Services/       → Business logic implementations
├── Shared/         → Result<T> pattern, ErrorType enum
├── Validators/     → FluentValidation AbstractValidator<TRequest>
└── Extensions/     → ApplicationServiceExtensions (DI registration)
```

**Key decisions:**
- **Result Pattern** — Services never throw exceptions for expected failures. Every service method returns `Result<T>`, which carries either a success value or an `ErrorType` + message. This produces predictable, type-safe control flow.
- **Interfaces in Application** — Repository interfaces live in `Application`, not `Infrastructure`. This is the Dependency Inversion Principle: the high-level policy (Application) defines what it needs; the low-level module (Infrastructure) fulfills it.
- **FluentValidation** — Validators are registered by assembly scan and invoked in the `ValidationService` before any service logic runs. This keeps validation separated from business logic.
- **Mapster over AutoMapper** — Mapster provides faster, compile-time-friendly mapping with a simpler configuration API. All mappings are centralized in `MappingConfig.cs`.

#### Infrastructure Layer (`backend/Infrastructure/`)

Contains all framework-specific implementations: EF Core, Npgsql, BCrypt, JWT.

```
Infrastructure/
├── Authentication/
│   └── AuthService.cs          → JWT generation + BCrypt password ops
├── Data/
│   ├── AppDbContext.cs          → EF Core DbContext
│   ├── Configurations/          → Fluent API entity configurations
│   ├── DataSeeder.cs            → Idempotent seed on startup
│   └── Migrations/              → EF Core migration files
├── Repositories/                → EF Core implementations of Application interfaces
├── UnitOfWork/
│   └── UnitOfWork.cs            → Wraps DbContext; lazy-initializes repositories
└── Extensions/
    └── InfrastructureServiceExtensions.cs
```

**Key decisions:**
- **Unit of Work** — `UnitOfWork` exposes all repositories and a single `SaveChangesAsync`. Repositories are lazy-initialized (`??=`) to avoid unnecessary instantiation. This ensures all writes in a business operation share one `DbContext` and one transaction.
- **Fluent API for entity configuration** — Each entity has a dedicated `IEntityTypeConfiguration<T>` class rather than data annotations. This keeps entity classes clean and centralizes DB schema concerns.
- **DataSeeder** — Runs on every startup but is idempotent (checks `AnyAsync` before inserting). Seeds the default admin user, categories, and sample menu items so the application is immediately usable.

#### Presentation Layer (`backend/Presentation/`)

The outermost layer. Handles HTTP concerns only: routing, serialization, and authentication middleware.

```
Presentation/
├── Controllers/
│   ├── AuthController.cs
│   ├── CategoriesController.cs
│   ├── MenuItemsController.cs
│   ├── ReservationsController.cs
│   └── ContactMessagesController.cs
├── Extensions/
│   └── ResultExtensions.cs    → Maps Result<T> to IActionResult
└── Program.cs                 → DI composition root, middleware pipeline
```

**Key decisions:**
- **ResultExtensions** — A single extension method `HandleResult()` maps `Result<T>` outcomes to the correct HTTP status codes (200, 201, 400, 401, 404, 409). Controllers contain zero conditional logic — they call a service and pass the result to `HandleResult()`.
- **Primary constructor injection** — Controllers use C# 12 primary constructors (`ControllerBase(IService service)`) for concise dependency declaration.
- **Scalar instead of Swagger UI** — .NET 10's native `AddOpenApi()` generates the OpenAPI document; Scalar renders it at `/scalar/`. This avoids the Swashbuckle v2/v3 compatibility issue present in .NET 10.

### 2.3 Request Lifecycle

```
HTTP Request
     │
     ▼
[Presentation] Controller receives request
     │
     ▼
[Application]  Service validates request via ValidationService
               (FluentValidation — returns Result.Failure on invalid input)
     │
     ▼
[Application]  Service executes business logic
               (calls IRepository methods via IUnitOfWork)
     │
     ▼
[Infrastructure] Repository executes EF Core query against PostgreSQL
     │
     ▼
[Application]  Service maps entity → DTO via Mapster
               Returns Result<ResponseDto>
     │
     ▼
[Presentation] ResultExtensions.HandleResult() maps Result → IActionResult
     │
     ▼
HTTP Response (200 / 201 / 400 / 401 / 404 / 409)
```

---

## 3. Frontend Architecture

### 3.1 Module Structure

```
frontend/src/
├── assets/                 → Static assets (fonts, SVGs)
├── components/
│   ├── ui/                 → Primitive components: Button, Input, Textarea,
│   │                          Container, LoadingSpinner, ErrorMessage, MapView
│   ├── layout/             → Header, Footer, PublicLayout, AdminLayout, AdminSidebar
│   ├── home/               → HeroSection, FeaturedMenuSection, AboutTeaser,
│   │                          TestimonialsSection, LocationSection
│   ├── menu/               → CategoryTabs, MenuGrid, MenuCard,
│   │                          MenuItemModal, MenuSkeleton
│   ├── reservation/        → ReservationForm, ProgressIndicator, DateTimeStep,
│   │                          GuestDetailsStep, ConfirmationStep, ReservationSuccess
│   ├── about/              → StorySection, ValuesSection, TeamSection
│   ├── contact/            → ContactForm, ContactInfo
│   └── admin/              → DataTable, StatsCard, AdminPageHeader,
│                              MenuItemTable, MenuItemFormModal, CategoryManager,
│                              CategoryFormModal, DraggableMenuList,
│                              ReservationTable, ReservationDetailModal,
│                              MessageList, MessageDetail, ConfirmDialog,
│                              StatusBadge, ReservationChart, RecentActivity
├── contexts/
│   └── AuthContext.tsx      → JWT state, login(), logout()
├── hooks/
│   ├── useAuth.ts           → Consumes AuthContext
│   └── useLanguage.ts       → Active language + toggle
├── i18n/
│   ├── index.ts             → t() helper, language detection
│   ├── en.json              → English strings
│   └── ar.json              → Arabic strings
├── pages/
│   ├── public/              → HomePage, MenuPage, ReservationPage, AboutPage, ContactPage
│   ├── admin/               → LoginPage, DashboardPage, MenuManagementPage,
│   │                          ReservationManagementPage, ContactMessagesPage
│   └── NotFoundPage.tsx
├── services/
│   └── api.ts               → All typed API functions (fetch wrapper)
├── types/
│   └── index.ts             → All TypeScript interfaces
└── utils/
    ├── cn.ts                → clsx + twMerge helper
    ├── constants.ts         → TIME_SLOTS, PARTY_SIZE_OPTIONS, API_BASE_URL
    ├── images.ts            → Curated Unsplash image URL constants
    └── demoData.ts          → Static fallback/demo data
```

### 3.2 Routing Strategy

React Router v7 with two layout groups:

```
<BrowserRouter>
  <Routes>
    <Route element={<PublicLayout />}>        ← Header + Footer wrapper
      <Route path="/"            element={<HomePage />} />
      <Route path="/menu"        element={<MenuPage />} />
      <Route path="/reservation" element={<ReservationPage />} />
      <Route path="/about"       element={<AboutPage />} />
      <Route path="/contact"     element={<ContactPage />} />
    </Route>

    <Route path="/admin/login"   element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>      ← JWT guard
      <Route element={<AdminLayout />}>       ← Sidebar wrapper
        <Route path="/admin"              element={<DashboardPage />} />
        <Route path="/admin/menu"         element={<MenuManagementPage />} />
        <Route path="/admin/reservations" element={<ReservationManagementPage />} />
        <Route path="/admin/messages"     element={<ContactMessagesPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

### 3.3 State Management

No global state library (Redux, Zustand) is used. State is managed at three levels:

| Level | Mechanism | Used For |
|---|---|---|
| **Global** | React Context (`AuthContext`) | JWT token, user identity |
| **Page** | `useState` + `useEffect` | API data fetched per page |
| **Component** | `useState` | Form state, modal open/close, active tab |

This is sufficient for the application's complexity. Global state is limited to auth — all other data is fetched fresh when a page mounts.

### 3.4 API Communication

All API calls are centralized in `services/api.ts`. It exports typed async functions that wrap the native `fetch` API with the dev proxy (`/api`) and attach the JWT header for admin calls.

```typescript
// Pattern used throughout api.ts
export async function getMenuItems(): Promise<MenuItem[]> {
  const res = await fetch('/api/menuitems');
  if (!res.ok) throw new Error('Failed to fetch menu items');
  return res.json();
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  token: string
): Promise<ReservationResponse> {
  const res = await fetch(`/api/reservations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}
```

### 3.5 Animation System

Framer Motion is used for all entrance animations. Animation variants are defined inline within each component file (no shared variant registry) to keep components self-contained:

```typescript
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
```

Usage pattern: `<motion.div variants={staggerContainer} initial="hidden" whileInView="visible">`.

### 3.6 Styling System

Tailwind CSS v4 — configured entirely via `@theme` in `frontend/src/index.css`. No `tailwind.config.js` file exists.

```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-copper: #b87333;
  --color-copper-dark: #8b5a1e;
  --color-cream: #faf7f2;
  --color-charcoal: #2c2c2c;
  --color-sage: #7c9a7e;
  /* ... */

  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Playfair Display', serif;
}
```

Path alias `@/` maps to `src/`, configured in both `vite.config.ts` and `tsconfig.app.json`.

---

## 4. Data Architecture

### 4.1 Entity Relationship Diagram

```
┌─────────────┐         ┌───────────────┐
│  Category   │1       N│   MenuItem    │
│─────────────│◄────────│───────────────│
│ Id (PK)     │         │ Id (PK)       │
│ NameEn      │         │ CategoryId(FK)│
│ NameAr      │         │ NameEn        │
│ DisplayOrder│         │ NameAr        │
│ IsActive    │         │ DescriptionEn │
└─────────────┘         │ DescriptionAr │
                        │ Price         │
                        │ ImageUrl      │
                        │ IsAvailable   │
                        │ IsFeatured    │
                        │ DisplayOrder  │
                        │ CreatedAt     │
                        │ UpdatedAt     │
                        └───────────────┘

┌──────────────────┐    ┌─────────────────┐    ┌──────────┐
│   Reservation    │    │  ContactMessage  │    │   User   │
│──────────────────│    │─────────────────│    │──────────│
│ Id (PK)          │    │ Id (PK)          │    │ Id (PK)  │
│ CustomerName     │    │ Name             │    │ FullName │
│ Phone            │    │ Email            │    │ Email    │
│ Email            │    │ Subject          │    │ Password │
│ Date             │    │ Message          │    │   Hash   │
│ Time             │    │ IsRead           │    │ Role     │
│ PartySize        │    │ CreatedAt        │    │ CreatedAt│
│ SpecialRequests  │    └─────────────────┘    └──────────┘
│ Status           │
│ WhatsAppNotified │
│ CreatedAt        │
└──────────────────┘
```

`Reservation`, `ContactMessage`, and `User` are independent — no foreign key relationships between them.

### 4.2 Database Access Pattern

```
Controller
    └── IService (Application)
            └── IUnitOfWork (Application interface)
                    └── UnitOfWork (Infrastructure implementation)
                            └── IRepository (Application interface)
                                    └── Repository : EfRepository (Infrastructure)
                                            └── AppDbContext (EF Core)
                                                    └── PostgreSQL (Npgsql)
```

### 4.3 EF Core Configuration Highlights

- **DateOnly / TimeOnly** — Natively supported by EF Core 10 + Npgsql; stored as PostgreSQL `date` and `time` types.
- **Enum → string** — `ReservationStatus` and `UserRole` are stored as `text` columns using `.HasConversion<string>()` for readability in the database.
- **Decimal precision** — `Price` is configured with `HasPrecision(18, 2)` to prevent floating-point drift.
- **Cascade delete** — `MenuItem` has a cascade delete on `Category`'s delete behavior restricted at the application layer (service returns `409 Conflict` instead).

---

## 5. Authentication & Authorization

### 5.1 Flow

```
[Admin Browser]
      │
      │  POST /api/auth/login  { email, password }
      ▼
[AuthController]
      │
      │  IAuthenticationService.LoginAsync()
      ▼
[AuthenticationService (Application)]
      │  1. Fetch user by email via IUnitOfWork.Users
      │  2. BCrypt.Verify(password, user.PasswordHash)
      │  3. IAuthService.GenerateToken(user) → JWT string
      ▼
[AuthService (Infrastructure)]
      │  Reads JWT_SECRET_KEY, JWT_ISSUER, JWT_AUDIENCE, JWT_LIFETIME_MINUTES
      │  from environment variables
      │  Returns signed JWT string
      ▼
[AuthController]  →  200 OK  { token, email, fullName, role }
      │
      ▼
[Admin Browser]
      │  Stores token in localStorage
      │  Attaches as Authorization: Bearer {token} on all subsequent admin requests
```

### 5.2 JWT Structure

```json
{
  "header": { "alg": "HS256", "typ": "JWT" },
  "payload": {
    "sub":   "<user-guid>",
    "email": "admin@cafelumiere.com",
    "role":  "Admin",
    "iss":   "<JWT_ISSUER>",
    "aud":   "<JWT_AUDIENCE>",
    "exp":   "<unix-timestamp>",
    "iat":   "<unix-timestamp>"
  }
}
```

### 5.3 Authorization Model

| Endpoint Group | Auth Required | Mechanism |
|---|---|---|
| `GET /api/menuitems*` | No | `[AllowAnonymous]` |
| `GET /api/categories*` | No | `[AllowAnonymous]` |
| `POST /api/reservations` | No | `[AllowAnonymous]` |
| `POST /api/contactmessages` | No | `[AllowAnonymous]` |
| `POST /api/auth/*` | No | `[AllowAnonymous]` |
| All other endpoints | Yes | `[Authorize]` on controller class |

---

## 6. API Design

### 6.1 Design Principles

- **RESTful resource naming** — Plural nouns for collections (`/api/menuitems`, `/api/reservations`).
- **Consistent error shape** — All error responses return `{ "message": "...", "errors": {...} }`.
- **HTTP verbs match semantics** — `GET` for reads, `POST` for creation, `PUT` for full updates, `PATCH` for partial updates (status only), `DELETE` for removal.
- **201 Created with Location** — `POST` endpoints that create resources return `201` with a `Location` header pointing to the new resource's URL.
- **Enum serialization** — Enums are serialized as strings in JSON (configured via `JsonStringEnumConverter`) for human-readable payloads.

### 6.2 Result-to-HTTP Mapping

The `ResultExtensions.HandleResult()` method provides a single, consistent mapping:

| Result State | HTTP Status |
|---|---|
| `Result.Success<T>` | `200 OK` |
| `Result.Created<T>` | `201 Created` |
| `Result.Failure(ValidationError)` | `400 Bad Request` |
| `Result.Failure(Unauthorized)` | `401 Unauthorized` |
| `Result.Failure(NotFound)` | `404 Not Found` |
| `Result.Failure(Conflict)` | `409 Conflict` |

### 6.3 OpenAPI Documentation

The API is documented via .NET 10's native `AddOpenApi()`. The interactive Scalar UI is available at:

```
http://localhost:5258/scalar/
```

The raw OpenAPI JSON document is available at:

```
http://localhost:5258/openapi/v1.json
```

---

## 7. Internationalization Architecture

### 7.1 Translation System

A lightweight custom i18n solution is used — no third-party library (no i18next) in the final implementation.

```typescript
// i18n/index.ts
const translations = { en, ar };

export function t(key: string, lang: string): string {
  return key.split('.').reduce((obj, k) => obj?.[k], translations[lang]) ?? key;
}
```

Translation files (`en.json`, `ar.json`) are flat-ish JSON objects with dot-notatable keys organized by section:

```json
{
  "nav": { "home": "Home", "menu": "Menu", ... },
  "home": { "hero": { "title": "...", "subtitle": "..." } },
  "reservation": { "step1": { "title": "Select Date & Time" } }
}
```

### 7.2 Language State

Language preference is stored in `localStorage` under the key `"lang"` and initialized on app load. The `useLanguage` hook exposes:

```typescript
const { lang, toggleLanguage } = useLanguage();
// lang: 'en' | 'ar'
// toggleLanguage: () => void
```

On language switch, the `<html>` element's `dir` attribute is updated immediately:

```typescript
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = lang;
```

### 7.3 Bilingual Data

Menu item and category names/descriptions exist in both languages as separate database columns (`NameEn`, `NameAr`, `DescriptionEn`, `DescriptionAr`). The frontend selects the appropriate field based on `lang`:

```typescript
const name = lang === 'ar' ? item.nameAr : item.nameEn;
```

---

## 8. Deployment Architecture

### 8.1 Target Infrastructure

```
┌──────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                  │
│                                                      │
│  React SPA  →  CDN Edge Network (global)             │
│  Build: vite build  →  dist/                         │
│  Env var: VITE_API_URL=https://api.cafelumiere.com   │
└────────────────────────┬─────────────────────────────┘
                         │ HTTPS API calls
┌────────────────────────▼─────────────────────────────┐
│              RAILWAY / RENDER (Backend)               │
│                                                      │
│  .NET 10 container (Linux)                           │
│  Port: 8080 (mapped from 5258 in dev)                │
│  Env vars: DEFAULTCONNECTION, JWT_*, ASPNETCORE_*    │
│                                                      │
│  Auto-migrates DB on startup                         │
│  Auto-seeds data on startup (idempotent)             │
└────────────────────────┬─────────────────────────────┘
                         │ Npgsql connection string
┌────────────────────────▼─────────────────────────────┐
│          SUPABASE / RAILWAY POSTGRESQL                │
│                                                      │
│  PostgreSQL 15+                                      │
│  SSL required in production                          │
│  Connection string in DEFAULTCONNECTION env var      │
└──────────────────────────────────────────────────────┘
```

### 8.2 Environment Variables

#### Backend (`backend/Presentation/.env` — never committed)

| Variable | Description |
|---|---|
| `DEFAULTCONNECTION` | Full PostgreSQL connection string |
| `JWT_SECRET_KEY` | Signing key, minimum 32 characters |
| `JWT_ISSUER` | Token issuer claim (e.g., `CafeLumiere`) |
| `JWT_AUDIENCE` | Token audience claim (e.g., `CafeLumiereAdmin`) |
| `JWT_LIFETIME_MINUTES` | Token validity duration (e.g., `1440` for 24 h) |

#### Frontend (`frontend/.env.production` — never committed)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Production API base URL |

### 8.3 Development vs Production

| Concern | Development | Production |
|---|---|---|
| API URL | Vite proxy `/api` → `http://localhost:5258` | `VITE_API_URL` env var |
| CORS origin | `http://localhost:5173` | `https://cafe-lumiere.vercel.app` |
| Database | Local PostgreSQL | Supabase / Railway managed |
| Secrets | `backend/Presentation/.env` via DotNetEnv | Platform environment variables |
| OpenAPI UI | `/scalar/` enabled | `/scalar/` enabled (can be disabled) |

---

## 9. Technology Decisions

| Decision | Chosen | Alternatives Considered | Rationale |
|---|---|---|---|
| Backend framework | .NET 10 / ASP.NET Core | Node.js/Express, FastAPI | Strong typing, Clean Architecture patterns, performance, industry relevance |
| ORM | EF Core 10 | Dapper, raw SQL | Migrations, LINQ queries, DateOnly/TimeOnly support, reduced boilerplate |
| Database | PostgreSQL | MySQL, SQLite | Reliability, JSON support, EF Core/Npgsql ecosystem, PaaS availability |
| DTO mapping | Mapster | AutoMapper, manual mapping | Faster than AutoMapper, simpler config API, no reflection proxy overhead |
| Validation | FluentValidation | Data Annotations, manual | Fluent DSL, testable validators, separation from domain models |
| Error handling | Result Pattern | Exceptions, ProblemDetails | Predictable control flow, no exception abuse, strongly typed error types |
| API documentation | .NET 10 OpenAPI + Scalar | Swashbuckle, NSwag | Native .NET 10 support; Swashbuckle has v2/v3 conflict in .NET 10 |
| Frontend framework | React 18 | Vue 3, Next.js | Ecosystem breadth, TypeScript integration, component model |
| Build tool | Vite 6 | CRA, Webpack | Fast HMR, native ESM, minimal config |
| CSS framework | Tailwind v4 | CSS Modules, styled-components | Utility-first, design token system, RTL support via `dir` attribute |
| Animation | Framer Motion | CSS transitions, GSAP | Declarative React API, `whileInView`, spring physics |
| State management | React Context | Redux, Zustand | App complexity does not justify a state library; Context is sufficient |
| i18n | Custom | i18next, react-intl | Zero dependencies, full control, simpler for a two-language app |
| Auth mechanism | JWT Bearer | Session cookies, OAuth | Stateless, fits SPA architecture, no server-side session storage needed |
| Password hashing | BCrypt | Argon2, PBKDF2 | Well-established, built-in work factor, excellent C# library support |
