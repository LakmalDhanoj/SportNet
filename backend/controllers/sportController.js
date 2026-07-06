const db = require('../config/db');

exports.getAllSports = async (req, res) => {
    try {
        // Return seed data so live metrics panel works on login page
        const [rows] = await db.query(`
            SELECT s.*, 
                   92.4 as attendanceRate,
                   15 as playersCount,
                   'Average Score' as customMetricName,
                   8.4 as customMetricValue
            FROM sports s
        `);
        res.json({ sports: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createSport = async (req, res) => {
    try { res.json({ message: 'createSport: to be implemented by Member 2' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateSport = async (req, res) => {
    try { res.json({ message: 'updateSport: to be implemented by Member 2' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteSport = async (req, res) => {
    try { res.json({ message: 'deleteSport: to be implemented by Member 2' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
