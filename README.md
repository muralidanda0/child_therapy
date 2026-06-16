# Little Hearts Therapy Center

A full-stack children's therapy center website — warm, trustworthy, and fully functional for parents and therapists.

## Tech Stack

- **Frontend:** HTML5, CSS3, EJS (server-side rendering)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** express-session + bcrypt password hashing
- **Roles:** parent | therapist | admin

## Features

- Homepage with hero, services preview, how-it-works, testimonials
- Services page with detailed therapy cards, therapist showcase, FAQ accordion
- 3-step appointment booking wizard (parent-only, session-protected)
- Parent dashboard: appointments, children, messages, settings
- Therapist dashboard: schedule, clients, session notes, availability grid
- Login / Register with role-specific fields
- About page with values, team, timeline
- Contact form with MongoDB storage + optional email via nodemailer

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### Installation

```bash
npm install
cp .env.example .env   # edit MONGODB_URI if needed
npm run seed           # optional: seed demo therapists
npm run dev
```

Visit **http://localhost:3000**

### Demo Accounts (after seeding)

| Role      | Email                              | Password     |
|-----------|-------------------------------------|--------------|
| Parent    | parent@example.com                  | password123  |
| Therapist | emily.chen@littleheartstherapy.com  | password123  |

## Project Structure

```
├── config/          # Database connection
├── controllers/     # Route handlers (MVC)
├── middleware/      # Auth, flash messages, locals
├── models/          # Mongoose schemas
├── public/          # CSS, JS, static assets
├── routes/          # Express routes
├── scripts/         # Seed script
├── views/
│   ├── pages/       # Full page templates
│   └── partials/    # Reusable EJS components
└── server.js        # App entry point
```

## Key Routes

| Method | Route                    | Description              |
|--------|--------------------------|--------------------------|
| GET    | `/`                        | Homepage                 |
| GET    | `/services`                | Services page            |
| GET    | `/about`                   | About us                 |
| GET    | `/contact`                 | Contact page             |
| POST   | `/contact`                 | Submit contact form      |
| GET    | `/login`                   | Login page               |
| POST   | `/auth/login`              | Authenticate user        |
| GET    | `/register`                | Registration page        |
| POST   | `/auth/register`           | Create account           |
| GET    | `/appointments/new`        | Booking wizard (parent)  |
| POST   | `/appointments/new`        | Create appointment       |
| GET    | `/parent/dashboard`        | Parent portal            |
| GET    | `/therapist/dashboard`     | Therapist portal         |
| POST   | `/sessions/:id/notes`      | Save session note        |
| PUT    | `/therapist/availability`  | Update availability      |

## Design System

| Token    | Value     |
|----------|-----------|
| Primary  | `#4ECDC4` |
| Accent   | `#FF6B6B` |
| Background | `#FAFAF8` |
| Text     | `#2C2C2A` |
| Success  | `#A8E6CF` |

Fonts: **Nunito** (headings), **Inter** (body)

## License

MIT
