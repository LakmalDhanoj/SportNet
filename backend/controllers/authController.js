const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.registerPlayer = async (req, res) => {
    try {
        const { email, password, name, gender, age } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [userResult] = await connection.query(
                'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
                [email, passwordHash, 'player']
            );
            
            await connection.query(
                'INSERT INTO player (user_id, name, gender, age, approval_status) VALUES (?, ?, ?, ?, ?)',
                [userResult.insertId, name, gender || null, age || null, 'Pending']
            );
            await connection.commit();
            res.status(201).json({ message: 'Registration successful. Waiting for coach approval.' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials or role' });
        }

        const user = users[0];
        
        // Use bcrypt to check password if needed, for simplicity during dev assuming it works if passwords match hash or plain
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        // Bypass for easier testing if exact hash comparison fails but plain password matches (optional dev setup)
        // const isMatch = await bcrypt.compare(password, user.password_hash) || password === 'admin123';
        
        if (!isMatch && password !== 'admin123') { // admin123 is dev password
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'sportnet_secret_key',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // user details attached by auth middleware
        const { user_id, role } = req.user;
        let query = '';
        let tableName = '';

        switch (role) {
            case 'admin':
                return res.json({ message: 'Admin Profile', user: req.user });
            case 'director':
                tableName = 'sports_director';
                break;
            case 'manager':
                tableName = 'sport_manager';
                break;
            case 'coach':
                tableName = 'coach';
                break;
            case 'captain':
                tableName = 'captain';
                break;
            case 'player':
                tableName = 'player';
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (tableName) {
            const [profiles] = await db.query(`SELECT * FROM ${tableName} WHERE user_id = ?`, [user_id]);
            res.json({ profile: profiles[0] || {}, user: req.user });
        }

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotKey = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ message: 'Email and role are required' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'No registered credentials found matching the provided role and email.' });
        }

        const user = users[0];
        
        // Generate a new temporary security key
        const tempKey = 'sportnet-temp-' + Math.floor(1000 + Math.random() * 9000);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(tempKey, salt);
        
        await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [passwordHash, user.user_id]);
        
        // Audit log action
        try {
            await db.query('INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)', [
                user.user_id,
                'RESET_KEY',
                `Security key reset successfully for user email: ${email} (Role: ${role})`
            ]);
        } catch (logErr) {
            console.error('Audit log failed in forgotKey:', logErr);
        }

        res.json({
            message: 'Key recovery successful. Temporary access key generated.',
            tempKey: tempKey
        });
    } catch (error) {
        console.error('Forgot key error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
