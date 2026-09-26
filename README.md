# CodePulse

A full-stack competitive programming dashboard that unifies **LeetCode**, **Codeforces**, **CodeChef**, and **AtCoder** into a single, high-density telemetry platform — track ratings, sync submissions, monitor upcoming contests, and manage problem ledgers in the signature **Parchment Light** design system.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Design Aesthetics](#design-aesthetics)
- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

Competitive programmers typically juggle 4–5 platforms simultaneously — tracking ratings in separate tabs, missing contest announcements, and lacking a unified telemetry view of their progress. **CodePulse** solves this.

It synthesizes submissions, rating trajectories, contest schedules, and 52-week activity heatmaps from multiple platforms into one engineered single pane of glass. Built with a production-grade 3-tier MERN architecture, Redis caching, anti-CSRF protection, and dual-token JWT authentication.

---

## Features

- **Unified Command Dashboard** — Total solved count, difficulty breakdown (Easy/Medium/Hard), rating trends, and 52-week submission density ledger across all platforms.
- **Parchment Light Aesthetics** — Engineered editorial telemetry layout featuring warm paper backgrounds (`#FAF8F5`), Playfair Display serif headings, JetBrains Mono tags, and vibrant telemetry orange (`#EF3812`) accents.
- **Multi-Platform Ingestion** — Pull accepted submissions, rating history, and streaks from LeetCode, Codeforces, and CodeChef.
- **Global Contest Radar** — Aggregates upcoming contests across LeetCode, Codeforces, AtCoder, and CodeChef with live countdown timers and RFC-5545 `.ics` / Google Calendar sync.
- **Problem Ledger & Tracker** — Log and filter problems with custom status (solved/attempted/todo), difficulty ratings, tags, execution heuristics, and notes.
- **Auth & Security** — Dual-token JWT session management (`accessToken` & `refreshToken`), HttpOnly cookies, CSRF protection middleware, password hashing with bcrypt, and sanitized API responses.
- **Full Docker Support** — Multi-stage production `Dockerfile` for Next.js, Express API container, and `docker-compose` orchestration for MongoDB, Redis, Backend, and Frontend.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14 Frontend                  │
│       (TypeScript · Tailwind · Recharts · Parchment)    │
└────────────────────────────┬────────────────────────────┘
                             │ Axios (REST + CSRF Token)
┌────────────────────────────▼────────────────────────────┐
│                  Express.js Backend API                 │
│         Controllers → Services → MongoDB Atlas          │
└────────┬────────────────────────────────────────────────┘
         │
         ├──── LeetCode GraphQL API
         ├──── Codeforces REST API
         ├──── AtCoder Contest Aggregator
         │
         └──── CodeChef Scraper & Redis Cache Engine
                        │
                ┌───────▼────────┐
                │  Redis Cache   │
                │  (ioredis)     │
                └───────┬────────┘
                        │ cache miss
                ┌───────▼────────┐
                │ Axios + Cheerio│
                │ (HTML scraping)│
                └────────────────┘
```

**Sync Pipeline:**
`User triggers sync` → `sync.controller.js` → `acquireLock(username)` → `platform service` → `normalize telemetry` → `upsert Progress & User models` → `releaseLock` → `return JSON`

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js (v5), MongoDB, Mongoose (v9), JWT, bcrypt |
| **Caching & Locking** | Redis (ioredis) |
| **Database** | MongoDB Atlas |
| **Containerization** | Docker, Docker Compose, Multi-stage Alpine Node images |
| **Auth & Security** | Dual-Token JWT (Access + Refresh), HttpOnly SameSite Cookies, Anti-CSRF Middleware |

---

## Design Aesthetics

CodePulse uses a **Parchment Light** telemetry visual style inspired by technical mono-dashboards:
- **Base Background:** `#FAF8F5` (Warm parchment off-white)
- **Primary Accent:** `#EF3812` (Vibrant telemetry orange-red)
- **Status Green:** `#0D8050` / `#10B981` (`SYNC OPERATIONAL`)
- **Typography:** Playfair Display (Headings), JetBrains Mono (Telemetry tags & metrics), DM Sans (Body)
- **Borders:** `#E8E4DC` (Crisp 1px warm borders)

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** URI (Local or MongoDB Atlas)
- **Redis** server running on `localhost:6379` (or Docker)

### 1. Clone the repository

```bash
git clone https://github.com/Neel092/DSA_Tracker.git
cd DSA_Tracker
```

### 2. Backend setup

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

Backend will run on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd Frontend
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`.

---

## Docker Setup

Run the full MERN stack (MongoDB, Redis, Backend Express API, and Frontend Next.js Web App) with a single command:

```bash
# Build and launch all 4 containers in background
docker compose up --build -d
```

| Container | Port | Service |
|---|---|---|
| `codepulse-frontend` | `http://localhost:3000` | Next.js Web App |
| `codepulse-backend` | `http://localhost:5000` | Express REST API |
| `codepulse-mongodb` | `27017` | MongoDB Database |
| `codepulse-redis` | `6379` | Redis Caching Service |

To stop the containers:
```bash
docker compose down
```

---

## Environment Variables

### Backend — `Backend/.env`

```env
PORT=5000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SALT_ROUNDS=10
REDIS_URL=redis://localhost:6379
```

### Frontend — `Frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login and receive HTTP-only cookies |
| `POST` | `/api/auth/logout` | Clear auth cookies & revoke session |
| `POST` | `/api/auth/refresh-token` | Generate new access token using refresh token |
| `GET` | `/api/auth/profile` | Get current authenticated user profile |
| `GET` | `/api/auth/csrf-token` | Issue CSRF protection token |
| `PUT` | `/api/auth/update-profile` | Update display name, college, and handles |
| `POST` | `/api/auth/update-password` | Change user password |

### Problem Tracker (`/api/progress`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/progress/my` | Get all logged problems for current user |
| `POST` | `/api/progress/add` | Log a new problem entry |
| `GET` | `/api/progress/stats` | Retrieve platform & difficulty stats |
| `DELETE` | `/api/progress/delete` | Delete problem entry |

### Telemetry Sync (`/api/sync`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/sync/leetcode` | Ingest LeetCode submissions & contest rating |
| `POST` | `/api/sync/codeforces` | Ingest Codeforces ratings & submission history |
| `POST` | `/api/sync/codechef` | Ingest CodeChef stats via Redis cache/scraper |
| `POST` | `/api/sync/all` | Trigger full parallel sync across all handles |

### Contests (`/api/contests`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/contests/all` | Get aggregated contest schedule (LC, CF, CC, AtCoder) |
| `GET` | `/api/contests/upcoming` | Fetch live upcoming contest radar |


---

## Roadmap

- [x] LeetCode sync
- [x] Codeforces sync
- [x] Custom CodeChef scraper API with Redis caching
- [x] Contest calendar aggregator (LeetCode, Codeforces, AtCoder, CodeChef)
- [x] JWT auth with refresh tokens & CSRF protection
- [x] Problem tracker ledger
- [x] Docker + Multi-stage production containerization
- [ ] AtCoder problem submission sync
- [ ] GeeksforGeeks sync
- [ ] Background sync jobs (cron-based worker)
- [ ] Leaderboard among friends
- [ ] Company-specific problem roadmaps

---

## Author

**Neel Patil** — CS Engineering Student

[GitHub](https://github.com/Neel092)

---