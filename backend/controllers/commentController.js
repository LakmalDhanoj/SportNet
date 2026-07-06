const db = require('../config/db');
const { logAction } = require('../utils/logger');

// 1. Add comment (Player, Coach, or Captain)
exports.addComment = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Comment message content is required.' });
        }

        if (role === 'player') {
            // Find player ID and assigned captain
            const [playerRows] = await db.query('SELECT player_id, managed_by_captain_id FROM player WHERE user_id = ?', [user_id]);
            if (!playerRows.length) return res.status(404).json({ message: 'Player profile not found.' });
            const { player_id, managed_by_captain_id: captain_id } = playerRows[0];

            if (!captain_id) {
                return res.status(400).json({ message: 'You must be assigned to a captain to send comments.' });
            }

            // Find Coach ID from Captain's assignments
            const [captainRows] = await db.query('SELECT managed_by_coach_id FROM captain WHERE captain_id = ?', [captain_id]);
            if (!captainRows.length || !captainRows[0].managed_by_coach_id) {
                return res.status(400).json({ message: 'Your captain has not been assigned a coach yet. Cannot send comments.' });
            }
            const coach_id = captainRows[0].managed_by_coach_id;

            // Save player comment (visible to both)
            const [result] = await db.query(
                'INSERT INTO player_comments (player_id, coach_id, captain_id, sender_role, message, status) VALUES (?, ?, ?, "player", ?, "Active")',
                [player_id, coach_id, captain_id, message]
            );

            return res.status(201).json({ message: 'Comment sent to Coach and Captain successfully.', comment_id: result.insertId });

        } else if (role === 'coach') {
            const { player_id } = req.body;
            if (!player_id) return res.status(400).json({ message: 'player_id is required to send comments as a Coach.' });

            // Find Coach ID
            const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
            if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found.' });
            const coach_id = coachRows[0].coach_id;

            // Find player relationships
            const [playerRows] = await db.query(
                `SELECT p.managed_by_captain_id AS captain_id, cap.managed_by_coach_id AS coach_id
                 FROM player p
                 JOIN captain cap ON p.managed_by_captain_id = cap.captain_id
                 WHERE p.player_id = ?`,
                [player_id]
            );

            if (!playerRows.length || playerRows[0].coach_id !== coach_id) {
                return res.status(403).json({ message: 'Not authorized to comment on this player.' });
            }
            const { captain_id } = playerRows[0];

            // Save Coach comment
            const [result] = await db.query(
                'INSERT INTO player_comments (player_id, coach_id, captain_id, sender_role, message, status) VALUES (?, ?, ?, "coach", ?, "Active")',
                [player_id, coach_id, captain_id, message]
            );

            return res.status(201).json({ message: 'Comment sent to player successfully.', comment_id: result.insertId });

        } else if (role === 'captain') {
            const { player_id } = req.body;
            if (!player_id) return res.status(400).json({ message: 'player_id is required to send comments as a Captain.' });

            // Find Captain ID
            const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
            if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found.' });
            const captain_id = captainRows[0].captain_id;

            // Find player relationships
            const [playerRows] = await db.query(
                `SELECT p.managed_by_captain_id AS captain_id, cap.managed_by_coach_id AS coach_id
                 FROM player p
                 JOIN captain cap ON p.managed_by_captain_id = cap.captain_id
                 WHERE p.player_id = ?`,
                [player_id]
            );

            if (!playerRows.length || playerRows[0].captain_id !== captain_id) {
                return res.status(403).json({ message: 'Not authorized to comment on this player (not in your squad).' });
            }
            const { coach_id } = playerRows[0];

            // Save Captain comment
            const [result] = await db.query(
                'INSERT INTO player_comments (player_id, coach_id, captain_id, sender_role, message, status) VALUES (?, ?, ?, "captain", ?, "Active")',
                [player_id, coach_id, captain_id, message]
            );

            return res.status(201).json({ message: 'Comment sent to player successfully.', comment_id: result.insertId });

        } else {
            return res.status(403).json({ message: 'Access denied. Comments are restricted to Players, Coaches, and Captains.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error posting comment.' });
    }
};

// 2. Get comments thread
exports.getComments = async (req, res) => {
    try {
        const { user_id, role } = req.user;

        if (role === 'player') {
            const [playerRows] = await db.query('SELECT player_id FROM player WHERE user_id = ?', [user_id]);
            if (!playerRows.length) return res.status(404).json({ message: 'Player profile not found.' });
            const player_id = playerRows[0].player_id;

            const [comments] = await db.query(
                'SELECT * FROM player_comments WHERE player_id = ? ORDER BY created_date ASC',
                [player_id]
            );
            return res.json({ comments });

        } else if (role === 'coach') {
            const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
            if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found.' });
            const coach_id = coachRows[0].coach_id;

            const { player_id } = req.query;

            if (player_id) {
                // Get thread for specific player
                const [comments] = await db.query(
                    `SELECT pc.*, p.name AS player_name 
                     FROM player_comments pc
                     JOIN player p ON p.player_id = pc.player_id 
                     WHERE pc.player_id = ? AND pc.coach_id = ? 
                     ORDER BY pc.created_date ASC`,
                    [player_id, coach_id]
                );
                return res.json({ comments });
            } else {
                // Get all comments for this coach
                const [comments] = await db.query(
                    `SELECT pc.*, p.name AS player_name 
                     FROM player_comments pc
                     JOIN player p ON p.player_id = pc.player_id
                     WHERE pc.coach_id = ? 
                     ORDER BY pc.created_date DESC`,
                    [coach_id]
                );
                return res.json({ comments });
            }

        } else if (role === 'captain') {
            const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
            if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found.' });
            const captain_id = captainRows[0].captain_id;

            const { player_id } = req.query;

            if (player_id) {
                // Get thread for specific player
                const [comments] = await db.query(
                    `SELECT pc.*, p.name AS player_name 
                     FROM player_comments pc
                     JOIN player p ON p.player_id = pc.player_id 
                     WHERE pc.player_id = ? AND pc.captain_id = ? 
                     ORDER BY pc.created_date ASC`,
                    [player_id, captain_id]
                );
                return res.json({ comments });
            } else {
                // Get all comments for this captain
                const [comments] = await db.query(
                    `SELECT pc.*, p.name AS player_name 
                     FROM player_comments pc
                     JOIN player p ON p.player_id = pc.player_id
                     WHERE pc.captain_id = ? 
                     ORDER BY pc.created_date DESC`,
                    [captain_id]
                );
                return res.json({ comments });
            }
        } else {
            return res.status(403).json({ message: 'Access denied. Comments are private.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving comments.' });
    }
};

// 3. Edit own comment (Player only)
exports.editComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { user_id, role } = req.user;
        const { message } = req.body;

        if (role !== 'player') return res.status(403).json({ message: 'Only players can modify their own comments.' });
        if (!message || message.trim() === '') return res.status(400).json({ message: 'Message content is required.' });

        const [playerRows] = await db.query('SELECT player_id FROM player WHERE user_id = ?', [user_id]);
        if (!playerRows.length) return res.status(404).json({ message: 'Player profile not found.' });
        const player_id = playerRows[0].player_id;

        const [result] = await db.query(
            'UPDATE player_comments SET message = ? WHERE comment_id = ? AND player_id = ? AND sender_role = "player"',
            [message, comment_id, player_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found, or you are not authorized to edit it.' });
        }

        res.json({ message: 'Comment edited successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error editing comment.' });
    }
};

// 4. Delete own comment (Player only)
exports.deleteComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { user_id, role } = req.user;

        if (role !== 'player') return res.status(403).json({ message: 'Only players can delete their own comments.' });

        const [playerRows] = await db.query('SELECT player_id FROM player WHERE user_id = ?', [user_id]);
        if (!playerRows.length) return res.status(404).json({ message: 'Player profile not found.' });
        const player_id = playerRows[0].player_id;

        const [result] = await db.query(
            'DELETE FROM player_comments WHERE comment_id = ? AND player_id = ? AND sender_role = "player"',
            [comment_id, player_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found, or you are not authorized to delete it.' });
        }

        res.json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting comment.' });
    }
};

// 5. Coach or Captain replies to a comment
exports.replyComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { user_id, role } = req.user;
        const { reply_message } = req.body;

        if (!reply_message || reply_message.trim() === '') {
            return res.status(400).json({ message: 'Reply message cannot be empty.' });
        }

        if (role === 'coach') {
            const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
            if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found.' });
            const coach_id = coachRows[0].coach_id;

            const [result] = await db.query(
                'UPDATE player_comments SET coach_reply_message = ?, coach_reply_date = CURRENT_TIMESTAMP WHERE comment_id = ? AND coach_id = ?',
                [reply_message, comment_id, coach_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Comment not found, or you do not have permission to reply.' });
            }

            return res.json({ message: 'Coach reply posted successfully.' });

        } else if (role === 'captain') {
            const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
            if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found.' });
            const captain_id = captainRows[0].captain_id;

            const [result] = await db.query(
                'UPDATE player_comments SET captain_reply_message = ?, captain_reply_date = CURRENT_TIMESTAMP WHERE comment_id = ? AND captain_id = ?',
                [reply_message, comment_id, captain_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Comment not found, or you do not have permission to reply.' });
            }

            return res.json({ message: 'Captain reply posted successfully.' });
        } else {
            return res.status(403).json({ message: 'Only coaches and captains can reply to comments.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error posting reply.' });
    }
};

// 6. Coach or Captain marks resolved
exports.resolveComment = async (req, res) => {
    try {
        const { comment_id } = req.params;
        const { user_id, role } = req.user;

        if (role === 'coach') {
            const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
            if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found.' });
            const coach_id = coachRows[0].coach_id;

            const [result] = await db.query(
                'UPDATE player_comments SET status = "Resolved" WHERE comment_id = ? AND coach_id = ?',
                [comment_id, coach_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Comment not found, or you do not have permission to modify it.' });
            }

            return res.json({ message: 'Comment thread successfully marked as resolved by Coach.' });

        } else if (role === 'captain') {
            const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
            if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found.' });
            const captain_id = captainRows[0].captain_id;

            const [result] = await db.query(
                'UPDATE player_comments SET status = "Resolved" WHERE comment_id = ? AND captain_id = ?',
                [comment_id, captain_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Comment not found, or you do not have permission to modify it.' });
            }

            return res.json({ message: 'Comment thread successfully marked as resolved by Captain.' });
        } else {
            return res.status(403).json({ message: 'Only coaches and captains can mark threads as resolved.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error marking resolved.' });
    }
};
