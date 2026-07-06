 
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
