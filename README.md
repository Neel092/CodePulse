# CodePulse

A full-stack competitive programming dashboard that unifies LeetCode, Codeforces, CodeChef, and AtCoder into a single platform — track ratings, sync submissions, and monitor upcoming contests.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [CodeChef API](#codechef-api)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

Competitive programmers typically juggle 4–5 platforms simultaneously — tracking ratings in separate tabs, missing contest announcements, and having no unified view of their progress. **CodePulse** solves this.

It aggregates submissions, ratings, contest schedules, and activity heatmaps from multiple platforms into one clean dashboard. Built with a microservice approach — including a **custom-built CodeChef scraper API** (since CodeChef has no official public API) deployed separately on Railway with Redis caching.

---

## Features

- **Unified Dashboard** — Total solved count, difficulty breakdown, rating trends, and activity heatmap across all platforms
- **Platform Sync** — Pull accepted submissions, rating history, and streaks from LeetCode, Codeforces, and CodeChef
- **Contest Calendar** — Aggregates upcoming contests from all platforms with live countdowns
- **Problem Tracker** — Manually log problems with status, difficulty, platform, tags, and notes
- **Custom CodeChef API** — Self-built REST API with Cheerio scraping + Redis caching since CodeChef has no public API
- **Auth System** — JWT access tokens + refresh tokens, CSRF protection, role-based route guards
- **Profile Management** — Manage platform handles, college info, and visibility settings

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js 14 Frontend             │
│         (TypeScript · Tailwind · Recharts)   │
└─────────────────┬───────────────────────────┘
                  │ Axios (REST)
┌─────────────────▼───────────────────────────┐
│           Express.js Backend API             │
│     Controllers → Services → MongoDB        │
└──────┬──────────────────────────────────────┘
       │
       ├──── LeetCode GraphQL API
       ├──── Codeforces REST API
       ├──── AtCoder (contest aggregator)
       │
       └──── CodeChef Scraper API (microservice)
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

**Sync Flow:**
`User triggers sync` → `sync.controller.js` → `platform service` → `normalize data` → `upsert MongoDB` → `return stats`

**CodeChef Flow:**
`API request` → `check Redis cache` → `HIT: return cached JSON` / `MISS: scrape CodeChef → parse → cache → return`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, Recharts, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt |
| CodeChef API | Node.js, Express.js, Axios, Cheerio, Redis (ioredis) |
| Database | MongoDB Atlas |
| Cache | Redis (Railway) |
| Deployment | Railway (CodeChef API) |
| Auth | JWT (access + refresh tokens), CSRF tokens |

---

## CodeChef API

> A standalone microservice built from scratch because CodeChef has no official public API.

<!-- **Live:** `https://api-production-9299.up.railway.app` -->

### Why a separate service?

- CodeChef does not expose a public REST API
- Built a dedicated scraper service using **Axios + Cheerio**
- **Redis caching** (10 min TTL) prevents redundant scraping and improves response time by ~90% on cache hits
- Deployed independently on **Railway** — decoupled from the main backend

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/:username` | Fetch CodeChef user stats |
| `DELETE` | `/cache/:username` | Invalidate cache for a user |

### Sample Response

```json
{
  "success": true,
  "fromCache": false,
  "data": {
    "username": "unknown",
    "currentRating": 1451,
    "highestRating": 1453,
    "stars": "2★",
    "rank": "2 star",
    "country": "India",
    "institution": "N/A",
    "NumberOfContest": 12,
    "totalSolved": 50,
    "ratingHistory": [
      {
        "contestName": "Starters 100",
        "rating": 1451,
        "rank": 1200,
        "date": "2024-01-15"
      }
    ],
    "submissionCalendar": "{\"1705276800\": 2}"
  }
}
```

### Caching Strategy

```
Request → Redis GET
            │
     ┌──────┴──────┐
   HIT            MISS
     │               │
  Return          Scrape CodeChef
  cached    →    Parse HTML (Cheerio)
  JSON       →   Redis SETEX (10 min)
             →   Return JSON
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB URI (Atlas or local)
- Redis instance (local or Railway)

### 1. Clone the repository

```bash
git clone https://github.com/Neel092/DSA_Tracker
cd DSA_Tracker
```

### 2. Backend setup

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend setup

```bash
cd Frontend
npm install
cp .env.example .env.local
npm run dev
```

### 4. CodeChef API setup

```bash
cd CodeChef-API
npm install
node index.js
```

Visit `http://localhost:3000`

---

## Environment Variables

### Backend — `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend — `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### CodeChef API — `.env`

```env
PORT=8080
REDIS_URL=redis://localhost:6379
```

---

## API Reference

### Authentication

```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login
POST   /api/auth/logout           Logout
POST   /api/auth/refresh-token    Refresh access token
GET    /api/auth/profile          Get current user
GET    /api/auth/csrf-token       Get CSRF token
PUT    /api/auth/update-profile   Update profile
```

### Problem Tracker

```
GET    /api/progress              Get all logged problems
POST   /api/progress              Log a new problem
PUT    /api/progress/:id          Update a problem entry
DELETE /api/progress/:id          Delete a problem entry
```

### Platform Sync

```
POST   /api/sync/leetcode         Sync LeetCode submissions
POST   /api/sync/codeforces       Sync Codeforces submissions
POST   /api/sync/codechef         Sync CodeChef data (via custom API)
```

### Contests

```
GET    /api/contests/upcoming     Get upcoming contests (all platforms)
```

### CodeChef API (separate service)

```
GET    /api/user/:username        Get CodeChef user stats
DELETE /cache/:username           Clear user cache
```

---

## Project Structure

```
CodePulse/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── progress.controller.js
│   │   │   ├── sync.controller.js
│   │   │   └── contest.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── csrf.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Progress.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── progress.routes.js
│   │   │   ├── sync.routes.js
│   │   │   └── contest.routes.js
│   │   └── services/
│   │       ├── leetcode.service.js
│   │       ├── codeforces.service.js
│   │       ├── codechef.service.js
│   │       └── contestAggregator.service.js
│   ├── app.js
│   └── server.js
│
├── Frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   └── (dashboard)/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       └── lib/


```

---

## Roadmap

<<<<<<< HEAD
- [ ] Background job queues (webhook-based sync)
- [ ] Leaderboard
- [ ] Sheet generator & Interview tracker
- [ ] Company-specific problem roadmaps
=======
- [x] LeetCode sync
- [x] Codeforces sync
- [x] Custom CodeChef scraper API with Redis caching
- [x] Contest calendar aggregator
- [x] JWT auth with refresh tokens
- [x] Problem tracker
- [ ] AtCoder sync
- [ ] GeeksforGeeks sync
- [ ] Background sync jobs (cron-based)
- [ ] Leaderboard among friends
>>>>>>> 7b9b62f (Minor changes in Readme file,Fronted and added docker file)
- [ ] Docker + CI/CD pipeline
- [ ] Company-specific problem roadmaps

---

## Author

**Neel Patil** — CS Engineering Student

[GitHub](https://github.com/Neel092)

---