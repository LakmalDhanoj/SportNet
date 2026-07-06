# 🏆 SportNet — Full Group Project Plan
### Vavuniya University of Sri Lanka | Sports Management Platform | 2026

---

## 📌 Project Summary

SportNet is a **full-stack role-based Sports Management Platform** for university sports operations.

| Item | Detail |
|------|--------|
| **Frontend** | React 18 + Vite + Vanilla CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MySQL 8 |
| **Auth** | JWT (JSON Web Tokens) |
| **Repo** | https://github.com/LakmalDhanoj/SportNet |
| **Main Branch** | `dev` |
| **Members** | 5 |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  Port: 5173  |  http://localhost:5173                    │
│                                                         │
│  Login.jsx       Register.jsx      Dashboard.jsx        │
│  AdminViews.jsx  ManagerViews.jsx  CoachViews.jsx        │
│  CaptainViews.jsx  PlayerViews.jsx                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (Axios)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Express)                      │
│  Port: 5000  |  http://localhost:5000/api               │
│                                                         │
│  /api/auth        /api/users       /api/sports          │
│  /api/reports     /api/comments    /api/player-requests  │
└────────────────────────┬────────────────────────────────┘
                         │ mysql2
                         ▼
┌─────────────────────────────────────────────────────────┐
│                DATABASE (MySQL)                          │
│  Database: sportnet                                      │
│                                                         │
│  users  sports_director  sport_manager  coach           │
│  captain  player  sports  game                          │
│  player_reports  captain_reports  player_requests       │
│  player_comments  audit_logs                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Full Folder Structure

```
SportNet/
│
├── 📄 SETUP_GUIDE.md              ← How to run the project
├── 📄 WORK_DIVISION.md            ← This file
├── 📄 README.md
├── 📄 presentation.html
│
├── 📂 backend/
│   ├── 📄 index.js                ← App entry point (server setup)
│   ├── 📄 schema.sql              ← Database schema + seed data
│   ├── 📄 migrate.js              ← DB setup script (run once)
│   ├── 📄 .env                    ← Environment variables (NOT on Git)
│   ├── 📄 .env.example            ← Template for .env
│   │
│   ├── 📂 config/
│   │   └── db.js                  ← MySQL connection pool
│   │
│   ├── 📂 middleware/
│   │   └── auth.js                ← JWT protect, role guards
│   │
│   ├── 📂 controllers/            ← Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── sportController.js
│   │   ├── reportController.js
│   │   ├── commentController.js
│   │   └── playerRequestController.js
│   │
│   ├── 📂 routes/                 ← API endpoint definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── sportRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── commentRoutes.js
│   │   └── playerRequestRoutes.js
│   │
│   ├── 📂 utils/
│   │   └── logger.js              ← Audit log helper
│   │
│   └── 📂 uploads/                ← Profile photo storage
│
└── 📂 frontend/
    ├── 📄 index.html
    ├── 📄 vite.config.js
    │
    └── 📂 src/
        ├── 📄 main.jsx             ← React entry point
        ├── 📄 App.jsx              ← Routes definition
        ├── 📄 index.css            ← Global design system / theme
        ├── 📄 App.css
        │
        ├── 📂 pages/
        │   ├── Login.jsx           ← Login page
        │   ├── Register.jsx        ← Player registration page
        │   ├── Dashboard.jsx       ← Role router → correct view
        │   ├── AdminViews.jsx      ← Director dashboard
        │   ├── ManagerViews.jsx    ← Manager dashboard
        │   ├── CoachViews.jsx      ← Coach dashboard
        │   ├── CaptainViews.jsx    ← Captain dashboard
        │   └── PlayerViews.jsx     ← Player dashboard
        │
        └── 📂 services/
            └── api.js              ← All Axios API calls
```

---

## 👥 Role Hierarchy

```
Sports Director  (admin)
      │
      └── Sport Manager
               │
               └── Coach
                     │
                     └── Captain
                               │
                               └── Player
```

---

## 🔐 Email Domain Rules

| Role | Email Domain | Example |
|------|-------------|---------|
| Director | `@vau.ac.lk` | `director1@vau.ac.lk` |
| Manager | `@vau.ac.lk` | `manager@vau.ac.lk` |
| Coach | `@vau.ac.lk` | `coach1@vau.ac.lk` |
| Captain | `@stu.vau.ac.lk` | `captain1@stu.vau.ac.lk` |
| Player | `@stu.vau.ac.lk` | `player1@stu.vau.ac.lk` |

---

## 🔑 Test Credentials (All password: `sportnet123`)

| Role | Email |
|------|-------|
| Director 1 | `director1@vau.ac.lk` |
| Director 2 | `director2@vau.ac.lk` |
| Manager | `manager@vau.ac.lk` |
| Coach 1 | `coach1@vau.ac.lk` |
| Coach 2 | `coach2@vau.ac.lk` |
| Captain 1 | `captain1@stu.vau.ac.lk` |
| Captain 2 | `captain2@stu.vau.ac.lk` |
| Player 1 | `player1@stu.vau.ac.lk` |
| Player 2 | `player2@stu.vau.ac.lk` |

---

---

# 👤 MEMBER 1 — Lakmal (Project Lead)
## 🔐 Auth System + Login/Register + Project Setup

**Git Branch:** `feature/auth`

### 📋 Assigned Files

| Layer | File | Status |
|-------|------|--------|
| Frontend | `src/pages/Login.jsx` | ✅ Done |
| Frontend | `src/pages/Register.jsx` | ✅ Done |
| Backend | `controllers/authController.js` | ✅ Done |
| Backend | `routes/authRoutes.js` | ✅ Done |
| Database | `users` table | ✅ Done |
| Infra | `schema.sql`, `migrate.js` | ✅ Done |
| Docs | `SETUP_GUIDE.md`, `WORK_DIVISION.md` | ✅ Done |
| Git | Repo management, branch merging | ✅ Done |

### 🔧 API Endpoints Owned

```
POST   /api/auth/register          ← Player self-register
POST   /api/auth/login             ← All roles login
GET    /api/auth/profile           ← Get own profile
POST   /api/auth/forgot-key        ← Password recovery
```

### ✅ Features Completed
- Role-based login with dynamic `@vau.ac.lk` / `@stu.vau.ac.lk` domain suffix
- Auto-fill domain on login UI (switches when role changes)
- Player self-registration with `@stu.vau.ac.lk` validation
- JWT token issuance and secure auth middleware
- Forgot Key / password reset with temp key generation
- Quick Fill credentials modal (Secure Help Desk)
- Live sport metrics panel on login page
- Database seed data for all roles
- `.env.example` template for team members

---

---

# 👤 MEMBER 2
## 🏗️ Director Module — Sports & System Administration

**Git Branch:** `feature/director`

### 📋 Assigned Files

| Layer | File |
|-------|------|
| Frontend | `src/pages/AdminViews.jsx` (Director sections) |
| Backend | `controllers/sportController.js` |
| Backend | `controllers/userController.js` (Director functions) |
| Backend | `routes/sportRoutes.js` |
| Backend | `routes/userRoutes.js` (Director routes) |
| Database | `sports_director`, `sports`, `audit_logs` tables |

### 🔧 API Endpoints Owned

```
── Sports ───────────────────────────────────────────────
GET    /api/sports                 ← List all sports (public, shown on login)
POST   /api/sports                 ← Create a new sport
PUT    /api/sports/:id             ← Update sport
DELETE /api/sports/:id             ← Delete sport

── Director User Management ────────────────────────────
GET    /api/users                  ← Get all users in system
POST   /api/users                  ← Create manager/coach
DELETE /api/users/:user_id         ← Delete user
GET    /api/users/audit-logs       ← View audit log history

── Overview ─────────────────────────────────────────────
GET    /api/reports/overview/director ← Director stats overview
```

### 📌 Features to Build / Improve

- [ ] Director dashboard overview (total players, sports, coaches)
- [ ] Create / Edit / Delete sports with custom metrics
- [ ] Add Sport Managers (assign to sports)
- [ ] View all system users (table with role filter)
- [ ] Delete users from the system
- [ ] Audit log viewer (who did what, when)
- [ ] Sports performance overview (attendance rate per sport)
- [ ] Director profile edit (name, photo upload)

### 🗄️ Database Tables

```sql
sports_director (director_id, user_id, name, gender, age)
sports (sport_id, sport_name, sport_type, metrics, description,
        custom_metric_name, custom_metric_value, created_by_director_id)
audit_logs (log_id, user_id, action, details, created_at)
```

---

---

# 👤 MEMBER 3
## 💼 Manager Module — Coach & Division Management

**Git Branch:** `feature/manager`

### 📋 Assigned Files

| Layer | File |
|-------|------|
| Frontend | `src/pages/ManagerViews.jsx` |
| Backend | `controllers/userController.js` (Manager functions) |
| Backend | `routes/userRoutes.js` (Manager routes) |
| Database | `sport_manager` table |

### 🔧 API Endpoints Owned

```
── Manager Data ──────────────────────────────────────────
GET    /api/users/all-coaches      ← List coaches under manager
GET    /api/users/all-captains     ← List all captains
GET    /api/users/list/coaches     ← Dropdown list of coaches

── Manager creates coaches ───────────────────────────────
POST   /api/users                  ← Create coach (role=coach in body)

── Reports ───────────────────────────────────────────────
GET    /api/reports/overview/manager ← Manager stats overview
```

### 📌 Features to Build / Improve

- [ ] Manager dashboard overview (coaches count, players count, sport)
- [ ] View all coaches assigned to this manager's sport
- [ ] Add new coaches (assign to manager's sport division)
- [ ] View coaches' team performance summary
- [ ] View captain list under each coach
- [ ] View attendance overview for the sport division
- [ ] Manager profile edit (name, photo upload)
- [ ] Sport division stats (players per sport, avg attendance)

### 🗄️ Database Tables

```sql
sport_manager (manager_id, user_id, director_id, name, gender,
               age, qualification, sport_specialization)
```

---

---

# 👤 MEMBER 4
## 📋 Coach Module — Player Management & Reports

**Git Branch:** `feature/coach`

### 📋 Assigned Files

| Layer | File |
|-------|------|
| Frontend | `src/pages/CoachViews.jsx` |
| Backend | `controllers/userController.js` (Coach functions) |
| Backend | `controllers/reportController.js` |
| Backend | `routes/reportRoutes.js` |
| Backend | `routes/userRoutes.js` (Coach routes) |
| Database | `coach`, `player_reports`, `captain_reports` tables |

### 🔧 API Endpoints Owned

```
── Coach manages players ─────────────────────────────────
GET    /api/users/my-players       ← Players under this coach
GET    /api/users/my-captains      ← Captains under this coach
GET    /api/users/coach/pending-players   ← Pending approval queue
PUT    /api/users/coach/approve-player/:id ← Approve/reject player
POST   /api/users/coach/add-player ← Add player directly

── Reports ───────────────────────────────────────────────
GET    /api/reports/player/for-coach       ← View player reports
PUT    /api/reports/player/:id/approve     ← Approve player report
PUT    /api/reports/player/bulk-approve/:captain_id ← Bulk approve
GET    /api/reports/captain/my-captains    ← Get captains for report
POST   /api/reports/captain                ← Submit captain report
```

### 📌 Features to Build / Improve

- [ ] Coach dashboard (pending players count, total players, captains)
- [ ] Player approval queue (Pending → Approve / Reject)
- [ ] Add players directly (email must be `@stu.vau.ac.lk`)
- [ ] View all captains and their squads
- [ ] View player performance reports submitted by captains
- [ ] Bulk approve player reports
- [ ] Submit coach evaluation report for captains
- [ ] Coach profile edit (name, sport, photo upload)
- [ ] View player attendance trends

### 🗄️ Database Tables

```sql
coach (coach_id, user_id, manager_id, name, gender, age,
       team_name, sport_category)

player_reports (report_id, player_id, captain_id, date,
                attendance, performance_score, notes, status)

captain_reports (report_id, captain_id, coach_id, date,
                 attendance, leadership_score, notes)
```

---

---

# 👤 MEMBER 5
## 🎖️ Captain & Player Module — Requests, Comments & Player Views

**Git Branch:** `feature/captain-player`

### 📋 Assigned Files

| Layer | File |
|-------|------|
| Frontend | `src/pages/CaptainViews.jsx` |
| Frontend | `src/pages/PlayerViews.jsx` |
| Backend | `controllers/playerRequestController.js` |
| Backend | `controllers/commentController.js` |
| Backend | `routes/playerRequestRoutes.js` |
| Backend | `routes/commentRoutes.js` |
| Database | `captain`, `player`, `player_requests`, `player_comments` tables |

### 🔧 API Endpoints Owned

```
── Player Requests ───────────────────────────────────────
POST   /api/player-requests        ← Captain submits request for new player
GET    /api/player-requests        ← Coach views pending requests
PUT    /api/player-requests/:id    ← Coach approve/reject request

── Comments System ───────────────────────────────────────
POST   /api/comments               ← Add comment on a player
GET    /api/comments               ← Get comments (filter by player)
PUT    /api/comments/:id           ← Edit comment
DELETE /api/comments/:id           ← Delete comment
PUT    /api/comments/:id/reply     ← Coach replies to comment
PUT    /api/comments/:id/resolve   ← Mark comment as resolved

── Player Self-View ──────────────────────────────────────
GET    /api/reports/player/my-reports  ← Player sees own reports
GET    /api/users/player/my-teammates  ← Player sees squad

── Captain Reports ───────────────────────────────────────
POST   /api/reports/player          ← Submit squad attendance reports
GET    /api/reports/player/my-squad ← View own squad report history
GET    /api/reports/player/submission-status ← Check submission status
```

### 📌 Features to Build / Improve

- [ ] Captain dashboard (squad size, pending requests, report status)
- [ ] Submit player request to coach (new player onboarding)
- [ ] View player request status (Pending / Approved / Rejected)
- [ ] Submit player attendance & performance reports for the squad
- [ ] View squad members and their stats
- [ ] Comments on players (add, edit, delete)
- [ ] Captain profile edit
- [ ] **Player Dashboard** — player sees their own:
  - Attendance history
  - Performance scores
  - Coach/captain comments about them
  - Teammates list
- [ ] Player profile edit (name, position, photo upload)

### 🗄️ Database Tables

```sql
captain (captain_id, user_id, managed_by_coach_id, name,
         gender, age, sport_category, position)

player (player_id, user_id, managed_by_captain_id, name,
        gender, age, sport_category, position, approval_status)

player_requests (request_id, captain_id, coach_id, player_name,
                 player_email, player_password_hash, gender, age,
                 sport_category, position, status)

player_comments (comment_id, player_id, author_id, author_role,
                 comment_text, reply_text, is_resolved, created_at)
```

---

---

# 🌿 Git Workflow

## Branch Structure

```
main                    ← Final production (Lakmal merges here)
  └── dev               ← Team integration (merge your work here)
        ├── feature/auth            ← Member 1 (Lakmal)
        ├── feature/director        ← Member 2
        ├── feature/manager         ← Member 3
        ├── feature/coach           ← Member 4
        └── feature/captain-player  ← Member 5
```

## Daily Workflow

```bash
# 1. Start your day — get latest changes
git checkout dev
git pull origin dev
git checkout feature/your-branch
git merge dev                       # bring in latest updates

# 2. Do your work, then commit
git add .
git commit -m "feat: add player approval feature"

# 3. Push your work
git push origin feature/your-branch

# 4. When feature is done — tell Lakmal to merge via Pull Request
```

## Commit Message Format

```
feat:   new feature          →  feat: add coach dashboard stats
fix:    bug fix              →  fix: player approval not saving
style:  UI/CSS change        →  style: update coach table layout
docs:   documentation        →  docs: add API comments
db:     database change      →  db: add index to player_reports
```

## ⚠️ Rules

1. **Never push directly to `dev` or `main`**
2. Always pull latest `dev` before starting work each day
3. If you change `schema.sql` → **tell everyone** → they must re-run `node migrate.js`
4. One feature per commit — don't mix unrelated changes

---

# 📅 Project Timeline

| Week | Goal | Who |
|------|------|-----|
| **Week 1** | Setup environment, clone repo, read guides | All members |
| **Week 2** | Build assigned module (backend + frontend) | All members |
| **Week 3** | Integration — merge to `dev`, fix conflicts | All + Lakmal reviews |
| **Week 4** | End-to-end testing, bug fixes, UI polish | All members |
| **Week 5** | Final testing, documentation, presentation | All members |

---

# 🚀 Quick Start for New Members

```bash
# Step 1: Clone
git clone -b dev https://github.com/LakmalDhanoj/SportNet.git
cd SportNet

# Step 2: Setup backend
cd backend
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux
# Edit .env — add your MySQL password

# Step 3: Install packages
npm install

# Step 4: Setup database
node migrate.js

# Step 5: Install frontend packages
cd ../frontend
npm install

# Step 6: Run (2 terminals needed)
# Terminal 1:
cd backend && npm run dev     # http://localhost:5000

# Terminal 2:
cd frontend && npm run dev    # http://localhost:5173

# Step 7: Checkout YOUR branch
git checkout feature/your-assigned-branch
```

---

# 🆘 Common Problems

| Error | Fix |
|-------|-----|
| `ECONNREFUSED 3306` | Start MySQL service |
| `Access denied for root` | Wrong `DB_PASSWORD` in `.env` |
| `Cannot find module` | Run `npm install` in that folder |
| `Port already in use` | Change `PORT` in `.env` or kill the process |
| Login fails after `migrate.js` | Wait 2 seconds, MySQL is still seeding |
| Git merge conflict | Tell Lakmal — don't force push |

---

*SportNet Group Project | VAU | 2026 | Branch: `dev`*
