# EntertainmentHQ 🌐

> A modern, full-stack Event Management Portal with digital ticket pass generation, role-based access control, and real-time database management.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide React Icons, React Router v6
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database & Authentication**: Supabase (PostgreSQL), `@supabase/supabase-js`
- **Deployment Tier**: 100% Free Tier compatible (Supabase Postgres, Vercel frontend, Render backend)

---

## ✨ Features List

### 🎟️ Attendee Features
- **Event Discovery**: Browse upcoming events with live search bar by title and category filtering (Technology, Music, Business, Workshops, Social, General).
- **Event Details View**: Full event overview including date, time, venue, capacity metrics, and organizer badge.
- **One-Click Event Registration**: Real-time capacity check and duplicate registration prevention.
- **Digital Pass Generation**: Instant generation of a unique Ticket ID (`TCKT-XXXX`) formatted as a digital pass ticket with print support.
- **Pass Management**: Tabbed view for active upcoming event passes and past event history with option to cancel registrations.
- **User Authentication**: Secure signup and login powered by Supabase Auth with automatic session persistence.

### 🛡️ Admin & Organizer Features
- **Admin Dashboard Overview**: Live platform metrics detailing Total Events, Upcoming Events, Completed Events, and Total Configured Capacities.
- **Events Management Suite**: Interactive data table to search, create, edit, or delete event listings with image previews.
- **Attendee Roster Inspection**: Access per-event attendee rosters detailing user names, emails, ticket IDs, and registration timestamps.
- **Role-Based Protection**: Strict backend middleware route protection (`protect` & `adminOnly`) and frontend `AdminRoute` guards.

---

## 📁 Project Structure

```
EntertainmentHQ/
├── server/
│   ├── config/
│   │   └── supabase.js             # Supabase client wrapper
│   ├── controllers/
│   │   ├── auth.controller.js      # Register, Login, GetMe controllers
│   │   ├── events.controller.js    # Event CRUD & Attendees roster controllers
│   │   └── registrations.controller.js # Registration & cancellation controllers
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT token protect & adminOnly middleware
│   ├── routes/
│   │   ├── health.routes.js        # Health check endpoint (/api/health)
│   │   ├── auth.routes.js          # Authentication routes (/api/auth)
│   │   ├── events.js               # Event management routes (/api/events)
│   │   └── registrations.js        # Registration routes (/api/registrations)
│   ├── schema.sql                  # PostgreSQL table creation DDL script
│   ├── rls.sql                     # Row Level Security & trigger automation script
│   ├── index.js                    # Express app entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/                    # API service clients (auth, events, registrations)
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with navigation & responsive mobile menu
│   │   │   ├── Footer.jsx          # Site footer
│   │   │   ├── AdminLayout.jsx     # Admin sidebar container
│   │   │   ├── ProtectedRoute.jsx  # Auth & Admin route guards
│   │   │   ├── TicketView.jsx      # Digital event pass ticket modal
│   │   │   ├── LoadingSpinner.jsx  # Reusable animated spinner
│   │   │   └── PageTransition.jsx  # Framer motion route transition wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication state
│   │   ├── pages/
│   │   │   ├── EventsList.jsx      # Public event discovery grid
│   │   │   ├── EventDetail.jsx     # Event details & registration page
│   │   │   ├── MyEvents.jsx        # Attendee ticket management page
│   │   │   ├── Login.jsx           # User login page
│   │   │   ├── Register.jsx        # User signup page
│   │   │   ├── NotFound.jsx        # 404 page
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx     # Admin metrics overview
│   │   │       ├── AdminEvents.jsx        # Event CRUD management table
│   │   │       └── AdminEventAttendees.jsx # Per-event attendee roster view
│   │   ├── App.jsx
│   │   ├── index.css               # Tailwind CSS directives
│   │   └── main.jsx
│   ├── vite.config.js              # Vite configuration & API proxy (/api -> :5000)
│   └── package.json
├── README.md
└── API_DOCS.md
```

---

## 🚀 Running Locally — Step-by-Step Guide

Follow these steps **in order** to get EntertainmentHQ running on your machine.

### ✅ Prerequisites

Make sure you have the following installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or higher | [nodejs.org](https://nodejs.org) |
| npm | Comes with Node.js | — |
| Git | Any recent version | [git-scm.com](https://git-scm.com) |

> 📦 **No Supabase account needed!** This project uses a pre-configured demo database — just copy the values in the steps below.

---

### Step 1 — Clone the Repository

Open your terminal and run:

```bash
git clone <your-repo-url>
cd "Event Manager"
```

> If you already have the project folder, just `cd` into it.

---

### Step 2 — Database

> ✅ **Nothing to do here.** This project connects to a pre-configured demo Supabase database. No account, no setup, no SQL to run — the credentials are already included in Step 3 and Step 4 below.

---

### Step 3 — Configure & Start the Backend (Server)

**Open Terminal 1** and run the following commands one by one:

```bash
# 1. Navigate to the server folder
cd server

# 2. Install dependencies
npm install

# 3. Create the environment file
cp .env.example .env
```

Create a `server/.env` file with the following content (copy-paste as-is):

```env
PORT=5000
SUPABASE_URL=https://hsygqtygxdvagfxctbuy.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeWdxdHlneGR2YWdmeGN0YnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDc0MDEsImV4cCI6MjEwMTU4MzQwMX0.CVDmZURQK49gNUwkQWcrbYXjVlFXZVzWf27J9YZskGo
JWT_SECRET=any-long-random-secret-string
```

```bash
# 4. Start the backend dev server
npm run dev
```

✅ You should see: `Server running on http://localhost:5000`

---

### Step 4 — Configure & Start the Frontend (Client)

**Open Terminal 2** (keep Terminal 1 running) and run:

```bash
# 1. Navigate to the client folder (from the project root)
cd client

# 2. Install dependencies
npm install

# 3. Create the environment file
cp .env.example .env
```

Create a `client/.env` file with the following content (copy-paste as-is):

```env
VITE_PUBLIC_TICKET_URL=http://localhost:5173
VITE_SUPABASE_URL=https://hsygqtygxdvagfxctbuy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeWdxdHlneGR2YWdmeGN0YnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDc0MDEsImV4cCI6MjEwMTU4MzQwMX0.CVDmZURQK49gNUwkQWcrbYXjVlFXZVzWf27J9YZskGo
```

```bash
# 4. Start the frontend dev server
npm run dev
```

✅ You should see: `Local: http://localhost:5173`

---

### Step 5 — Open the App

Open your browser and go to:

```
http://localhost:5173
```

The frontend will automatically proxy all `/api` requests to the backend at `http://localhost:5000`.

---

### 🗂️ Summary of Terminal Commands

```bash
# Terminal 1 — Backend
cd server
npm install
npm run dev          # Runs on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm install
npm run dev          # Runs on http://localhost:5173
```

---

### 🛑 Stopping the Servers

Press `Ctrl + C` in each terminal to stop the respective server.

---

### ⚠️ Common Issues

| Issue | Fix |
|-------|-----|
| `EADDRINUSE: port 5000` | Another process is using port 5000. Kill it or change `PORT` in `server/.env`. |
| Blank page / API errors | Make sure the backend (Terminal 1) is running before using the frontend. |
| Supabase auth errors | Double-check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in both `.env` files. |
| `nodemon: command not found` | Run `npm install` inside the `server/` folder first. |

---

## 📸 Screenshots

*(Add screenshots of your application here)*

- **Event Discovery & Search**: `[Add screenshot link]`
- **Event Detail & Instant Pass**: `[Add screenshot link]`
- **My Digital Tickets Modal**: `[Add screenshot link]`
- **Admin Control Dashboard**: `[Add screenshot link]`
- **Admin Event Attendees Roster**: `[Add screenshot link]`

---

## 🌐 Deployment Notes (100% Free Tier)

1. **Database**: Hosted on **Supabase** Free PostgreSQL Tier.
2. **Backend API**: Can be deployed to **Render** (as a Web Service) or **Railway**.
   - Set Environment Variables: `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET`.
3. **Frontend Client**: Can be deployed to **Vercel** or **Netlify**.
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist`
   - Set Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
