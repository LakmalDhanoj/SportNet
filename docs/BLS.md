# SportNet: Business Logic Specification

## 1. Hierarchy & Access Control Logics (RBAC)
*Goal: Ensure that users can only interact with data within their scope of authority.*

| User Role | Logic Rule | Validation Action |
| :--- | :--- | :--- |
| **Sports Director** | Can view all data across all years and all games. | Verify that filtering by `year` returns historical records for all sports. |
| **Sport Manager** | Can only manage Captains and Coaches assigned to their specific `game_id`. | Attempt to view a Captain from a different sport; system should return `403 Forbidden`. |
| **Coach** | Can only edit performance metrics for Players in their assigned `game_id`. | Ensure the "Edit" button only appears for players within the Coach's assigned team. |
| **Player** | Has read-only access to their own data. | Attempt to send a `PUT` request to update `discipline` score; system must reject. |

---

## 2. Performance Metric Logics
*Goal: Prevent illogical or "impossible" data entries in performance tracking.*

* **Metric Boundaries:**
    * `Discipline` and `Time Management` scores must be between **1 and 10**.
    * `Attendance` must be a binary/categorical value (Present/Absent).
* **Automatic Point Calculation:**
    * **Logic:** `Total Score` = `(Previous Total Score)` + `(Weekly PT)` + `(Bonus Points)` - `(Penalty Points)`.
    * **Validation:** If a Coach enters a "Penalty Point," the `Total Score` must reflect an immediate decrease.
* **Fitness & Availability:**
    * **Rule:** If `Injury Status` is set to "Injured," the `Availability` status should automatically toggle to "Unavailable" for match selection.

---

## 3. Leadership & Responsibility Logics
*Goal: Validate the unique attributes of the Captain and Coach roles.*

* **Captain-Player Link:**
    * A user cannot be a **Captain** and a **Coach** for the same `game_id` simultaneously.
* **Leadership Ratings:**
    * `Team Win Rate (%)` for Captains must be calculated as: `(Matches Won as Captain / Matches Led) * 100`.
* **Feedback Loops:**
    * A Player's `Player Feedback Rating` for a Captain must be anonymized and aggregated before the Captain can view it.

---

## 4. Game & Tournament Logics
*Goal: Ensure match results and schedules are consistent.*

* **Match Result Logic:**
    * A game cannot have the same team listed as both `Winner Team` and `Runner-up Team`.
    * `Points Awarded` must align with the `Score/Result`. (e.g., 3 points for a win, 1 for a draw).
* **Scheduling:**
    * The system must prevent a `Venue` conflict where two games are scheduled at the same `Date`, `Time`, and `Location`.
* **MVP Logic:**
    * The `Best Player (MVP)` must be selected from the `Player List` associated with that specific `Game ID`.

---

## 5. System Integrity & Constraints (Backend Logic)
*Goal: Technical validations to be handled by Express.js and MySQL.*

* **Delete Cascading:**
    * If a `Game` is deleted, all associated `Player_Stats` must either be archived or deleted to prevent "orphaned" records.
* **Unique Registration:**
    * `Reg.no` must be unique across the entire system. Two players cannot have the same ID even if they play different sports.
* **Approval Lock:**
    * Once the status is marked as `✔ Final Approved by Coach`, the `Weekly PT` and `Attendance` for that week cannot be edited by the Coach unless unlocked by a **Sport Manager**.

---

## 6. Validation Test Cases (For Developers)

1.  **Test Case 01:** Enter a `Discipline` score of `11`. 
    * *Expected Result:* Validation Error "Value must be between 1 and 10."
2.  **Test Case 02:** Sports Director changes the `Year` filter from `2025` to `2026`.
    * *Expected Result:* Dashboard updates to show only records where `year == 2026`.
3.  **Test Case 03:** Player attempts to log in with "Coach" role selected.
    * *Expected Result:* Authentication failure or redirect to Player Dashboard based on DB `role` field.
4.  **Test Case 04:** Create a game with `Number of Players = 11` but only add `5` players to the `Player List`.
    * *Expected Result:* System warning "Player list does not match required team size."