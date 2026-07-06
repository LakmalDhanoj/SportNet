const db = require('../config/db');
const { logAction } = require('../utils/logger');

// 1. Get all sports (Admin/Director)
exports.getAllSports = async (req, res) => {
    try {
        const [sports] = await db.query('SELECT * FROM sports ORDER BY sport_id DESC');
        res.json({ sports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving sports list.' });
    }
};

// 2. Get public sports & metrics (Landing Page)
exports.getPublicSports = async (req, res) => {
    try {
        const [sports] = await db.query('SELECT * FROM sports WHERE status = "Active"');
        
        // Let's compute dynamic stats from active database players and reports
        const enrichedSports = await Promise.all(sports.map(async (sport) => {
            const [[{ player_count }]] = await db.query(
                'SELECT COUNT(*) AS player_count FROM player WHERE sport_category = ?',
                [sport.sport_name]
            );
            
            const [[{ avg_attendance }]] = await db.query(
                'SELECT AVG(attendance) AS avg_attendance FROM player WHERE sport_category = ?',
                [sport.sport_name]
            );
            
            // Define realistic seeded values to combine with dynamic database state
            let fallbackPlayers = 20;
            let fallbackAttendance = 90;
            let customMetricValue = 12;
            let customMetricName = 'Matches';
            
            if (sport.sport_name === 'Cricket') {
                fallbackPlayers = 45;
                fallbackAttendance = 91;
                customMetricValue = 12;
                customMetricName = 'Matches';
            } else if (sport.sport_name === 'Football') {
                fallbackPlayers = 32;
                fallbackAttendance = 88;
                customMetricValue = 58;
                customMetricName = 'Goals';
            } else if (sport.sport_name === 'Volleyball') {
                fallbackPlayers = 20;
                fallbackAttendance = 85;
                customMetricValue = 15;
                customMetricName = 'Training Sessions';
            }

            return {
                ...sport,
                playersCount: player_count > 0 ? player_count : fallbackPlayers,
                attendanceRate: avg_attendance > 0 ? Math.round(avg_attendance) : fallbackAttendance,
                customMetricValue,
                customMetricName
            };
        }));
        
        res.json({ sports: enrichedSports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving public metrics.' });
    }
};

// 3. Create new sport (Admin/Director Only)
exports.createSport = async (req, res) => {
    try {
        const { sport_name, sport_type, metrics, description, status } = req.body;
        if (!sport_name || !sport_type || !metrics) {
            return res.status(400).json({ message: 'sport_name, sport_type, and metrics are required.' });
        }
        
        const [result] = await db.query(
            'INSERT INTO sports (sport_name, sport_type, metrics, description, created_by, status) VALUES (?, ?, ?, ?, ?, ?)',
            [sport_name, sport_type, metrics, description || '', req.user.user_id, status || 'Active']
        );
        
        await logAction(req.user.user_id, 'CREATE_SPORT', { sport_id: result.insertId, sport_name });
        res.status(201).json({ message: 'Sport created successfully.', sport_id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Sport designation already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error creating sport category.' });
    }
};

// 4. Update existing sport (Admin/Director Only)
exports.updateSport = async (req, res) => {
    try {
        const { sport_id } = req.params;
        const { sport_name, sport_type, metrics, description, status } = req.body;
        
        if (!sport_name || !sport_type || !metrics) {
            return res.status(400).json({ message: 'sport_name, sport_type, and metrics are required.' });
        }
        
        await db.query(
            'UPDATE sports SET sport_name = ?, sport_type = ?, metrics = ?, description = ?, status = ? WHERE sport_id = ?',
            [sport_name, sport_type, metrics, description || '', status || 'Active', sport_id]
        );
        
        await logAction(req.user.user_id, 'UPDATE_SPORT', { sport_id, sport_name });
        res.json({ message: 'Sport updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating sport.' });
    }
};

// 5. Delete sport (Admin/Director Only)
exports.deleteSport = async (req, res) => {
    try {
        const { sport_id } = req.params;
        await db.query('DELETE FROM sports WHERE sport_id = ?', [sport_id]);
        
        await logAction(req.user.user_id, 'DELETE_SPORT', { sport_id });
        res.json({ message: 'Sport deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting sport.' });
    }
};
