# 🏆 SportNet — Group Project Setup Guide

> Follow this guide **step by step** to get SportNet running on your machine.  
> Estimated setup time: **10–15 minutes**

---

## ✅ Prerequisites — Install These First

Make sure you have the following installed before you begin:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or above | https://nodejs.org |
| **MySQL** | v8.0 or above | https://dev.mysql.com/downloads/mysql/ |
| **Git** | Any recent | https://git-scm.com |

> 💡 To check if already installed, run:  
> `node -v` `npm -v` `mysql --version` `git --version`

---

## 📥 Step 1 — Clone the Repository

Open a terminal (Command Prompt / PowerShell / VS Code terminal) and run:

```bash
git clone -b dev https://github.com/LakmalDhanoj/SportNet.git
```

Then enter the project folder:

```bash
cd SportNet
```

---

## ⚙️ Step 2 — Configure Environment Variables

The backend needs a `.env` file to connect to your **local MySQL database**.

1. Go into the backend folder:
```bash
cd backend
```

2. Copy the example env file:
```bash
copy .env.example .env
```
*(On Mac/Linux: `cp .env.example .env`)*

3. Open `.env` in any text editor (Notepad, VS Code, etc.) and fill in your MySQL password:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=sportnet
JWT_SECRET=sportnet_secret_key_2026
PORT=5000
```

> ⚠️ **DB_PASSWORD** — Enter the password you set when installing MySQL.  
> If you didn't set a password, leave it blank: `DB_PASSWORD=`

---

## 🗄️ Step 3 — Set Up the Database

Make sure **MySQL is running** on your machine, then run:

```bash
node migrate.js
```

You should see output ending with:
```
✅ Database migration completed successfully! All tables created and seeded.
```

> This automatically creates the `sportnet` database, all tables, and test data.

---

## 📦 Step 4 — Install Dependencies

### Backend packages:
```bash
# You should already be in the backend/ folder
npm install
```

### Frontend packages:
```bash
cd ../frontend
npm install
```

---

## 🚀 Step 5 — Run the Project

You need **two terminals open at the same time**.

### Terminal 1 — Start the Backend:
```bash
cd SportNet/backend
npm run dev
```
✅ You should see: `Server running on port 5000`

### Terminal 2 — Start the Frontend:
```bash
cd SportNet/frontend
npm run dev
```
✅ You should see: `➜ Local: http://localhost:5173/`

---

## 🌐 Step 6 — Open in Browser

Go to: **http://localhost:5173**

---

## 🔐 Test Login Credentials

Use these pre-seeded accounts to test the system:

| Role | Email | Password |
|------|-------|----------|
| Director | `director1@vau.ac.lk` | `sportnet123` |
| Director 2 | `director2@vau.ac.lk` | `sportnet123` |
| Manager | `manager@vau.ac.lk` | `sportnet123` |
| Coach | `coach1@vau.ac.lk` | `sportnet123` |
| Captain | `captain1@stu.vau.ac.lk` | `sportnet123` |
| Player | `player1@stu.vau.ac.lk` | `sportnet123` |

> 💡 On the login page, just type the **username part only** (e.g. `director1`).  
> The domain (`@vau.ac.lk` or `@stu.vau.ac.lk`) is auto-filled based on your selected role.

### 🏫 Email Domain Rules:
- **Directors, Managers, Coaches** → `@vau.ac.lk` (Staff)
- **Captains, Players** → `@stu.vau.ac.lk` (Students)

---

## 📁 Project Folder Structure

```
SportNet/
├── backend/                  # Node.js + Express API
│   ├── controllers/          # Business logic (auth, users, etc.)
│   ├── routes/               # API route definitions
│   ├── middleware/           # JWT auth, file upload middleware
│   ├── config/               # Database connection
│   ├── utils/                # Logger utility
│   ├── schema.sql            # Database schema + seed data
│   ├── migrate.js            # DB migration script
│   ├── index.js              # App entry point
│   └── .env                  # ⚠️ Your local config (NOT shared on Git)
│
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # All page components (Login, Dashboard, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API calls (axios)
│   │   └── main.jsx          # App entry point
│   └── index.html
│
└── SETUP_GUIDE.md            # This file!
```

---

## ❗ Common Issues & Fixes

### ❌ `Error: connect ECONNREFUSED 127.0.0.1:3306`
**MySQL is not running.** Start it:
- **Windows**: Open Services → Find "MySQL80" → Start
- **Mac**: `brew services start mysql`

### ❌ `Access denied for user 'root'@'localhost'`
Wrong password in `.env`. Double-check your `DB_PASSWORD`.

### ❌ `Port 5000 already in use`
Another app is using port 5000. Change `PORT=5001` in `.env` and update the frontend API base URL in `frontend/src/services/api.js`.

### ❌ `node_modules not found`
You forgot to run `npm install`. Run it in **both** `backend/` and `frontend/` folders.

### ❌ `Cannot find module 'nodemon'`
Run `npm install` in the backend folder again.

---

## 🔄 Pulling Latest Changes

When someone on the team pushes new code, pull it with:

```bash
git pull origin dev
```

If the database schema changed (`schema.sql` was updated), re-run:
```bash
cd backend
node migrate.js
```

---

## 👥 Team

| Name | GitHub | Branch |
|------|--------|--------|
| Lakmal | LakmalDhanoj | `dev` |

> 📌 All work is done on the `dev` branch. Do **not** push directly to `main`.

---

*Last updated: July 2026 | SportNet v1.0*
