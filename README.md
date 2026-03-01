<div align="center">

# Café Lumière

**A full-stack, bilingual restaurant management platform**

.NET 10 Clean Architecture · React 19 + TypeScript · Tailwind CSS v4 · PostgreSQL

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Overview

Café Lumière is a full-stack restaurant web platform with a customer-facing website and a fully functional admin dashboard. It supports bilingual content in **English (LTR)** and **Arabic (RTL)**, with automatic layout direction switching.

---

## Screenshots

| Home | Menu |
|:----:|:----:|
| ![Home](images/home-hero.png) | ![Menu](images/menu-page-en.png) |

| Admin Dashboard | Reservations |
|:---------------:|:------------:|
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
- **Home** — hero section, featured menu items, testimonials carousel, and interactive location map
- **Menu** — category tabs, item cards with detail modal, bilingual names and descriptions
- **Reservations** — 3-step form (date & time → guest details → confirmation) with WhatsApp integration
- **About** — story, values, and team section
- **Contact** — contact form + info panel with map

### Admin Dashboard
- **Dashboard** — stats cards (today's reservations, pending, total items, unread messages), weekly chart, recent activity feed
- **Menu management** — full CRUD for items and categories, availability/featured toggles, drag-and-drop reorder
- **Reservation management** — filterable table (by date, status, name), inline status actions with optimistic updates, detail modal, WhatsApp quick-reply
- **Messages** — two-panel inbox, mark-as-read, reply via email, delete

---

## Tech Stack

### Backend

| Package | Version | Purpose |
|:--------|:--------|:--------|
| .NET / ASP.NET Core | 10.0 | Web API framework |
| Entity Framework Core | 10.0 | ORM |
| Npgsql EF Provider | 10.0 | PostgreSQL driver |
| JWT Bearer Auth | 10.0 | Authentication |
| BCrypt.Net-Next | 4.1 | Password hashing |
| Mapster | 7.4 | DTO mapping |
| FluentValidation | 12.1 | Request validation |
| Scalar | 2.x | API documentation UI |
| DotNetEnv | 3.1 | `.env` file loading |

Architecture: **Clean Architecture** — Domain → Application → Infrastructure → Presentation
Patterns: Repository, Unit of Work, Result Pattern, Dependency Injection

### Frontend

| Package | Version | Purpose |
|:--------|:--------|:--------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety (strict mode) |
| Vite | 7 | Build tool |
| Tailwind CSS | v4 | Styling |
| Framer Motion | 12 | Animations |
| React Hook Form + Zod | 7 + 4 | Forms and validation |
| TanStack Query | 5 | Server state management |
| Axios | 1 | HTTP client |
| i18next + react-i18next | 25 + 16 | AR/EN internationalization |
| React Router | 7 | Client-side routing |
| Recharts | 3 | Dashboard charts |
| @dnd-kit | 6/10 | Drag-and-drop reorder |
| React Leaflet | 5 | Interactive map |
| react-hot-toast | 2 | Toast notifications |

---

## Project Structure

```
cafe-lumiere/
├── backend/
│   ├── Domain/              # Entities, enums — no dependencies
│   ├── Application/         # Services, DTOs, interfaces, validators
│   ├── Infrastructure/      # EF Core, repositories, auth, UoW, seeder
│   └── Presentation/        # ASP.NET controllers, middleware, Program.cs
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI, layout, admin, public components
│       ├── pages/           # public/ and admin/ page components
│       ├── services/        # Axios API functions
│       ├── hooks/           # Custom hooks
│       ├── contexts/        # AuthContext
│       ├── types/           # TypeScript interfaces
│       ├── i18n/            # en.json and ar.json translations
│       └── utils/           # Constants, helpers, image URLs
├── docs/                    # Project documentation
├── images/                  # Screenshots
├── CafeLumiere.slnx
└── README.md
```

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)

### Backend

```bash
# From the repo root
cd backend/Presentation

# Create a .env file (see Environment Variables below)

# Run — migrations and seed data are applied automatically on first start
dotnet run
```

API: `http://localhost:5258`
API docs (Scalar): `http://localhost:5258/scalar/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`
All `/api/*` requests are proxied to the backend automatically.

### Default Admin Account

Seeded automatically on first run:

| Field | Value |
|:------|:------|
| Email | `admin@cafe.com` |
| Password | `Admin123!` |

---

## Environment Variables

Create `backend/Presentation/.env`:

```env
DEFAULTCONNECTION=Host=localhost;Port=5432;Database=cafe-lumiere;Username=postgres;Password=yourpassword;
JWT_SECRET_KEY=your-secret-key-min-32-characters
JWT_ISSUER=https://localhost
JWT_AUDIENCE=https://localhost
JWT_LIFETIME_MINUTES=60
```

---

## API Reference

Explore all endpoints interactively at `/scalar/` when the backend is running.

| Method | Endpoint | Auth | Description |
|:-------|:---------|:----:|:------------|
| `POST` | `/api/auth/login` | — | Admin login |
| `POST` | `/api/auth/register` | — | Register a user |
| `GET` | `/api/categories` | — | List all categories |
| `POST` | `/api/categories` | ✓ | Create category |
| `PUT` | `/api/categories/{id}` | ✓ | Update category |
| `DELETE` | `/api/categories/{id}` | ✓ | Delete category |
| `GET` | `/api/menu-items` | — | List all menu items |
| `GET` | `/api/menu-items/featured` | — | Featured items only |
| `POST` | `/api/menu-items` | ✓ | Create menu item |
| `PUT` | `/api/menu-items/{id}` | ✓ | Update menu item |
| `DELETE` | `/api/menu-items/{id}` | ✓ | Delete menu item |
| `POST` | `/api/reservations` | — | Submit a reservation |
| `GET` | `/api/reservations` | ✓ | List all reservations |
| `PATCH` | `/api/reservations/{id}/status` | ✓ | Update status |
| `DELETE` | `/api/reservations/{id}` | ✓ | Delete reservation |
| `POST` | `/api/contact-messages` | — | Submit contact message |
| `GET` | `/api/contact-messages` | ✓ | List all messages |
| `GET` | `/api/contact-messages/unread` | ✓ | Unread messages only |
| `PATCH` | `/api/contact-messages/{id}/read` | ✓ | Mark as read |
| `DELETE` | `/api/contact-messages/{id}` | ✓ | Delete message |

`✓` = requires Bearer token

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built by [Hocine Bechebil](https://www.linkedin.com/in/hocine-bechebil/)

</div>