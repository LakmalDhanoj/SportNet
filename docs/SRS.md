# Software Requirement Specification (SRS) - SportNet

## 1. Introduction
### 1.1 Purpose
This document defines the functional and technical requirements for **SportNet**, a hierarchical sports management platform.

### 1.2 Scope
SportNet facilitates sports administration and performance tracking through a tiered hierarchy:
**Sports Director > Sport Manager > Coach > Captain > Player.**

---

## 2. Updated Organizational Hierarchy & Logic
The system's primary innovation is its "Nested Management" model for performance evaluation:
1.  **Coach-to-Captain Oversight:** The Coach is responsible for logging and managing the `Attendance`, `Discipline`, and `Evaluation Reports` for all **Captains** under their sport category.
2.  **Captain-to-Player Oversight:** The Captain acts as a junior administrator, responsible for logging `Attendance`, `Discipline`, and `Daily Reports` for the **normal Players** in their specific team.
3.  **Managerial Review:** The Sport Manager and Sports Director review the aggregated data from both tiers to ensure evaluation consistency.

---

## 3. System Features (Updated)

### 3.1 Role-Based Performance Management
* **REQ-PM-01 (Coach Management):** The Coach Dashboard shall include a "Leadership Management" module to evaluate Captains on:
    * Attendance and Punctuality.
    * Leadership Discipline.
    * Responsibility and Strategy Reports.
* **REQ-PM-02 (Captain Management):** The Captain Dashboard shall include a "Squad Management" module allowing them to:
    * Mark daily attendance for normal players.
    * Rate player discipline (1-10).
    * Submit weekly player progress reports to the Coach.
* **REQ-PM-03 (Data Flow):** Performance data entered by Captains must be visible to the Coach for "Verification" before being finalized in the database.

### 3.2 Automated Evaluation Logic
* **REQ-LOGIC-01:** The system shall aggregate "Captain-generated reports" to build a player's `Total Score`.
* **REQ-LOGIC-02:** The Coach’s evaluation of a Captain shall contribute 60% to the Captain's `Total Score`, with the remaining 40% derived from team performance metrics.

---

## 4. Functional Requirements & Entity Attributes

### 4.1 Modified Database Relationships
* **Players Table:** Includes a `managed_by_captain_id` (FK) to link players to their evaluating Captain.
* **Captains Table:** Includes a `managed_by_coach_id` (FK) to link captains to their evaluating Coach.

### 4.2 Entity Attributes (Performance Focus)
| Role | Managed By | Responsible For Managing |
| :--- | :--- | :--- |
| **Player** | Captain | N/A (Participant) |
| **Captain** | Coach | Normal Players' Discipline & Attendance |
| **Coach** | Manager | Captains' Discipline, Attendance & Reports |

---

## 5. User Interface Requirements

### 5.1 Dashboard Updates
* **Captain Dashboard:** Must feature a "My Team" tab containing a grid of players with input fields for Attendance and Discipline ratings.
* **Coach Dashboard:** Must feature a "Leadership" tab to manage Captains and a "Review" tab to see the attendance data Captains have submitted for their players.
* **Director Dashboard:** High-level view of how many reports have been submitted by Captains vs. verified by Coaches.

---

## 6. Business Logic Validation
* **Rule 1:** A Captain cannot edit their own attendance; only their assigned Coach has this permission.
* **Rule 2:** A Coach can override a Captain’s entry for a Player if a discrepancy is identified.
* **Rule 3:** Reports submitted by Captains are marked as "Pending" until a Coach reviews and clicks "Final Approved."

                                    +------------------+
                                    |      USERS      |
                                    +------------------+
                                    | PK user_id       |
                                    | email            |
                                    | password_hash    |
                                    | role             |
                                    +------------------+
                                              |
        -----------------------------------------------------------------------------------
        |                    |                    |                    |                  |
        |                    |                    |                    |                  |
        v                    v                    v                    v                  v

+----------------+   +----------------+   +----------------+   +----------------+   +----------------+
| SPORTS_DIRECTOR|   | SPORT_MANAGER |   |     COACH      |   |    CAPTAIN     |   |     PLAYER     |
+----------------+   +----------------+   +----------------+   +----------------+   +----------------+
| PK director_id |   | PK manager_id |   | PK coach_id    |   | PK captain_id  |   | PK player_id   |
| FK user_id     |   | FK user_id    |   | FK user_id     |   | FK user_id     |   | FK user_id     |
| name           |   | FK director_id|   | FK manager_id  |   | FK coach_id    |   | FK captain_id  |
| gender         |   | name          |   | name           |   | name           |   | name           |
| age            |   | gender        |   | gender         |   | gender         |   | gender         |
+----------------+   | age           |   | age            |   | age            |   | age            |
                     | qualification |   | qualification  |   | leadership_rt  |   | attendance     |
                     | leadership_rt |   | attendance     |   | motivation_lvl |   | discipline     |
                     +----------------+   | discipline     |   | strategy_rt    |   | total_score    |
                                          | evaluation_sc  |   | total_score    |   | skill_level    |
                                          +----------------+   +----------------+   +----------------+

                                                     |
                                                     |
                                                     v

                                         +----------------------+
                                         |        GAME          |
                                         +----------------------+
                                         | PK game_id           |
                                         | game_name            |
                                         | sport_category       |
                                         | game_type            |
                                         | venue                |
                                         | date                 |
                                         | time                 |
                                         | season               |
                                         | tournament_name      |
                                         | winner_team          |
                                         | score_result         |
                                         +----------------------+

         SPORTS_DIRECTOR
        │ 1
        │
        └───────────────< manages >─────────────── M SPORT_MANAGER

SPORT_MANAGER
        │ 1
        │
        └───────────────< supervises >─────────── M COACH

COACH
        │ 1
        │
        └───────────────< manages >────────────── M CAPTAIN

CAPTAIN
        │ 1
        │
        └───────────────< leads >──────────────── M PLAYER                                