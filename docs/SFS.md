# SportNet: System Features Specification

## 1. Core Authentication & Identity Features
*Goal: Secure access and role-specific redirection.*

| Feature ID | Feature Name | Description | Validation Criteria |
| :--- | :--- | :--- | :--- |
| **F-AUTH-01** | Multi-Role Login | Secure sign-in with a role-selection toggle (Admin, Coach, Captain, Player). | System grants access only if the credentials match the selected role in DB. |
| **F-AUTH-02** | JWT Session Mgmt | Stateless session handling using JSON Web Tokens. | Users remain logged in on refresh; tokens expire after a set duration. |
| **F-AUTH-03** | Profile Management | Unique profile data for each role (e.g., Player ID vs Coach ID). | User can view their specific "Basic Information" fields upon login. |

---

## 2. Hierarchical Dashboard Features
*Goal: Provide customized interfaces based on the SportNet organizational structure.*

### 2.1 Sports Director (Global View)
* **F-DIR-01: Annual Oversight:** Filter and view performance trends across the entire organization by `Year`.
* **F-DIR-02: Structural Mapping:** View relationships between specific Managers, Coaches, and the teams they oversee.
* **F-DIR-03: Success Metrics:** High-level charts showing "Overall Sports Program Success Rate."

### 2.2 Sport Manager (Administrative View)
* **F-MGR-01: Resource Allocation:** Tools to manage `Budget`, `Facilities`, and `Equipment`.
* **F-MGR-02: Personnel Monitoring:** Track "Coach Performance Evaluation" and "Player Development Monitoring."
* **F-MGR-03: Event Coordinator:** Create and schedule tournaments/matches within their assigned `Sport Category`.

### 2.3 Coach (Performance View)
* **F-COA-01: Digital Scorecard:** Input interface for `Attendance`, `Discipline (1-10)`, and `Time Management`.
* **F-COA-02: Evaluation Engine:** Submit "Coach Evaluation Scores" and "Weekly Performance Ratings."
* **F-COA-03: Team Discipline Log:** Track "Team Discipline Improvement Scores" over the season.

### 2.4 Captain (Leadership View)
* **F-CAP-01: Strategy Board:** Input match strategy and log "Decision-Making" outcomes during games.
* **F-CAP-02: Motivation Tracker:** Record and visualize "Team Motivation Levels."
* **F-CAP-03: Peer Feedback:** View aggregated (anonymized) feedback from the team.

### 2.5 Player (Engagement View)
* **F-PLA-01: My Performance Card:** Read-only view of `Total Score`, `Rank`, and `Skill Level`.
* **F-PLA-02: Fitness Portal:** View current `Fitness Level` and `Injury Status` as logged by the Coach.
* **F-PLA-03: Achievement Gallery:** List of `Awards` and `Match Highlights`.

---

## 3. Game & Match Management Features
*Goal: Manage the data lifecycle of a sporting event.*

| Feature ID | Feature Name | Description |
| :--- | :--- | :--- |
| **F-GAME-01** | Match Scheduler | Define Game ID, Category, Type, Venue, and Time. |
| **F-GAME-02** | Roster Assignment | Assign a Coach, Captain, and Player List to a specific Game ID. |
| **F-GAME-03** | Result Processing | Log Winner/Runner-up, Final Score, and Foul/Penalty counts. |
| **F-GAME-04** | MVP Recognition | Assign "Best Player" award and trigger bonus points to that player's `Total Score`. |

---

## 4. Performance Calculation & Logic Features
*Goal: Automated data processing based on inputs.*

* **F-LOGIC-01: Automatic Scoring:** The system must automatically update the `Total Score` when `Weekly Match Points` or `Penalty Points` are updated.
* **F-LOGIC-02: Win Rate Calculation:** Automatically calculate `Win %` for Coaches and Captains based on match outcomes.
* **F-LOGIC-03: Approval Workflow:** Implement a "Final Approved by Coach" flag that locks the week's data from further modification by the Coach.

---

## 5. Administrative & System Features
*Goal: Global maintenance and settings.*

* **F-ADM-01: User Provisioning:** Create, Update, and Delete (CRUD) user accounts and assign roles.
* **F-ADM-02: Sport Configuration:** Add or remove sport categories (e.g., adding "Rugby" or "Badminton").
* **F-ADM-03: System Status:** Monitor "Active" status of the system and view security logs.