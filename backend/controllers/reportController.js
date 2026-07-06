 const db = require('../config/db');
const { logAction } = require('../utils/logger');

// ─── PLAYER REPORTS (submitted by Captain) ───────────────────────────────────

// Captain: submit/update batch of player reports
exports.submitPlayerReports = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Only captains can submit player reports' });

        const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
        if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found' });
        const captain_id = captainRows[0].captain_id;

        const { date, reports, isDraft } = req.body; 
        const status = isDraft ? 'Draft' : 'Pending';

        if (!date || !Array.isArray(reports) || reports.length === 0) {
            return res.status(400).json({ message: 'Date and reports array are required' });
        }

        const values = reports.map(r => [r.player_id, captain_id, date, r.attendance, r.discipline, r.training_hours || 0, r.notes || '', status]);

        await db.query(
            `INSERT INTO player_reports (player_id, captain_id, date, attendance, discipline, training_hours, notes, status) 
             VALUES ? ON DUPLICATE KEY UPDATE attendance=VALUES(attendance), discipline=VALUES(discipline), training_hours=VALUES(training_hours), notes=VALUES(notes), status=VALUES(status)`,
            [values]
        );

        await logAction(user_id, isDraft ? 'SAVE_DRAFT_REPORTS' : 'SUBMIT_PLAYER_REPORTS', { count: reports.length, date });
        res.status(201).json({ message: isDraft ? 'Draft saved successfully' : 'Reports submitted for review' });

    } catch (error) {
        console.error('Submit player reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Captain: get their squad's latest reports
exports.getCaptainSquadReports = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Forbidden' });

        const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
        if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found' });
        const captain_id = captainRows[0].captain_id;

        const [players] = await db.query(
            `SELECT p.player_id, p.name, p.skill_level,
                pr.report_id, pr.date, pr.attendance, pr.discipline, pr.training_hours, pr.notes, pr.status, pr.coach_feedback
             FROM player p
             LEFT JOIN player_reports pr ON p.player_id = pr.player_id AND pr.captain_id = ?
             WHERE p.managed_by_captain_id = ?
             ORDER BY pr.date DESC`,
            [captain_id, captain_id]
        );
        res.json({ players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
