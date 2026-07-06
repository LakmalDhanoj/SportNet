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

// Captain: get submission status history
exports.getCaptainSubmissionStatus = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Forbidden' });

        const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
        if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found' });
        const captain_id = captainRows[0].captain_id;

        const [reports] = await db.query(
            `SELECT pr.date, pr.status, p.name AS player_name, pr.attendance, pr.discipline, pr.training_hours, pr.notes, pr.coach_feedback
             FROM player_reports pr
             JOIN player p ON pr.player_id = p.player_id
             WHERE pr.captain_id = ?
             ORDER BY pr.date DESC, p.name`,
            [captain_id]
        );
        res.json({ reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Coach: get all player reports submitted by their captains (pending review)
exports.getPlayerReportsForCoach = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });
        const coach_id = coachRows[0].coach_id;

        const [reports] = await db.query(
            `SELECT pr.report_id, pr.date, pr.attendance, pr.discipline, pr.training_hours, pr.notes, pr.status, pr.coach_feedback,
                    p.name AS player_name, c.name AS captain_name, pr.captain_id,
                    p.skill_level, p.injury_status
             FROM player_reports pr
             JOIN player p ON pr.player_id = p.player_id
             JOIN captain c ON pr.captain_id = c.captain_id
             WHERE c.managed_by_coach_id = ?
             ORDER BY pr.date DESC, pr.status`,

            [coach_id]
        );
        res.json({ reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Coach: approve or override a player report
exports.approvePlayerReport = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const { report_id } = req.params;
        const { attendance, discipline, training_hours, notes, coach_feedback, status } = req.body;

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        const coach_id = coachRows[0].coach_id;

        // Verify this report belongs to one of this coach's captains
        const [check] = await db.query(
            `SELECT pr.report_id FROM player_reports pr
             JOIN captain c ON pr.captain_id = c.captain_id
             WHERE pr.report_id = ? AND c.managed_by_coach_id = ?`,
            [report_id, coach_id]
        );
        if (!check.length) return res.status(403).json({ message: 'Not authorized to edit this report' });

        await db.query(
            'UPDATE player_reports SET attendance = ?, discipline = ?, training_hours = ?, notes = ?, coach_feedback = ?, status = ? WHERE report_id = ?',
            [attendance, discipline, training_hours, notes, coach_feedback, status, report_id]
        );

        // Update player profile if skill or health status is provided
        const { skill_level, injury_status } = req.body;
        if (skill_level || injury_status) {
            const [report] = await db.query('SELECT player_id FROM player_reports WHERE report_id = ?', [report_id]);
            if (report.length > 0) {
                if (skill_level && injury_status) {
                    await db.query('UPDATE player SET skill_level = ?, injury_status = ? WHERE player_id = ?', [skill_level, injury_status, report[0].player_id]);
                } else if (skill_level) {
                    await db.query('UPDATE player SET skill_level = ? WHERE player_id = ?', [skill_level, report[0].player_id]);
                } else if (injury_status) {
                    await db.query('UPDATE player SET injury_status = ? WHERE player_id = ?', [injury_status, report[0].player_id]);
                }
            }
        }

        await logAction(req.user.user_id, 'APPROVE_PLAYER_REPORT', { report_id, status });

        res.json({ message: 'Report updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Coach: bulk approve all pending reports from a captain
exports.bulkApproveByCaption = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const { captain_id } = req.params;
        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        const coach_id = coachRows[0].coach_id;

        // Verify captain belongs to this coach
        const [capCheck] = await db.query(
            'SELECT captain_id FROM captain WHERE captain_id = ? AND managed_by_coach_id = ?',
            [captain_id, coach_id]
        );
        if (!capCheck.length) return res.status(403).json({ message: 'Not authorized' });

        await db.query(
            'UPDATE player_reports SET status = "Final Approved" WHERE captain_id = ? AND status = "Pending"',
            [captain_id]
        );

        await logAction(req.user.user_id, 'BULK_APPROVE_REPORTS', { captain_id });
        res.json({ message: 'All pending reports for this captain have been approved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};