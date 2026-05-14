# Software Requirement Specification (SRS) - SportNet

## 1. Introduction

### 1.1 Purpose
This document provides the definitive technical and functional requirements for **SportNet**, a robust sports management system. It details the data structures, user hierarchies, and implementation strategy for building a high-performance tracking platform.

### 1.2 Scope
SportNet manages the end-to-end lifecycle of sports administration. This includes detailed athlete profiling, leadership assessment, coaching effectiveness, managerial oversight, and game-day logistics.

---

## 2. System Hierarchy & Roles

The system follows a strict hierarchical access model:
1.  **Sports Director:** Ultimate oversight, strategic planning, and global analytics.
2.  **Sport Manager:** Administrative coordination, event organization, and resource management.
3.  **Coach:** Technical training, performance evaluation, and field-level discipline.
4.  **Captain:** Team leadership, match strategy, and motivation.
5.  **Player:** Participation and performance tracking.

---

## 3. Functional Requirements: Data Entities

The system must support the following specific data fields for each entity:

### 3.1 Player Management
* **Identity:** Reg.no (PK), Name, Gender, Age.
* **Role/Team:** Sport Category, Team/Group, Position (e.g., Forward), Role (Player/Captain).
* **Performance:** Attendance, Discipline, Time Management, Performance Rating, Skill Level.
* **Stats:** Matches Played/Won/Lost, Weekly Match Points, Total Score, Rank, Coach Evaluation.
* **Status:** Fitness Level, Injury Status, Experience (Working Year).

### 3.2 Captain Management
* **Leadership Attributes:** Leadership Skill Rating, Decision-Making, Team Motivation Level.
* **Captain Stats:** Matches Led, Win Rate (%), Tournament Results.
* **Strategy:** Game Strategy Rating, Adaptability, Planning Ability.
* **Responsibility:** Responsibility Score, Player Feedback Rating.

### 3.3 Coach Management
* **Professionalism:** Coach ID, Qualification/Certification, Coaching Level (Beginner to Professional).
* **Team Ops:** Teams Assigned, Player Count, Captain Coordination Ability.
* **Coaching Results:** Win Percentage, Training Effectiveness Rating, Strategy Development.
* **Admin:** Improvement Score, Specializations (e.g., Fitness, Strategy).

### 3.4 Sport Manager Management
* **Administration:** Manager ID, Budget Management, Resource Allocation, Facility/Equipment Management.
* **Coordination:** Event/Tournament Organization, Scheduling Responsibility.
* **Monitoring:** Team Performance Tracking, Coach Performance Evaluation, Success Rate.
* **Skills:** Problem-Solving Ability, Planning & Organization Skill.

### 3.5 Game & Match Records
* **Event Info:** Game ID, Category (Football, etc.), Type (Indoor/Outdoor), Tournament Name, Venue.
* **Participants:** Teams Involved, Player List, Captain/Coach Assignment.
* **Results:** Winner/Runner-up, Score/Result, Match Duration, Points Awarded.
* **In-Game Stats:** Fouls/Penalties, Possession, MVP Awards, Injuries Reported.

---

## 4. Technical Requirements (Implementation Plan)

### 4.1 Technology Stack
* **Backend:** Express.js (Node.js)
* **Frontend:** React.js with Tailwind CSS (Glassmorphism/Dark Theme)
* **Database:** MySQL (Relational)
* **Icons/UI:** Lucide-React for iconography.

### 4.2 Database Design Strategy
* **Normalization:** Maintain distinct tables for `Users`, `Games`, and `Performance_Logs`.
* **Indexing:** Use Primary Keys (reg_no, coach_id, manager_id) for rapid lookup.
* **Relationships:** Implement Foreign Keys to link Players to Games and Managers to Coaches/Captains as defined in the ER model.

### 4.3 Security & Access Control
* **Authentication:** JWT (JSON Web Tokens) for secure API communication.
* **Authorization:** Middleware to restrict "Edit" permissions to Coaches and Managers only.
* **Data Integrity:** Prevent Players from modifying their own `Discipline` or `Attendance` scores.

---

## 5. Non-Functional Requirements

### 5.1 User Experience
* **Responsive Design:** Dashboards must be accessible on mobile devices for on-field logging by Coaches.
* **Visual Feedback:** Use progress bars and radar charts to display "Skill Levels" and "Leadership Ratings."

### 5.2 Performance
* **Concurrency:** The system must handle simultaneous data entry during multi-game tournaments.
* **Audit Trail:** Log all changes to `Total Score` or `Penalty Points` for transparency.

### 5.3 Maintainability
* **Modular Views:** Dynamic dashboard layouts that render components based on the `user_role` variable.