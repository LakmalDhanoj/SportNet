const db = require('../config/db');

exports.submitPlayerReports = async (req, res) => {
    try { res.json({ message: 'submitPlayerReports: to be implemented by Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCaptainSquadReports = async (req, res) => {
    try { res.json({ reports: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCaptainSubmissionStatus = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getPlayerReportsForCoach = async (req, res) => {
    try { res.json({ reports: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.approvePlayerReport = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.bulkApproveByCaption = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getMyCaptains = async (req, res) => {
    try { res.json({ captains: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.submitCaptainReport = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getDirectorOverview = async (req, res) => {
    try { res.json({ overview: {} }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getManagerOverview = async (req, res) => {
    try { res.json({ overview: {} }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getPlayerReports = async (req, res) => {
    try { res.json({ reports: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

// Captain: get full 8-part overview
exports.getCaptainOverview = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Forbidden' });
        
        const [rows] = await db.query('SELECT * FROM captain WHERE user_id = ?', [user_id]);
        if (!rows.length) return res.status(404).json({ message: 'Captain profile not found' });
        
        res.json({ captainProfile: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Coach: get full 8-part overview
exports.getCoachOverview = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });
        
        const [rows] = await db.query('SELECT * FROM coach WHERE user_id = ?', [user_id]);
        if (!rows.length) return res.status(404).json({ message: 'Coach profile not found' });
        
        res.json({ coachProfile: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
