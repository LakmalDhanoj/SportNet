 
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

        // Validate and lookup relationships before creating the user row to prevent orphans
        let director_id = null;
        if (req.user && req.user.role === 'director') {
            const [dirRows] = await db.query('SELECT director_id FROM sports_director WHERE user_id = ?', [req.user.user_id]);
            if (dirRows.length > 0) {
                director_id = dirRows[0].director_id;
            }
        }

        if (role === 'manager') {
            if (req.user && req.user.role !== 'director') {
                return res.status(403).json({ message: 'Only directors can add managers' });
            }
        }

        let finalSportCategory = null;

        if (role === 'coach') {
            if (managed_by_id) {
                const [mgrRows] = await db.query('SELECT sport_specialization FROM sport_manager WHERE manager_id = ?', [managed_by_id]);
                if (mgrRows.length === 0) {
                    return res.status(400).json({ message: 'Assigned sports manager does not exist' });
                }
                finalSportCategory = mgrRows[0].sport_specialization;
            }
        } else if (role === 'captain') {
            if (managed_by_id) {
                const [coachRows] = await db.query('SELECT sport_category FROM coach WHERE coach_id = ?', [managed_by_id]);
                if (coachRows.length === 0) {
                    return res.status(400).json({ message: 'Assigned coach does not exist' });
                }
                finalSportCategory = coachRows[0].sport_category;
            }
        } else if (role === 'player') {
            if (managed_by_id) {
                const [capRows] = await db.query('SELECT sport_category FROM captain WHERE captain_id = ?', [managed_by_id]);
                if (capRows.length === 0) {
                    return res.status(400).json({ message: 'Assigned captain does not exist' });
                }
                finalSportCategory = capRows[0].sport_category;
            }
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
            case 'manager': {
                const { sport_specialization } = req.body;
                await db.query(
                    'INSERT INTO sport_manager (user_id, director_id, name, gender, age, qualification, sport_specialization) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [user_id, director_id, name, gender, age, qualification, sport_specialization || null]
                );
                break;
            }
            case 'coach': {
                await db.query(
                    'INSERT INTO coach (user_id, manager_id, name, gender, age, qualification, sport_category) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, name, gender, age, qualification, finalSportCategory]
                );
                break;
            }
            case 'captain': {
                await db.query(
                    'INSERT INTO captain (user_id, managed_by_coach_id, name, gender, age, sport_category) VALUES (?, ?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, name, gender, age, finalSportCategory]
                );
                break;
            }
            case 'player': {
                await db.query(
                    'INSERT INTO player (user_id, managed_by_captain_id, name, gender, age, sport_category, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, name, gender, age, finalSportCategory, 'Approved']
                );
                break;
            }
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
            `SELECT p.player_id, p.name, p.gender, p.age, p.skill_level, p.discipline, p.total_score, p.approval_status, p.position, p.sport_category, u.email 
             FROM player p
             JOIN users u ON p.user_id = u.user_id
             WHERE p.managed_by_captain_id = ?`,
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
                    p.discipline, p.total_score, p.approval_status, p.position, p.sport_category,
                    c.name AS captain_name, u.email
             FROM player p
             JOIN users u ON p.user_id = u.user_id
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
        const [coaches] = await db.query('SELECT coach_id, name, sport_category FROM coach ORDER BY name');
        res.json({ coaches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of captains (dropdown for assigning player)
exports.getCaptainList = async (req, res) => {
    try {
        const [captains] = await db.query('SELECT captain_id, name, sport_category FROM captain ORDER BY name');
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
