# 🏆 SportNet — Hierarchical Sport Management System

              Sport Management System ssss
              
SportNet is a powerful, full-stack hierarchical sports management platform designed for structured administration and performance tracking.

## 🏗️ Organizational Hierarchy
The system operates on a "Nested Management" model to ensure accountability and data integrity:
**Sports Director > Sport Manager > Coach > Captain > Player**

- **Sports Director**: High-level organizational oversight and system auditing.
- **Sport Manager**: Personnel monitoring and resource allocation.
- **Coach**: Evaluating Captains and reviewing/finalizing player records.
- **Captain**: Squad-level management, logging attendance/discipline for players.
- **Player**: Personal performance tracking and progress reporting.

## 🚀 Features

### Core Management
- **Role-Based Dashboards**: 6 distinct user experiences tailored to specific permissions.
- **User Management**: Admin-level control over the organizational hierarchy.
- **Performance Evaluation**: Detailed metrics including Attendance, Discipline, Strategy, and Training Hours.

### Workflow Logic
- **Captain Submission**: Captains mark daily logs for their squad (Draft Mode).
- **Coach Verification**: Coaches review submissions, can override values, and provide feedback.
- **Locking Records**: Once a Coach clicks "Final Approved," records are locked and visible to Managers/Directors.
- **Automated Scoring**: Total scores are calculated based on weighted metrics and Coach evaluations.

### Premium UI/UX
- **Glassmorphism**: Modern aesthetic with blur effects and translucent panels.
- **Dark Mode**: High-contrast, easy-on-the-eyes interface with vibrant accents.
- **Responsive**: Fully functional across desktop and mobile browsers.

## 🛠️ Technology Stack
- **Frontend**: React 19 (Vite), Axios, React Router.
- **Backend**: Node.js, Express, JWT Authentication.
- **Database**: MySQL with relational integrity.
- **Styling**: Vanilla CSS with modern utilities and animations.

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MySQL Server

### Setup Instructions

1. **Database Setup**
   - Run the [backend/schema.sql](backend/schema.sql) file in your MySQL environment:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```

2. **Backend Configuration**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your DB credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔐 Credentials (Seed Data)
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@sportnet.com | sportnet123 |
| **Director** | director@sportnet.com | sportnet123 |
| **Manager** | manager@sportnet.com | sportnet123 |
| **Coach** | coach1@sportnet.com | sportnet123 |
| **Captain** | captain1@sportnet.com | sportnet123 |
| **Player** | player1@sportnet.com | sportnet123 |

---
**Last Updated**: 2026-05-16
**Version**: 1.0.0 — Full Hierarchical Release

Project Members 
2021/Asp/62 - Thilukshana 
2021/ASP/41  - Suveka
