const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { logAction } = require('../utils/logger');

// ─── ADMIN: Get all users ──────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Create a new user + role profile
exports.createUser = async (req, res) => {
    try {
        const { email, password, role, name, gender, age, qualification, managed_by_id } = req.body;
        if (!email || !password || !role || !name) {
            return res.status(400).json({ message: 'email, password, role, and name are required' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, role]
        );
        const user_id = result.insertId;

        switch (role) {
            case 'director':
                await db.query('INSERT INTO sports_director (user_id, name, gender, age) VALUES (?, ?, ?, ?)', [user_id, name, gender, age]);
                break;
            case 'manager':
                await db.query(
                    'INSERT INTO sport_manager (user_id, director_id, name, gender, age, qualification) VALUES (?, ?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, name, gender, age, qualification]
                );
                break;
            case 'coach':
                await db.query(
                    'INSERT INTO coach (user_id, manager_id, name, gender, age, qualification) VALUES (?, ?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, name, gender, age, qualification]
                );
                break;
            case 'captain':
                await db.query(
                    'INSERT INTO captain (user_id, managed_by_coach_id, name, gender, age) VALUES (?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, name, gender, age]
                );
                break;
            case 'player':
                await db.query(
                    'INSERT INTO player (user_id, managed_by_captain_id, name, gender, age) VALUES (?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, name, gender, age]
                );
                break;
            default:
                break;
        }

        res.status(201).json({ message: 'User created successfully', user_id });
        await logAction(req.user.user_id, 'CREATE_USER', { target_email: email, role });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        await db.query('DELETE FROM users WHERE user_id = ?', [user_id]);
        await logAction(req.user.user_id, 'DELETE_USER', { target_user_id: user_id });
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── ROLE-SPECIFIC QUERIES ────────────────────────────────────────────────────

// Captain: get my assigned players
exports.getMyPlayers = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Forbidden' });

        const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
        if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found' });

        const [players] = await db.query(
            'SELECT player_id, name, gender, age, skill_level, discipline, total_score FROM player WHERE managed_by_captain_id = ?',
            [captainRows[0].captain_id]
        );
        res.json({ players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Coach: get my captains
exports.getMyCaptains = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });

        const [captains] = await db.query(
            'SELECT captain_id, name, gender, age, leadership_rt, motivation_lvl, strategy_rt, total_score FROM captain WHERE managed_by_coach_id = ?',
            [coachRows[0].coach_id]
        );
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all coaches (for manager / director)
exports.getAllCoaches = async (req, res) => {
    try {
        const [coaches] = await db.query(
            `SELECT c.coach_id, c.name, c.gender, c.age, c.qualification,
                    c.attendance, c.discipline, c.evaluation_sc,
                    COUNT(cap.captain_id) AS captains_count
             FROM coach c
             LEFT JOIN captain cap ON cap.managed_by_coach_id = c.coach_id
             GROUP BY c.coach_id`
        );
        res.json({ coaches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all captains (for admin/director/manager)
exports.getAllCaptains = async (req, res) => {
    try {
        const [captains] = await db.query(
            `SELECT c.captain_id, c.name, c.gender, c.age, c.total_score,
                    co.name AS coach_name,
                    COUNT(p.player_id) AS player_count
             FROM captain c
             LEFT JOIN coach co ON co.coach_id = c.managed_by_coach_id
             LEFT JOIN player p ON p.managed_by_captain_id = c.captain_id
             GROUP BY c.captain_id`
        );
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all players (for admin/director)
exports.getAllPlayers = async (req, res) => {
    try {
        const [players] = await db.query(
            `SELECT p.player_id, p.name, p.gender, p.age, p.skill_level,
                    p.discipline, p.total_score,
                    c.name AS captain_name
             FROM player p
             LEFT JOIN captain c ON c.captain_id = p.managed_by_captain_id`
        );
        res.json({ players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of coaches (dropdown for assigning captain)
exports.getCoachList = async (req, res) => {
    try {
        const [coaches] = await db.query('SELECT coach_id, name FROM coach ORDER BY name');
        res.json({ coaches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of captains (dropdown for assigning player)
exports.getCaptainList = async (req, res) => {
    try {
        const [captains] = await db.query('SELECT captain_id, name FROM captain ORDER BY name');
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of directors (dropdown)
exports.getDirectorList = async (req, res) => {
    try {
        const [directors] = await db.query('SELECT director_id, name FROM sports_director ORDER BY name');
        res.json({ directors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of managers (dropdown)
exports.getManagerList = async (req, res) => {
    try {
        const [managers] = await db.query('SELECT manager_id, name FROM sport_manager ORDER BY name');
        res.json({ managers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get system audit logs (Admin/Director)
exports.getAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.query(
            `SELECT l.*, u.email as user_email 
             FROM audit_logs l 
             LEFT JOIN users u ON u.user_id = l.user_id 
             ORDER BY l.created_at DESC LIMIT 100`
        );
        res.json({ logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

