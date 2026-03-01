# Project: Café Lumière — Modern Restaurant & Café Website

## Overview

Café Lumière is a full-stack restaurant/café website built as a freelance portfolio piece. It demonstrates end-to-end web development capabilities: a stunning public-facing website for customers and a functional admin panel for business owners. The project targets real-world use — any restaurant, café, or food business owner should look at this and immediately think "I want this for my business."

The name "Lumière" (French for "light") fits the modern minimalist café aesthetic. The branding is warm, clean, and premium.

## Purpose

This is NOT a learning project. This is a client-ready product demo. Every decision should optimize for:
1. Visual impact — this goes on Behance and must look stunning in screenshots
2. Client persuasion — a restaurant owner with zero tech knowledge should understand the value immediately
3. Proof of skill — a technical reviewer on Upwork should see clean code, proper architecture, and real functionality

## Design Direction

- **Aesthetic:** Modern minimalist with warm tones. Think specialty coffee shop or upscale brunch spot.
- **Color palette:** Warm neutrals — cream/off-white backgrounds, charcoal text, warm brown/copper accents, subtle olive or sage green as secondary accent
- **Typography:** Clean sans-serif for body (Inter or similar), elegant serif for headings (Playfair Display or similar)
- **Photography style:** Warm, high-quality food photography placeholders (use Unsplash). Lots of whitespace. No clutter.
- **Animations:** Subtle and purposeful — smooth scroll reveals, hover effects on menu items, elegant page transitions. Nothing flashy or distracting.
- **Mobile-first:** Must look perfect on mobile. Restaurant customers browse on their phones.

## Tech Stack

### Frontend
- React 18+ with TypeScript (strict mode, no `any`)
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Hook Form + Zod for form validation
- i18next for internationalization (Arabic RTL + English LTR)
- Axios for API calls
- Lucide React for icons

### Backend
- .NET 9 Web API with C#
- Clean Architecture (Domain → Application → Infrastructure → Presentation)
- Entity Framework Core 9 with PostgreSQL
- Repository Pattern + Unit of Work
- Result Pattern for error handling
- AutoMapper for DTO mapping
- JWT Bearer Authentication (admin panel)
- Swagger/OpenAPI documentation

### Deployment
- Frontend: Vercel
- Backend: Railway or Render
- Database: Supabase PostgreSQL or Railway PostgreSQL
- Images: Cloudinary or static Unsplash URLs for demo

## Architecture

### Frontend Structure
```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input, Modal)
│   ├── layout/          # Header, Footer, MobileNav, AdminSidebar
│   ├── home/            # Hero, FeaturedMenu, Testimonials, Location
│   ├── menu/            # MenuGrid, MenuCard, CategoryTabs, MenuItemDetail
│   ├── reservation/     # ReservationForm, DatePicker, TimeSlots, Confirmation
│   └── admin/           # Dashboard, MenuManager, ReservationList, OrderList
├── pages/
│   ├── public/          # Home, Menu, Reservation, About, Contact
│   └── admin/           # Login, Dashboard, MenuManagement, Reservations
├── hooks/               # Custom hooks (useMenu, useReservation, useAuth)
├── services/            # API service layer
├── i18n/                # Translation files (ar.json, en.json)
├── types/               # TypeScript interfaces and types
├── utils/               # Helpers, formatters, constants
└── assets/              # Images, fonts
```

### Backend Structure (Clean Architecture)
```
CafeLumiere/
├── Domain/
│   ├── Entities/        # MenuItem, Category, Reservation, User, ContactMessage
│   ├── Enums/           # ReservationStatus, MenuItemStatus, UserRole
│   └── Domain.csproj
├── Application/
│   ├── Services/        # MenuService, ReservationService, AuthService, ContactService
│   ├── Interfaces/      # IMenuRepository, IReservationRepository, IUnitOfWork
│   ├── DTOs/            # Request/Response DTOs for each entity
│   ├── Mappers/         # AutoMapper profiles
│   ├── Shared/          # Result<T> pattern
│   └── Application.csproj
├── Infrastructure/
│   ├── Data/            # AppDbContext, EntityConfigurations, Migrations
│   ├── Repositories/    # Repository implementations
│   ├── Authentication/  # JWT service, password hashing
│   ├── UnitOfWork/      # UnitOfWork implementation
│   └── Infrastructure.csproj
├── Presentation/
│   ├── Controllers/     # MenuController, ReservationController, AuthController, ContactController
│   ├── Extensions/      # Result-to-ActionResult mapping
│   └── Presentation.csproj
```

## Data Model

### Category
- Id (Guid)
- NameEn (string) — English name
- NameAr (string) — Arabic name
- DisplayOrder (int)
- IsActive (bool)

### MenuItem
- Id (Guid)
- CategoryId (Guid, FK)
- NameEn, NameAr (string)
- DescriptionEn, DescriptionAr (string)
- Price (decimal)
- ImageUrl (string)
- IsAvailable (bool)
- IsFeatured (bool)
- DisplayOrder (int)
- CreatedAt, UpdatedAt (DateTime)

### Reservation
- Id (Guid)
- CustomerName (string)
- Phone (string)
- Email (string, optional)
- Date (DateOnly)
- Time (TimeOnly)
- PartySize (int)
- SpecialRequests (string, optional)
- Status (enum: Pending, Confirmed, Cancelled, Completed)
- WhatsAppNotified (bool)
- CreatedAt (DateTime)

### ContactMessage
- Id (Guid)
- Name (string)
- Email (string)
- Subject (string)
- Message (string)
- IsRead (bool)
- CreatedAt (DateTime)

### User (Admin)
- Id (Guid)
- FullName (string)
- Email (string)
- PasswordHash (string)
- Role (enum: Admin, Staff)
- CreatedAt (DateTime)

## Pages & Features

### Public Pages

**1. Home Page**
- Hero section with full-bleed image, tagline, and CTA ("View Menu" + "Reserve a Table")
- Featured menu items section (3-4 items with hover effects)
- About teaser with café story and image
- Testimonials/reviews carousel
- Location section with embedded map + opening hours
- Footer with social links, contact info, quick links

**2. Menu Page**
- Category tabs/pills at top (All, Hot Drinks, Cold Drinks, Pastries, Breakfast, etc.)
- Grid of menu items with image, name, description, price
- Click item → modal or detail view with full description
- Smooth filtering animations when switching categories
- Bilingual — all items show in selected language

**3. Reservation Page**
- Multi-step form: Date & Time → Party Details → Contact Info → Confirmation
- Available time slots shown as selectable chips
- Form validation with clear error messages
- Success state with reservation summary
- WhatsApp button to send confirmation directly to restaurant
- Bilingual form labels and validation messages

**4. About Page**
- Café story with rich imagery
- Our values/philosophy section
- Team section (optional, can use placeholder photos)

**5. Contact Page**
- Contact form (name, email, subject, message)
- Embedded Google Map
- Address, phone, email, social media links
- Opening hours

### Admin Panel

**6. Admin Login**
- Clean login form
- JWT token storage and refresh

**7. Admin Dashboard**
- Today's reservations count
- Pending reservations requiring action
- Total menu items
- Recent contact messages
- Quick actions

**8. Menu Management**
- Table/grid view of all menu items
- Add/edit/delete menu items with image upload
- Manage categories
- Toggle availability
- Drag-and-drop reorder (nice-to-have)

**9. Reservation Management**
- List view with filters (date, status)
- Change reservation status (confirm, cancel, complete)
- Click to view full details
- WhatsApp quick-reply button

**10. Contact Messages**
- List of messages with read/unread status
- Click to view full message
- Mark as read

## WhatsApp Integration

When a customer submits a reservation:
1. Backend saves reservation with status "Pending"
2. Frontend shows success screen with a "Send via WhatsApp" button
3. Button opens `https://wa.me/{restaurantNumber}?text={preformattedMessage}`
4. Pre-formatted message includes: customer name, date, time, party size, special requests

Admin can also click "Reply on WhatsApp" from the reservation management panel which opens WhatsApp with the customer's number.

## Internationalization (i18n)

- Full Arabic (RTL) and English (LTR) support
- Language toggle in header
- All static text comes from translation files
- Menu items and categories have separate AR/EN fields in the database
- Direction switches automatically (dir="rtl" / dir="ltr")
- Date and number formatting respects locale

## Quality Standards

- All components fully typed with TypeScript
- Responsive on all screen sizes (mobile, tablet, desktop)
- Loading skeletons for async content
- Error boundaries and user-friendly error states
- Form validation on both client and server
- Semantic HTML for accessibility
- SEO meta tags on all public pages
- Lighthouse score target: 90+ on all metrics
- Clean commit history with conventional commits
