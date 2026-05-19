const db = require('../config/db');

/**
 * Logs a system action to the audit_logs table
 * @param {number} userId - The ID of the user performing the action
 * @param {string} action - Short description of the action (e.g. 'APPROVE_REPORT')
 * @param {string} details - Detailed info or JSON string
 */
const logAction = async (userId, action, details) => {
    try {
        await db.query(
            'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
            [userId, action, typeof details === 'object' ? JSON.stringify(details) : details]
        );
    } catch (error) {
        console.error('Logging failed:', error);
    }
};

module.exports = { logAction };
