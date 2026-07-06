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

// ─── CAPTAIN REPORTS (submitted by Coach) ────────────────────────────────────

// Coach: get their captains list
exports.getMyCaptains = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });
        const coach_id = coachRows[0].coach_id;

        const [captains] = await db.query(
            `SELECT c.captain_id, c.name, c.gender, c.age, c.leadership_rt, c.motivation_lvl,
                    c.strategy_rt, c.total_score,
                    cr.report_id, cr.date, cr.attendance, cr.discipline, cr.training_hours, cr.notes,
                    cr.strategy_rt AS eval_strategy, cr.responsibility_rt, cr.status AS report_status
             FROM captain c
             LEFT JOIN captain_reports cr ON c.captain_id = cr.captain_id AND cr.coach_id = ?
             WHERE c.managed_by_coach_id = ?
             ORDER BY cr.date DESC`,
            [coach_id, coach_id]
        );
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Coach: submit captain evaluation report
exports.submitCaptainReport = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Only coaches can evaluate captains' });

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });
        const coach_id = coachRows[0].coach_id;

        const { captain_id, date, attendance, discipline, training_hours, strategy_rt, responsibility_rt, notes } = req.body;

        // Verify captain belongs to this coach
        const [capCheck] = await db.query(
            'SELECT captain_id FROM captain WHERE captain_id = ? AND managed_by_coach_id = ?',
            [captain_id, coach_id]
        );
        if (!capCheck.length) return res.status(403).json({ message: 'Not authorized' });

        const [existing] = await db.query(
            'SELECT report_id FROM captain_reports WHERE captain_id = ? AND coach_id = ? AND date = ?',
            [captain_id, coach_id, date]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE captain_reports SET attendance = ?, discipline = ?, training_hours = ?, strategy_rt = ?,
                 responsibility_rt = ?, notes = ?, status = 'Final Approved' WHERE report_id = ?`,
                [attendance, discipline, training_hours || 0, strategy_rt, responsibility_rt, notes || '', existing[0].report_id]
            );
        } else {
            await db.query(
                `INSERT INTO captain_reports (captain_id, coach_id, date, attendance, discipline, training_hours,
                 strategy_rt, responsibility_rt, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Final Approved')`,
                [captain_id, coach_id, date, attendance, discipline, training_hours || 0, strategy_rt, responsibility_rt, notes || '']
            );
        }

        // Update captain's total_score (60% from coach eval)
        const discScore = discipline === 'Good' ? 10 : (discipline === 'Average' ? 7 : 4);
        const coachScore = (discScore + Number(strategy_rt) + Number(responsibility_rt)) / 3;
        await db.query(
            'UPDATE captain SET total_score = ROUND(? * 0.6, 2) WHERE captain_id = ?',
            [coachScore * 10, captain_id]
        );

        res.json({ message: 'Captain evaluation saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── DIRECTOR OVERVIEW ────────────────────────────────────────────────────────

exports.getDirectorOverview = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'director') return res.status(403).json({ message: 'Forbidden' });

        const [[{ total_submitted }]] = await db.query(
            "SELECT COUNT(*) AS total_submitted FROM player_reports"
        );
        const [[{ total_approved }]] = await db.query(
            "SELECT COUNT(*) AS total_approved FROM player_reports WHERE status = 'Final Approved'"
        );
        const [[{ captain_evals }]] = await db.query(
            "SELECT COUNT(*) AS captain_evals FROM captain_reports WHERE status = 'Final Approved'"
        );
        const [[{ total_captains }]] = await db.query("SELECT COUNT(*) AS total_captains FROM captain");
        const [[{ total_players }]] = await db.query("SELECT COUNT(*) AS total_players FROM player");
        const [[{ total_coaches }]] = await db.query("SELECT COUNT(*) AS total_coaches FROM coach");
        const [[{ pending_reports }]] = await db.query(
            "SELECT COUNT(*) AS pending_reports FROM player_reports WHERE status = 'Pending'"
        );

        res.json({
            total_submitted,
            total_approved,
            pending_reports,
            captain_evals,
            total_captains,
            total_players,
            total_coaches
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Manager: get coach performance overview
exports.getManagerOverview = async (req, res) => {
    try {
        const { role } = req.user;
        if (!['manager', 'director'].includes(role)) return res.status(403).json({ message: 'Forbidden' });

        const [coaches] = await db.query(
            `SELECT c.coach_id, c.name, c.discipline, c.evaluation_sc,
                    COUNT(DISTINCT cap.captain_id) AS captain_count,
                    COUNT(DISTINCT cr.report_id) AS reports_filed,
                    SUM(CASE WHEN pr.status = 'Final Approved' THEN 1 ELSE 0 END) AS approved_count
             FROM coach c
             LEFT JOIN captain cap ON cap.managed_by_coach_id = c.coach_id
             LEFT JOIN captain_reports cr ON cr.coach_id = c.coach_id
             LEFT JOIN player_reports pr ON pr.captain_id = cap.captain_id
             GROUP BY c.coach_id`
        );
        res.json({ coaches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Player: get their own reports
exports.getPlayerReports = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'player') return res.status(403).json({ message: 'Forbidden' });

        const [playerRows] = await db.query('SELECT * FROM player WHERE user_id = ?', [user_id]);
        if (!playerRows.length) return res.status(404).json({ message: 'Player profile not found' });

        const [reports] = await db.query(
            `SELECT pr.date, pr.attendance, pr.discipline, pr.training_hours, pr.notes, pr.status, pr.coach_feedback,
                    c.name AS captain_name
             FROM player_reports pr
             JOIN captain c ON pr.captain_id = c.captain_id
             WHERE pr.player_id = ?
             ORDER BY pr.date DESC`,
            [playerRows[0].player_id]
        );

        const totalPresent = reports.filter(r => r.attendance === 'Present').length;
        const attendanceRate = reports.length > 0 ? Math.round((totalPresent / reports.length) * 100) : 0;

        res.json({ player: playerRows[0], reports, attendanceRate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};