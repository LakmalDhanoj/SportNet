# 🏆 SportNet — Group Project Work Division
## Group Members: 5 | Branch: `dev`

---

## 📌 Project Overview

SportNet is a full-stack Sports Management Platform built with:
- **Frontend:** React (Vite) + Vanilla CSS
- **Backend:** Node.js + Express
- **Database:** MySQL

The project is divided into **5 parts** — one per member. Each member owns specific **pages, controllers, routes, and database tables**.

---

## 👤 Member 1 — Lakmal (Project Lead)
### 🔧 Auth System + Login/Register + Project Setup

**Responsibility:** Authentication, Login UI, Registration, Email domain enforcement, Git management

| Layer | Files |
|-------|-------|
| Frontend | `Login.jsx`, `Register.jsx` |
| Backend | `authController.js`, `authRoutes.js` |
| Database | `users` table |
| Other | `schema.sql`, `migrate.js`, `SETUP_GUIDE.md`, Git repo management |

**Features to own:**
- ✅ Login with role-based email domain (`@vau.ac.lk` / `@stu.vau.ac.lk`)
- ✅ Auto-fill domain suffix on login UI
- ✅ Player self-registration
- ✅ JWT authentication
- ✅ Forgot key / password recovery
- ✅ Database seed data

---

## 👤 Member 2
### 🏗️ Director Module — Sports & User Management

**Responsibility:** Sports Director dashboard, Sports configuration, creating Managers

| Layer | Files |
|-------|-------|
| Frontend | `AdminViews.jsx` (Director section) |
| Backend | `sportController.js`, `sportRoutes.js`, `userController.js` (director functions) |
| Database | `sports_director`, `sports` tables |

**Features to own:**
- [ ] Director Dashboard (view all sports, metrics, attendance rates)
- [ ] Create / Edit / Delete Sports
- [ ] Add Sport Managers
- [ ] View all users in the system
- [ ] Live Sport Metrics panel (shown on Login page)
- [ ] Audit logs viewer

**API Endpoints:**
```
GET    /api/sports              — List all sports (public)
POST   /api/sports              — Create sport
PUT    /api/sports/:id          — Update sport
DELETE /api/sports/:id          — Delete sport
GET    /api/users               — List all users (admin)
POST   /api/users               — Create manager
```

---

## 👤 Member 3
### 💼 Manager Module — Coach & Captain Management

**Responsibility:** Sport Manager dashboard, assigning coaches, managing sports divisions

| Layer | Files |
|-------|-------|
| Frontend | `ManagerViews.jsx` |
| Backend | `userController.js` (manager functions) |
| Database | `sport_manager` table |

**Features to own:**
- [ ] Manager Dashboard
- [ ] Add / View Coaches
- [ ] Assign Coaches to sports
- [ ] View Sport divisions and players count
- [ ] Manager profile management
- [ ] Reports overview for the sport

**API Endpoints:**
```
GET    /api/users/coaches       — List coaches under manager
POST   /api/users/coach         — Add a coach
GET    /api/users/manager-stats — Manager statistics
```

---

## 👤 Member 4
### 📋 Coach Module — Player & Captain Management + Reports

**Responsibility:** Coach dashboard, adding players directly, approving player requests, captain reports

| Layer | Files |
|-------|-------|
| Frontend | `CoachViews.jsx` |
| Backend | `userController.js` (coach functions), `reportController.js`, `reportRoutes.js` |
| Database | `coach`, `player_reports`, `captain_reports` tables |

**Features to own:**
- [ ] Coach Dashboard
- [ ] Add Players directly (`@stu.vau.ac.lk` domain)
- [ ] Approve / Reject player requests
- [ ] View Captain reports
- [ ] View Player attendance & performance reports
- [ ] Coach profile management

**API Endpoints:**
```
GET    /api/users/players       — List players under coach
POST   /api/users/coach-add-player  — Add player directly
GET    /api/reports/captain     — Get captain reports
GET    /api/reports/player      — Get player reports
PUT    /api/users/approve/:id   — Approve player
```

---

## 👤 Member 5
### 🎖️ Captain & Player Module — Requests, Comments & Player Views

**Responsibility:** Captain dashboard, player requests, player performance, comments system

| Layer | Files |
|-------|-------|
| Frontend | `CaptainViews.jsx`, `PlayerViews.jsx` |
| Backend | `playerRequestController.js`, `playerRequestRoutes.js`, `commentController.js`, `commentRoutes.js` |
| Database | `captain`, `player`, `player_requests`, `player_comments` tables |

**Features to own:**
- [ ] Captain Dashboard
- [ ] Submit player requests to coach
- [ ] Player list management
- [ ] Player Dashboard (view own stats, attendance)
- [ ] Comments system (coach/captain feedback on players)
- [ ] Player profile management

**API Endpoints:**
```
POST   /api/player-requests     — Captain submits player request
GET    /api/player-requests     — Coach views pending requests
PUT    /api/player-requests/:id — Approve/Reject request
POST   /api/comments            — Add comment on player
GET    /api/comments/:playerId  — Get player comments
```

---

## 🌿 Git Branch Strategy

Each member works on their **own branch** and merges into `dev`:

```
main          ← production (don't touch)
  └── dev     ← team integration branch
        ├── feature/auth         ← Member 1 (Lakmal)
        ├── feature/director     ← Member 2
        ├── feature/manager      ← Member 3
        ├── feature/coach        ← Member 4
        └── feature/captain-player ← Member 5
```

### Creating your branch:
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-module
```

### Pushing your work:
```bash
git add .
git commit -m "feat: describe what you did"
git push origin feature/your-module
```

### Merging into dev (tell Lakmal to review):
- Create a **Pull Request** on GitHub: `feature/your-module` → `dev`
- Lakmal reviews and merges

---

## 📅 Suggested Timeline

| Week | Task |
|------|------|
| Week 1 | All members clone repo, setup local environment, read SETUP_GUIDE.md |
| Week 2 | Each member builds their assigned module features |
| Week 3 | Integration testing, bug fixes, merge to dev |
| Week 4 | Final testing, documentation, presentation prep |

---

## 💬 Communication Rules

1. **Don't push directly to `dev` or `main`** — always use your feature branch
2. **Pull latest `dev` before starting work each day:** `git pull origin dev`
3. **If you change `schema.sql`** — tell everyone so they can re-run `node migrate.js`
4. **Commit messages format:** `feat:`, `fix:`, `docs:`, `style:` (e.g. `feat: add player approval`)

---

## 🔐 Test Credentials per Module

| Member | Role to Test | Email | Password |
|--------|-------------|-------|----------|
| 1 (Lakmal) | All roles | See Login page HELP modal | `sportnet123` |
| 2 | Director | `director1@vau.ac.lk` | `sportnet123` |
| 3 | Manager | `manager@vau.ac.lk` | `sportnet123` |
| 4 | Coach | `coach1@vau.ac.lk` | `sportnet123` |
| 5 | Captain + Player | `captain1@stu.vau.ac.lk` / `player1@stu.vau.ac.lk` | `sportnet123` |

---

*SportNet Group Project | Vavuniya University of Sri Lanka | 2026*
