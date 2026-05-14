# SportNet: System Description

## 1. Executive Summary
**SportNet** is a centralized, web-based management platform designed to streamline the administration of sports organizations. By leveraging a strict hierarchical structure, the system allows for the detailed tracking of athlete performance, team leadership evaluation, coaching effectiveness, and high-level managerial oversight. The platform replaces manual record-keeping with a real-time, data-driven environment, ensuring that every point earned, every match played, and every disciplinary action is logged and transparent.

---

## 2. System Architecture
The system is built on a modern **three-tier architecture** designed for scalability, data integrity, and a premium user experience:

* **Presentation Layer (Frontend):** Developed using **React.js** and **Tailwind CSS**. It features a "Glassmorphism" design system with a default Dark Mode aesthetic, providing a high-tech, professional feel. The interface is responsive, ensuring coaches and managers can log data via tablets or mobile devices on the field.
* **Logic Layer (Backend):** Powered by **Express.js (Node.js)**. This layer handles the complex Business Logics, role-based access control (RBAC), and automated performance calculations (e.g., win rates and total score updates).
* **Data Layer (Database):** A relational **MySQL** database. It enforces strict relational integrity between the 60+ data fields identified across Players, Coaches, Managers, and Directors.

---

## 3. The Hierarchical Model
SportNet operates on a "Top-Down" management philosophy. Information flows from the field (Players/Coaches) upward to administration (Managers/Directors).

1.  **Organizational Oversight:** The **Sports Director** and **Admin** oversee the entire system, managing yearly statistics and system-wide configurations.
2.  **Tactical Coordination:** **Sport Managers** supervise specific sport categories and coordinate the activities of Captains and Coaches.
3.  **Field Implementation:** **Coaches** act as the primary data entry point for performance metrics, while **Captains** provide leadership data and match-day strategies.
4.  **End-User Participation:** **Players** occupy the base of the hierarchy, using the system to view their progress, ratings, and professional growth.

---

## 4. Key Functional Pillars

### 4.1 Performance Analytics
Unlike standard management tools, SportNet focuses on three core performance pillars: **Attendance, Discipline, and Time Management**. These are quantified into a `Total Score`, providing a measurable "Performance Rating" for every participant.

### 4.2 Game & Tournament Lifecycle
The system manages the entire lifecycle of a game—from scheduling (venue, time, category) and roster assignment to post-match results processing, including scoring, foul tracking, and MVP awards.

### 4.3 Leadership & Strategy Tracking
The platform uniquely captures qualitative data, such as a Captain’s "Decision-Making Ability" or a Coach’s "Training Effectiveness." This allows the organization to identify future leaders and improve coaching methodologies.

---

## 5. Security & Data Integrity
Data accuracy is paramount in SportNet. The system implements:
* **Approval Workflows:** Data logged by coaches must be "Final Approved" before it becomes an official part of the player’s record.
* **Immutable History:** Once performance data is approved, it cannot be altered by lower-level roles, preventing data tampering.
* **RBAC Protection:** JSON Web Tokens (JWT) ensure that players can never view the private evaluations of their coaches or the budgetary data of their managers.

---

## 6. Future Scalability
SportNet is designed to be "Sport Agnostic." The underlying schema supports the addition of diverse sports—from team-based games like Football and Cricket to individual sports like Table Tennis or Carrom—without requiring architectural changes.