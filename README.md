<div align="center">

# Café Lumière

**A full-stack, bilingual restaurant management platform**

.NET 10 · Clean Architecture · React 19 · TypeScript · Tailwind CSS v4 · PostgreSQL

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Overview

Café Lumière is a production-ready restaurant web platform combining a premium customer-facing website with a fully functional admin dashboard. It supports bilingual content in **English (LTR)** and **Arabic (RTL)** with automatic layout direction switching.

---

## Screenshots

| Home | Menu |
|:----:|:----:|
| ![Home](images/home-hero.png) | ![Menu](images/menu-page-en.png) |

| Admin Dashboard | Reservation Management |
|:---------------:|:----------------------:|
| ![Dashboard](images/admin-dashboard.png) | ![Reservations](images/admin-reservations.png) |

| Menu Management | Messages Inbox |
|:---------------:|:--------------:|
| ![Menu Admin](images/admin-menu-table.png) | ![Messages](images/admin-messages.png) |

| Arabic — Menu | Arabic — Home |
|:-------------:|:-------------:|
| ![AR Menu](images/menu-page-ar.png) | ![AR Home](images/home-specialties-ar.png) |

---

## Features

### Customer Website
- **Home** — hero section, featured menu items, testimonials, and location map
- **Menu** — category tabs, item cards with detail modal, bilingual names and descriptions
- **Reservations** — 5-step form (date & time → party size → guest details → confirmation → success) with WhatsApp deep link
- **About** — restaurant story, values, and team section
- **Contact** — contact form + info panel with embedded map

### Admin Panel
- **Dashboard** — stats overview (today's reservations, pending count, total items, unread messages), weekly chart, recent activity feed
- **Menu Management** — full CRUD for items and categories, availability and featured toggles, drag-and-drop reorder
- **Reservation Management** — filterable table (by date and status), inline status updates, detail modal, WhatsApp quick-reply
- **Messages** — two-panel inbox, mark-as-read, delete

---

## Tech Stack

### Backend

| Package | Version | Purpose |
|:--------|:-------:|:--------|
| ASP.NET Core | 10.0 | Web API framework |
| Entity Framework Core + Npgsql | 10.0 | ORM + PostgreSQL driver |
| JWT Bearer Auth | 10.0 | Stateless authentication |
| BCrypt.Net-Next | 4.x | Password hashing |
| Mapster | 7.x | DTO mapping |
| FluentValidation | 12.x | Request validation |
| Scalar | 2.x | Interactive API docs UI |
| DotNetEnv | 3.x | `.env` file loading |

**Architecture:** Clean Architecture — Domain → Application → Infrastructure → Presentation
**Patterns:** Repository, Unit of Work, Result Pattern, Dependency Inversion

### Frontend

| Package | Version | Purpose |
|:--------|:-------:|:--------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Strict type safety |
| Vite | 7 | Build tool + dev server |
| Tailwind CSS | v4 | Utility-first styling |
| Framer Motion | 12 | Animations |
| React Hook Form + Zod | 7 + 4 | Forms and schema validation |
| TanStack Query | 5 | Server state management |
| Axios | 1 | HTTP client |
| i18next + react-i18next | 25 + 16 | AR/EN internationalization |
| React Router | 7 | Client-side routing |
| Recharts | 3 | Dashboard charts |
| @dnd-kit | 6/10 | Drag-and-drop reorder |
| React Leaflet | 5 | Interactive map |
| react-hot-toast | 2 | Toast notifications |
| Lucide React | 0.5x | Icon library |

---

## Project Structure

```
cafe-lumiere/
├── backend/
│   ├── Domain/              # Entities, enums — zero external dependencies
│   ├── Application/         # Services, DTOs, interfaces, validators, mappers
│   ├── Infrastructure/      # EF Core, repositories, UnitOfWork, AuthService, seeder
│   └── Presentation/        # Controllers, ResultExtensions, Program.cs
├── frontend/
│   └── src/
│       ├── components/      # ui/, layout/, home/, menu/, reservation/, about/, contact/, admin/
│       ├── pages/           # public/ and admin/ page components
│       ├── services/        # Axios API service layer
│       ├── hooks/           # useAuth, useLanguage
│       ├── contexts/        # AuthContext (JWT state)
│       ├── types/           # TypeScript interfaces
│       ├── i18n/            # en.json, ar.json, index.ts
│       └── utils/           # cn, constants, images, demoData
├── docs/
│   ├── PRD.md               # Product Requirements Document
│   ├── SRS.md               # Software Requirements Specification
│   ├── ARCHITECTURE.md      # System design and technology decisions
│   └── API.md               # Full API reference
├── images/                  # Screenshots
├── Dockerfile               # Multi-stage build for the backend
├── railway.json             # Railway deployment configuration
├── CafeLumiere.slnx
└── README.md
```

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/)

### Backend

```bash
# Create and configure your environment file
cp backend/Presentation/.env.example backend/Presentation/.env
# Edit .env with your values (see Environment Variables below)

# Run — migrations and seed data apply automatically on first start
cd backend/Presentation
dotnet run
```

- API base: `http://localhost:5258`
- Interactive docs (Scalar): `http://localhost:5258/scalar/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`
- All `/api/*` requests proxy to the backend automatically via Vite config

### Default Admin Credentials

Seeded automatically on first run:

| Field | Value |
|:------|:------|
| Email | `admin@cafe.com` |
| Password | `Admin123!` |

---

## Environment Variables

Create `backend/Presentation/.env`:

```env
DEFAULTCONNECTION=Host=localhost;Port=5432;Database=cafe_lumiere;Username=postgres;Password=yourpassword
JWT_SECRET_KEY=your-secret-key-minimum-32-characters-long
JWT_ISSUER=CafeLumiere
JWT_AUDIENCE=CafeLumiereAdmin
JWT_LIFETIME_MINUTES=1440
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

---

## API Reference

Full documentation with request/response schemas is in [`docs/API.md`](docs/API.md).
Interactive exploration is available at `/scalar/` when the backend is running.

| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `POST` | `/api/auth/register` | — | Register an admin user |
| `POST` | `/api/auth/login` | — | Authenticate and receive JWT |
| `GET` | `/api/categories` | — | List all categories |
| `GET` | `/api/categories/{id}` | — | Get category by ID |
| `POST` | `/api/categories` | ✓ | Create category |
| `PUT` | `/api/categories/{id}` | ✓ | Update category |
| `DELETE` | `/api/categories/{id}` | ✓ | Delete category |
| `GET` | `/api/menuitems` | — | List all menu items |
| `GET` | `/api/menuitems/{id}` | — | Get menu item by ID |
| `GET` | `/api/menuitems/category/{categoryId}` | — | Items by category |
| `POST` | `/api/menuitems` | ✓ | Create menu item |
| `PUT` | `/api/menuitems/{id}` | ✓ | Update menu item |
| `DELETE` | `/api/menuitems/{id}` | ✓ | Delete menu item |
| `POST` | `/api/reservations` | — | Submit a reservation |
| `GET` | `/api/reservations` | ✓ | List all reservations |
| `GET` | `/api/reservations/{id}` | ✓ | Get reservation by ID |
| `GET` | `/api/reservations/date/{date}` | ✓ | Reservations by date |
| `GET` | `/api/reservations/status/{status}` | ✓ | Reservations by status |
| `PATCH` | `/api/reservations/{id}/status` | ✓ | Update reservation status |
| `DELETE` | `/api/reservations/{id}` | ✓ | Delete reservation |
| `POST` | `/api/contactmessages` | — | Submit contact message |
| `GET` | `/api/contactmessages` | ✓ | List all messages |
| `GET` | `/api/contactmessages/{id}` | ✓ | Get message by ID |
| `PATCH` | `/api/contactmessages/{id}/read` | ✓ | Mark message as read |
| `DELETE` | `/api/contactmessages/{id}` | ✓ | Delete message |

`✓` = requires `Authorization: Bearer <token>`

---

## Deployment

### Backend — Railway

1. Add a **PostgreSQL** plugin to your Railway project.
2. Connect your GitHub repo — Railway auto-detects the `Dockerfile` and `railway.json`.
3. Set environment variables in the Railway service dashboard:

```env
DEFAULTCONNECTION     # Copy the connection string from the PostgreSQL plugin
JWT_SECRET_KEY        # Min 32 characters
JWT_ISSUER            # CafeLumiere
JWT_AUDIENCE          # CafeLumiereAdmin
JWT_LIFETIME_MINUTES  # 1440
CORS_ORIGIN           # Your Vercel frontend URL
```

### Frontend — Vercel

1. Import the repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variable:

```env
VITE_API_URL=https://your-backend.railway.app
```

---

## Documentation

| Document | Description |
|:---------|:------------|
| [PRD.md](docs/PRD.md) | Product Requirements — personas, functional requirements, user stories, success metrics |
| [SRS.md](docs/SRS.md) | Software Requirements Specification (IEEE 830) — requirements with traceable IDs, data model, acceptance criteria |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design — Clean Architecture breakdown, auth flow, deployment topology, technology decisions |
| [API.md](docs/API.md) | Full API reference — all endpoints with request/response schemas and TypeScript types |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built by [Hocine Bechebil](https://www.linkedin.com/in/hocine-bechebil/)

</div>
