-- SportNet Database Schema
-- Run this file fresh: mysql -u root -p < schema.sql

DROP DATABASE IF EXISTS sportnet;
CREATE DATABASE sportnet;
USE sportnet;

-- ─── CORE USERS TABLE ────────────────────────────────────────────────────────
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('director', 'manager', 'coach', 'captain', 'player') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── ROLE PROFILE TABLES ─────────────────────────────────────────────────────
CREATE TABLE sports (
    sport_id INT AUTO_INCREMENT PRIMARY KEY,
    sport_name VARCHAR(255) UNIQUE NOT NULL,
    sport_type VARCHAR(255) NOT NULL,
    metrics VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    teams_count INT DEFAULT 0,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE sports_director (
    director_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    experience_years INT DEFAULT 0,
    qualification VARCHAR(255),
    organization VARCHAR(255),
    achievements TEXT,
    remarks TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE sport_manager (
    manager_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    director_id INT,
    name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    experience_years INT DEFAULT 0,
    qualification VARCHAR(255),
    sport_specialization VARCHAR(255),
    organization VARCHAR(255),
    teams_managed_count INT DEFAULT 0,
    coaches_under_supervision INT DEFAULT 0,
    players_coordinated INT DEFAULT 0,
    events_organized INT DEFAULT 0,
    budget_mgmt_skill DECIMAL(4,2) DEFAULT 0,
    resource_allocation_rt DECIMAL(4,2) DEFAULT 0,
    facility_mgmt_rt DECIMAL(4,2) DEFAULT 0,
    equipment_mgmt_rt DECIMAL(4,2) DEFAULT 0,
    team_perf_tracking_sc DECIMAL(4,2) DEFAULT 0,
    coach_perf_eval_sc DECIMAL(4,2) DEFAULT 0,
    player_dev_monitoring_sc DECIMAL(4,2) DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    leadership_rt DECIMAL(4,2) DEFAULT 0,
    decision_making_rt DECIMAL(4,2) DEFAULT 0,
    communication_rt DECIMAL(4,2) DEFAULT 0,
    problem_solving_rt DECIMAL(4,2) DEFAULT 0,
    planning_skill_rt DECIMAL(4,2) DEFAULT 0,
    achievements TEXT,
    remarks TEXT,
    special_projects TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES sports_director(director_id) ON DELETE SET NULL
);

CREATE TABLE coach (
    coach_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    manager_id INT,
    director_id INT,
    sport_id INT,
    name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    team_group VARCHAR(100),
    sport_category VARCHAR(100),
    experience_years INT DEFAULT 0,
    qualification TEXT,
    coaching_level ENUM('Beginner', 'Intermediate', 'Professional') DEFAULT 'Beginner',
    teams_assigned_count INT DEFAULT 0,
    players_under_coaching INT DEFAULT 0,
    captain_coordination_sc DECIMAL(4,2) DEFAULT 0,
    matches_coached INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    win_percentage DECIMAL(5,2) DEFAULT 0,
    tournament_results TEXT,
    training_effectiveness_rt DECIMAL(4,2) DEFAULT 0,
    strategy_dev_rt DECIMAL(4,2) DEFAULT 0,
    decision_making_rt DECIMAL(4,2) DEFAULT 0,
    attendance DECIMAL(5,2) DEFAULT 0,
    discipline INT DEFAULT 10,
    time_mgmt INT DEFAULT 10,
    team_disc_improvement_sc DECIMAL(4,2) DEFAULT 0,
    overall_perf_score DECIMAL(5,2) DEFAULT 0,
    player_feedback_rt DECIMAL(4,2) DEFAULT 0,
    weekly_perf_rt DECIMAL(4,2) DEFAULT 0,
    total_score DECIMAL(5,2) DEFAULT 0,
    rank_pos INT,
    achievements TEXT,
    remarks TEXT,
    specializations TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES sport_manager(manager_id) ON DELETE SET NULL,
    FOREIGN KEY (director_id) REFERENCES sports_director(director_id) ON DELETE SET NULL,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE SET NULL
);

CREATE TABLE captain (
    captain_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    managed_by_coach_id INT,
    director_id INT,
    sport_id INT,
    name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    sport_category VARCHAR(100),
    position VARCHAR(100),
    years_as_captain INT DEFAULT 0,
    leadership_rt DECIMAL(4,2) DEFAULT 0,
    decision_making_rt DECIMAL(4,2) DEFAULT 0,
    communication_rt DECIMAL(4,2) DEFAULT 0,
    motivation_lvl DECIMAL(4,2) DEFAULT 0,
    matches_led INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0,
    tournament_results TEXT,
    attendance DECIMAL(5,2) DEFAULT 0,
    discipline INT DEFAULT 10,
    time_mgmt INT DEFAULT 10,
    responsibility_sc DECIMAL(4,2) DEFAULT 0,
    strategy_rt DECIMAL(4,2) DEFAULT 0,
    adaptability_rt DECIMAL(4,2) DEFAULT 0,
    planning_rt DECIMAL(4,2) DEFAULT 0,
    weekly_match_pts INT DEFAULT 0,
    total_score DECIMAL(5,2) DEFAULT 0,
    coach_eval_sc DECIMAL(5,2) DEFAULT 0,
    player_feedback_rt DECIMAL(4,2) DEFAULT 0,
    rank_pos INT,
    experience_years INT DEFAULT 0,
    achievements TEXT,
    remarks TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (managed_by_coach_id) REFERENCES coach(coach_id) ON DELETE SET NULL,
    FOREIGN KEY (director_id) REFERENCES sports_director(director_id) ON DELETE SET NULL,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE SET NULL
);

CREATE TABLE player (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    managed_by_captain_id INT,
    coach_id INT,
    sport_id INT,
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    team_group VARCHAR(100),
    sport_category VARCHAR(100),
    position VARCHAR(100),
    attendance DECIMAL(5,2) DEFAULT 0,
    discipline INT DEFAULT 10,
    time_mgmt INT DEFAULT 10,
    performance_rating DECIMAL(4,2) DEFAULT 0,
    skill_level VARCHAR(50),
    matches_played INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    participation_count INT DEFAULT 0,
    weekly_match_pts INT DEFAULT 0,
    total_score DECIMAL(5,2) DEFAULT 0,
    rank_pos INT,
    coach_eval_sc DECIMAL(5,2) DEFAULT 0,
    bonus_points INT DEFAULT 0,
    penalty_points INT DEFAULT 0,
    fitness_level ENUM('Low', 'Medium', 'High', 'Elite') DEFAULT 'Medium',
    injury_status ENUM('Fit', 'Minor Injury', 'Injured', 'Recovery') DEFAULT 'Fit',
    availability ENUM('Available', 'Unavailable', 'Restricted') DEFAULT 'Available',
    experience_years INT DEFAULT 0,
    achievements TEXT,
    remarks TEXT,
    profile_photo VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (managed_by_captain_id) REFERENCES captain(captain_id) ON DELETE SET NULL,
    FOREIGN KEY (coach_id) REFERENCES coach(coach_id) ON DELETE SET NULL,
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE SET NULL
);

-- ─── GAME TABLE ───────────────────────────────────────────────────────────────
CREATE TABLE game (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    game_name VARCHAR(255) NOT NULL,
    sport_category VARCHAR(100) NOT NULL,
    game_type VARCHAR(100),
    venue VARCHAR(255),
    date DATE,
    time TIME,
    season VARCHAR(50),
    tournament_name VARCHAR(255),
    winner_team VARCHAR(255),
    runner_up_team VARCHAR(255),
    score_result VARCHAR(100),
    duration VARCHAR(50),
    points_awarded INT DEFAULT 0,
    total_goals_runs INT DEFAULT 0,
    fouls_penalties INT DEFAULT 0,
    possession_pct DECIMAL(5,2),
    referee_umpire VARCHAR(255),
    sports_manager_id INT,
    event_organizer VARCHAR(255),
    match_supervisor VARCHAR(255),
    match_rating DECIMAL(3,1),
    fair_play_score DECIMAL(3,1),
    audience_rating DECIMAL(3,1),
    coach_evaluation TEXT,
    player_summary TEXT,
    injuries_reported TEXT,
    awards_mvp VARCHAR(255),
    highlights TEXT,
    remarks TEXT,
    FOREIGN KEY (sports_manager_id) REFERENCES sport_manager(manager_id) ON DELETE SET NULL
);

-- ─── REPORT TABLES ───────────────────────────────────────────────────────────
CREATE TABLE player_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    captain_id INT NOT NULL,
    date DATE NOT NULL,
    attendance ENUM('Present', 'Absent', 'Late', 'Training', 'Medical Leave') NOT NULL,
    discipline INT NOT NULL CHECK (discipline BETWEEN 1 AND 10),
    training_hours DECIMAL(4,2) DEFAULT 0,
    notes TEXT,
    status ENUM('Draft', 'Pending', 'Final Approved', 'Rejected') DEFAULT 'Pending',
    coach_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_daily (player_id, captain_id, date),
    FOREIGN KEY (player_id) REFERENCES player(player_id) ON DELETE CASCADE,
    FOREIGN KEY (captain_id) REFERENCES captain(captain_id) ON DELETE CASCADE
);

CREATE TABLE captain_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    captain_id INT NOT NULL,
    coach_id INT NOT NULL,
    date DATE NOT NULL,
    attendance ENUM('Present', 'Absent', 'Late', 'Training', 'Medical Leave') NOT NULL,
    discipline ENUM('Good', 'Average', 'Poor') NOT NULL,
    training_hours DECIMAL(4,2) DEFAULT 0,
    strategy_rt DECIMAL(4,2) DEFAULT 0,
    responsibility_rt DECIMAL(4,2) DEFAULT 0,
    notes TEXT,
    status ENUM('Pending', 'Final Approved') DEFAULT 'Final Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_captain_daily (captain_id, coach_id, date),
    FOREIGN KEY (captain_id) REFERENCES captain(captain_id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coach(coach_id) ON DELETE CASCADE
);

CREATE TABLE player_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    captain_id INT NOT NULL,
    coach_id INT NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    player_email VARCHAR(255) UNIQUE NOT NULL,
    player_password_hash VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    sport_category VARCHAR(100),
    position VARCHAR(100),
    status ENUM('Pending', 'Approved', 'Rejected', 'Duplicate Removed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (captain_id) REFERENCES captain(captain_id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coach(coach_id) ON DELETE CASCADE
);

CREATE TABLE player_comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    coach_id INT NOT NULL,
    captain_id INT NOT NULL,
    sender_role ENUM('player', 'coach', 'captain') NOT NULL,
    message TEXT NOT NULL,
    coach_reply_message TEXT,
    coach_reply_date TIMESTAMP NULL DEFAULT NULL,
    captain_reply_message TEXT,
    captain_reply_date TIMESTAMP NULL DEFAULT NULL,
    status ENUM('Active', 'Resolved') DEFAULT 'Active',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES player(player_id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coach(coach_id) ON DELETE CASCADE,
    FOREIGN KEY (captain_id) REFERENCES captain(captain_id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);


-- ═════════════════════════════════════════════════════════════════════════════
-- SEED DATA  (password for ALL users = sportnet123)
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lUJP
-- ═════════════════════════════════════════════════════════════════════════════

SET @pw = '$2b$10$DGBGW4IhiweWdbakrjNZWux9JBC9aqMqjuD1b8OqiC2OE6Zt15Z8a';

-- ─── USERS ───────────────────────────────────────────────────────────────────
INSERT INTO users (email, password_hash, role) VALUES ('director1@vau.ac.lk', @pw, 'director'); -- 1
INSERT INTO users (email, password_hash, role) VALUES ('director2@vau.ac.lk', @pw, 'director'); -- 2
INSERT INTO users (email, password_hash, role) VALUES ('manager@vau.ac.lk', @pw, 'manager'); -- 3
INSERT INTO users (email, password_hash, role) VALUES ('coach1@vau.ac.lk', @pw, 'coach'); -- 4
INSERT INTO users (email, password_hash, role) VALUES ('coach2@vau.ac.lk', @pw, 'coach'); -- 5
INSERT INTO users (email, password_hash, role) VALUES ('captain1@stu.vau.ac.lk', @pw, 'captain'); -- 6
INSERT INTO users (email, password_hash, role) VALUES ('captain2@stu.vau.ac.lk', @pw, 'captain'); -- 7
INSERT INTO users (email, password_hash, role) VALUES ('player1@stu.vau.ac.lk', @pw, 'player'); -- 8
INSERT INTO users (email, password_hash, role) VALUES ('player2@stu.vau.ac.lk', @pw, 'player'); -- 9
INSERT INTO users (email, password_hash, role) VALUES ('player3@stu.vau.ac.lk', @pw, 'player'); -- 10
INSERT INTO users (email, password_hash, role) VALUES ('player4@stu.vau.ac.lk', @pw, 'player'); -- 11
INSERT INTO users (email, password_hash, role) VALUES ('player5@stu.vau.ac.lk', @pw, 'player'); -- 12

-- ─── SEED SPORTS ──────────────────────────────────────────────────────────────
INSERT INTO sports (sport_name, sport_type, metrics, description, status) VALUES
('Cricket', 'Team', 'Batting Avg, Strike Rate', 'Standard cricket sport category with batting and bowling tracking.', 'Active'),
('Football', 'Team', 'Goals, Assists', 'Association football sport category tracking goal scores and assists.', 'Active'),
('Volleyball', 'Team', 'Blocks, Serves', 'Volleyball sport category tracking blocks and serves metrics.', 'Active'),
('Athletics', 'Individual', 'Speed, Distance', 'Track and field athletics tracking speed and distance.', 'Active');

-- ─── PROFILES ─────────────────────────────────────────────────────────────────
INSERT INTO sports_director (user_id, name, gender, age) VALUES (1, 'Rajapaksa Fernando', 'Male', 55);
INSERT INTO sports_director (user_id, name, gender, age) VALUES (2, 'Priya Jayasuriya', 'Female', 48);

INSERT INTO sport_manager (user_id, director_id, name, gender, age, qualification) 
VALUES (3, 1, 'Chamara Silva', 'Male', 42, 'MBA Sports Management');

INSERT INTO coach (user_id, manager_id, director_id, sport_id, name, gender, age, team_group, qualification, coaching_level, sport_category, specializations, attendance, discipline, overall_perf_score)
VALUES (4, 1, 1, 2, 'Mike Perera', 'Male', 38, 'Alpha Squad', 'B.Sc. Sports Science', 'Professional', 'Football', 'Strategy', 92.5, 9, 87.5);

INSERT INTO coach (user_id, manager_id, director_id, sport_id, name, gender, age, team_group, qualification, coaching_level, sport_category, specializations, attendance, discipline, overall_perf_score)
VALUES (5, 1, 1, 1, 'Sarah Silva', 'Female', 35, 'Beta Squad', 'M.Sc. Physical Education', 'Professional', 'Cricket', 'Fitness', 95.0, 10, 91.0);

INSERT INTO captain (user_id, managed_by_coach_id, director_id, sport_id, name, gender, age, sport_category, position, leadership_rt, motivation_lvl, strategy_rt, total_score)
VALUES (6, 1, 1, 2, 'Kasun Jayawardena', 'Male', 24, 'Football', 'Forward', 8.5, 9.0, 7.5, 72.50);

INSERT INTO captain (user_id, managed_by_coach_id, director_id, sport_id, name, gender, age, sport_category, position, leadership_rt, motivation_lvl, strategy_rt, total_score)
VALUES (7, 2, 1, 1, 'Samanthi Perera', 'Female', 22, 'Cricket', 'Defender', 9.0, 8.5, 8.0, 80.00);

INSERT INTO player (user_id, managed_by_captain_id, coach_id, sport_id, name, gender, age, sport_category, position, skill_level, discipline, total_score, approval_status)
VALUES (8, 1, 1, 2, 'Nimal Rathnayake', 'Male', 20, 'Football', 'Midfielder', 'Advanced', 8, 75.00, 'Approved');

INSERT INTO player (user_id, managed_by_captain_id, coach_id, sport_id, name, gender, age, sport_category, position, skill_level, discipline, total_score, approval_status)
VALUES (9, 1, 1, 2, 'Kasun Bandara', 'Male', 21, 'Football', 'Striker', 'Intermediate', 6, 60.00, 'Approved');

INSERT INTO player (user_id, managed_by_captain_id, coach_id, sport_id, name, gender, age, sport_category, position, skill_level, discipline, total_score, approval_status)
VALUES (10, 1, 1, 2, 'Amal Dissanayake', 'Male', 19, 'Football', 'Goalkeeper', 'Beginner', 7, 55.00, 'Approved');

-- ─── REPORTS ──────────────────────────────────────────────────────────────────
INSERT INTO player_reports (player_id, captain_id, date, attendance, discipline, training_hours, status) VALUES
(1, 1, '2026-05-12', 'Present', 8, 2.5, 'Final Approved'),
(2, 1, '2026-05-12', 'Present', 6, 2.0, 'Final Approved'),
(3, 1, '2026-05-12', 'Absent', 5, 0.0, 'Final Approved'),
(1, 1, '2026-05-13', 'Present', 8, 3.0, 'Final Approved'),
(2, 1, '2026-05-13', 'Absent', 5, 0.0, 'Final Approved'),
(3, 1, '2026-05-13', 'Present', 7, 2.5, 'Final Approved'),
(1, 1, '2026-05-14', 'Present', 9, 2.0, 'Pending'),
(2, 1, '2026-05-14', 'Present', 7, 2.0, 'Pending'),
(3, 1, '2026-05-14', 'Present', 8, 2.0, 'Pending');

INSERT INTO captain_reports (captain_id, coach_id, date, attendance, discipline, training_hours, strategy_rt, responsibility_rt, status) VALUES
(1, 1, '2026-05-12', 'Present', 'Good', 3.0, 7.5, 8.0, 'Final Approved'),
(1, 1, '2026-05-13', 'Present', 'Good', 4.0, 8.0, 8.5, 'Final Approved');
