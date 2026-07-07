const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { logAction } = require('../utils/logger');

// 1. Captain submits a player request
exports.submitPlayerRequest = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Only captains can submit player requests.' });

        const [captainRows] = await db.query('SELECT captain_id, managed_by_coach_id, sport_category FROM captain WHERE user_id = ?', [user_id]);
        if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found.' });
        
        const { captain_id, managed_by_coach_id, sport_category } = captainRows[0];
        if (!managed_by_coach_id) {
            return res.status(400).json({ message: 'You must be assigned to a coach to submit player requests.' });
        }

        const { player_name, player_email, player_password, gender, age, position } = req.body;
        if (!player_name || !player_email || !player_password) {
            return res.status(400).json({ message: 'Player name, email, and password are required.' });
        }

        const lowerEmail = player_email.toLowerCase();
        const isCampusEmail = lowerEmail.endsWith('.edu') || lowerEmail.endsWith('.ac.lk') || lowerEmail.endsWith('.edu.lk') || lowerEmail.endsWith('@sportnet.com');
        if (!isCampusEmail) {
            return res.status(400).json({ message: 'Please use a valid campus email address (ending with .edu, .ac.lk, or .edu.lk).' });
        }

        // Hashing passkey
        const playerPasswordHash = await bcrypt.hash(player_password, 10);

        // Check if player request or user already exists
        const [existingUsers] = await db.query('SELECT user_id FROM users WHERE email = ?', [player_email]);
        const isDuplicate = existingUsers.length > 0;

        const [result] = await db.query(
            `INSERT INTO player_requests (captain_id, coach_id, player_name, player_email, player_password_hash, gender, age, sport_category, position, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [captain_id, managed_by_coach_id, player_name, player_email, playerPasswordHash, gender || null, age || null, sport_category || 'Football', position || 'Midfielder']
        );

        await logAction(user_id, 'SUBMIT_PLAYER_REQUEST', { request_id: result.insertId, player_email, isDuplicate });
        res.status(201).json({
            message: isDuplicate 
                ? 'Request submitted. Warning: This player email is already registered in the system (Duplicate Found).' 
                : 'Player request submitted to your coach for review.',
            request_id: result.insertId,
            isDuplicate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error submitting request.' });
    }
};

// 2. Captain retrieves their submitted requests
exports.getCaptainRequests = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Forbidden' });

        const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
        if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found.' });

        const [requests] = await db.query(
            `SELECT pr.*, 
                    EXISTS(SELECT 1 FROM users u WHERE u.email = pr.player_email) AS is_duplicate
             FROM player_requests pr 
             WHERE pr.captain_id = ? 
             ORDER BY pr.created_at DESC`,
            [captainRows[0].captain_id]
        );

        res.json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving requests.' });
    }
};

// 3. Captain retracts / removes a request (e.g. Duplicate Removed)
exports.removePlayerRequest = async (req, res) => {
    try {
        const { request_id } = req.params;
        const { user_id, role } = req.user;
        
        // Find request
        const [requestRows] = await db.query('SELECT * FROM player_requests WHERE request_id = ?', [request_id]);
        if (!requestRows.length) return res.status(404).json({ message: 'Player request not found.' });
        
        const request = requestRows[0];
        
        // Verify authorization (only captain who sent it or their coach can remove it)
        if (role === 'captain') {
            const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
            if (!captainRows.length || captainRows[0].captain_id !== request.captain_id) {
                return res.status(403).json({ message: 'Not authorized to retract this request.' });
            }
        } else if (role === 'coach') {
            const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
            if (!coachRows.length || coachRows[0].coach_id !== request.coach_id) {
                return res.status(403).json({ message: 'Not authorized.' });
            }
        } else if (role !== 'director') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Set status to Duplicate Removed or delete
        await db.query(
            "UPDATE player_requests SET status = 'Duplicate Removed' WHERE request_id = ?",
            [request_id]
        );

        await logAction(user_id, 'REMOVE_PLAYER_REQUEST', { request_id });
        res.json({ message: 'Request removed and flagged as Duplicate Removed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error removing request.' });
    }
};

// 4. Coach retrieves pending requests under their supervision
exports.getCoachRequests = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found.' });

        const [requests] = await db.query(
            `SELECT pr.*, c.name AS captain_name,
                    EXISTS(SELECT 1 FROM users u WHERE u.email = pr.player_email) AS is_duplicate
             FROM player_requests pr
             JOIN captain c ON pr.captain_id = c.captain_id
             WHERE pr.coach_id = ? AND pr.status = 'Pending'
             ORDER BY pr.created_at DESC`,
            [coachRows[0].coach_id]
        );

        res.json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving pending squad requests.' });
    }
};

// 5. Coach approves or rejects player request (with transaction)
exports.reviewPlayerRequest = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const { request_id } = req.params;
        const { decision } = req.body; // 'Approved' or 'Rejected'
        if (!decision || !['Approved', 'Rejected'].includes(decision)) {
            return res.status(400).json({ message: 'Decision must be Approved or Rejected.' });
        }

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        const coach_id = coachRows[0].coach_id;

        // Verify request exists and belongs to this coach
        const [requests] = await db.query('SELECT * FROM player_requests WHERE request_id = ? AND coach_id = ?', [request_id, coach_id]);
        if (!requests.length) {
            return res.status(404).json({ message: 'Player request not found or not assigned to you.' });
        }
        const request = requests[0];

        if (request.status !== 'Pending') {
            return res.status(400).json({ message: `Request has already been evaluated as: ${request.status}` });
        }

        await connection.beginTransaction();

        if (decision === 'Rejected') {
            await connection.query(
                "UPDATE player_requests SET status = 'Rejected' WHERE request_id = ?",
                [request_id]
            );
            await connection.commit();
            await logAction(user_id, 'REJECT_PLAYER_REQUEST', { request_id });
            return res.json({ message: 'Player request has been rejected.' });
        }

        // Decision is Approved: check if already exists to prevent duplication error
        const [existing] = await connection.query('SELECT user_id FROM users WHERE email = ?', [request.player_email]);
        if (existing.length > 0) {
            await connection.query(
                "UPDATE player_requests SET status = 'Duplicate Removed' WHERE request_id = ?",
                [request_id]
            );
            await connection.commit();
            return res.status(409).json({ message: 'Player email already registered in system. Request marked as Duplicate Removed.' });
        }

        // Create player user credentials
        const [userResult] = await connection.query(
            "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'player')",
            [request.player_email, request.player_password_hash]
        );

        // Create player profile
        const [sportRows] = await connection.query('SELECT sport_id FROM sports WHERE sport_name = ?', [request.sport_category]);
        const sport_id = sportRows.length > 0 ? sportRows[0].sport_id : null;

        await connection.query(
            `INSERT INTO player (user_id, managed_by_captain_id, coach_id, sport_id, name, gender, age, sport_category, position, approval_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved')`,
            [userResult.insertId, request.captain_id, coach_id, sport_id, request.player_name, request.gender, request.age, request.sport_category, request.position]
        );

        // Mark request as Approved
        await connection.query(
            "UPDATE player_requests SET status = 'Approved' WHERE request_id = ?",
            [request_id]
        );

        await connection.commit();
        await logAction(user_id, 'APPROVE_PLAYER_REQUEST', { request_id, player_email: request.player_email });
        res.json({ message: 'Player approved, user created, and profile successfully assigned to squad.' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error resolving player request.' });
    } finally {
        connection.release();
    }
};
