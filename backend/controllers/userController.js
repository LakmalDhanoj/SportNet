const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { logAction } = require('../utils/logger');

// ─── ADMIN: Get all users ──────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Create a new user + role profile
exports.createUser = async (req, res) => {
    try {
        const { email, password, role, name, gender, age, qualification, managed_by_id } = req.body;
        if (!email || !password || !role || !name) {
            return res.status(400).json({ message: 'email, password, role, and name are required' });
        }

        if (role === 'player') {
            return res.status(403).json({ message: 'Players cannot be added by Directors directly. They must be added by a Coach.' });
        }

        // Validate and lookup relationships before creating the user row to prevent orphans
        let director_id = null;
        if (req.user && req.user.role === 'director') {
            const [dirRows] = await db.query('SELECT director_id FROM sports_director WHERE user_id = ?', [req.user.user_id]);
            if (dirRows.length > 0) {
                director_id = dirRows[0].director_id;
            }
        }

        if (role === 'manager') {
            if (req.user && req.user.role !== 'director') {
                return res.status(403).json({ message: 'Only directors can add managers' });
            }
        }

        let sport_id = req.body.sport_id || null;
        let finalSportCategory = req.body.sport_category || null;

        if (sport_id) {
            const [sportRows] = await db.query('SELECT sport_name FROM sports WHERE sport_id = ?', [sport_id]);
            if (sportRows.length > 0) {
                finalSportCategory = sportRows[0].sport_name;
            }
        } else if (finalSportCategory) {
            const [sportRows] = await db.query('SELECT sport_id FROM sports WHERE sport_name = ?', [finalSportCategory]);
            if (sportRows.length > 0) {
                sport_id = sportRows[0].sport_id;
            }
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, role]
        );
        const user_id = result.insertId;

        switch (role) {
            case 'director':
                await db.query('INSERT INTO sports_director (user_id, name, gender, age) VALUES (?, ?, ?, ?)', [user_id, name, gender, age]);
                break;
            case 'manager': {
                await db.query(
                    'INSERT INTO sport_manager (user_id, director_id, name, gender, age, qualification, sport_specialization) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [user_id, director_id, name, gender, age, qualification, finalSportCategory || null]
                );
                break;
            }
            case 'coach': {
                await db.query(
                    'INSERT INTO coach (user_id, manager_id, director_id, sport_id, name, gender, age, qualification, sport_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, director_id, sport_id, name, gender, age, qualification, finalSportCategory]
                );
                break;
            }
            case 'captain': {
                await db.query(
                    'INSERT INTO captain (user_id, managed_by_coach_id, director_id, sport_id, name, gender, age, sport_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [user_id, managed_by_id || null, director_id, sport_id, name, gender, age, finalSportCategory]
                );
                break;
            }
            default:
                break;
        }

        res.status(201).json({ message: 'User created successfully', user_id });
        await logAction(req.user.user_id, 'CREATE_USER', { target_email: email, role });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ADMIN: Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        await db.query('DELETE FROM users WHERE user_id = ?', [user_id]);
        await logAction(req.user.user_id, 'DELETE_USER', { target_user_id: user_id });
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ─── ROLE-SPECIFIC QUERIES ────────────────────────────────────────────────────

// Captain: get my assigned players
exports.getMyPlayers = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'captain') return res.status(403).json({ message: 'Forbidden' });

        const [captainRows] = await db.query('SELECT captain_id FROM captain WHERE user_id = ?', [user_id]);
        if (!captainRows.length) return res.status(404).json({ message: 'Captain profile not found' });

        const [players] = await db.query(
            `SELECT p.player_id, p.name, p.gender, p.age, p.skill_level, p.discipline, p.total_score, p.approval_status, p.position, p.sport_category, u.email 
             FROM player p
             JOIN users u ON p.user_id = u.user_id
             WHERE p.managed_by_captain_id = ?`,
            [captainRows[0].captain_id]
        );
        res.json({ players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Coach: get my captains
exports.getMyCaptains = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });

        const [captains] = await db.query(
            'SELECT captain_id, name, gender, age, leadership_rt, motivation_lvl, strategy_rt, total_score FROM captain WHERE managed_by_coach_id = ?',
            [coachRows[0].coach_id]
        );
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all coaches (for manager / director)
exports.getAllCoaches = async (req, res) => {
    try {
        const [coaches] = await db.query(
            `SELECT c.coach_id, c.name, c.gender, c.age, c.qualification,
                    c.attendance, c.discipline, c.evaluation_sc,
                    COUNT(cap.captain_id) AS captains_count
             FROM coach c
             LEFT JOIN captain cap ON cap.managed_by_coach_id = c.coach_id
             GROUP BY c.coach_id`
        );
        res.json({ coaches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all captains (for admin/director/manager)
exports.getAllCaptains = async (req, res) => {
    try {
        const [captains] = await db.query(
            `SELECT c.captain_id, c.name, c.gender, c.age, c.total_score,
                    co.name AS coach_name,
                    COUNT(p.player_id) AS player_count
             FROM captain c
             LEFT JOIN coach co ON co.coach_id = c.managed_by_coach_id
             LEFT JOIN player p ON p.managed_by_captain_id = c.captain_id
             GROUP BY c.captain_id`
        );
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all players (for admin/director)
exports.getAllPlayers = async (req, res) => {
    try {
        const [players] = await db.query(
            `SELECT p.player_id, p.name, p.gender, p.age, p.skill_level,
                    p.discipline, p.total_score, p.approval_status, p.position, p.sport_category,
                    c.name AS captain_name, u.email
             FROM player p
             JOIN users u ON p.user_id = u.user_id
             LEFT JOIN captain c ON c.captain_id = p.managed_by_captain_id`
        );
        res.json({ players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of coaches (dropdown for assigning captain)
exports.getCoachList = async (req, res) => {
    try {
        const [coaches] = await db.query('SELECT coach_id, name, sport_category FROM coach ORDER BY name');
        res.json({ coaches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of captains (dropdown for assigning player)
exports.getCaptainList = async (req, res) => {
    try {
        const [captains] = await db.query('SELECT captain_id, name, sport_category FROM captain ORDER BY name');
        res.json({ captains });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of directors (dropdown)
exports.getDirectorList = async (req, res) => {
    try {
        const [directors] = await db.query('SELECT director_id, name FROM sports_director ORDER BY name');
        res.json({ directors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get list of managers (dropdown)
exports.getManagerList = async (req, res) => {
    try {
        const [managers] = await db.query('SELECT manager_id, name, sport_specialization FROM sport_manager ORDER BY name');
        res.json({ managers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get system audit logs (Admin/Director)
exports.getAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.query(
            `SELECT l.*, u.email as user_email 
             FROM audit_logs l 
             LEFT JOIN users u ON u.user_id = l.user_id 
             ORDER BY l.created_at DESC LIMIT 100`
        );
        res.json({ logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ── New player registration/approval endpoints ────────────────────────────────

exports.getPendingPlayers = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });
        
        const [players] = await db.query(
            `SELECT p.player_id, p.name, p.gender, p.age, p.approval_status, p.position, p.sport_category, u.email 
             FROM player p
             JOIN users u ON p.user_id = u.user_id
             WHERE p.approval_status = 'Pending'`
        );
        res.json({ players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approvePlayer = async (req, res) => {
    try {
        const { role, user_id } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });
        
        const { id } = req.params;
        const { captain_id } = req.body;
        
        if (!captain_id) return res.status(400).json({ message: 'Captain ID is required to approve a player' });
        
        const [coachRows] = await db.query('SELECT coach_id, sport_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });
        const { coach_id, sport_id } = coachRows[0];

        await db.query(
            "UPDATE player SET approval_status = 'Approved', managed_by_captain_id = ?, coach_id = ?, sport_id = ? WHERE player_id = ?",
            [captain_id, coach_id, sport_id, id]
        );
        res.json({ message: 'Player approved and assigned to captain' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.coachAddPlayer = async (req, res) => {
    try {
        const { role, user_id } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden' });
        
        const { email, password, name, gender, age, captain_id } = req.body;
        if (!email || !password || !name || !captain_id) {
            return res.status(400).json({ message: 'Email, password, name, and captain ID are required' });
        }

        const lowerEmail = email.toLowerCase();
        if (!lowerEmail.endsWith('@stu.vau.ac.lk')) {
            return res.status(400).json({ message: 'Player email must end with @stu.vau.ac.lk.' });
        }

        const [coachRows] = await db.query('SELECT coach_id, sport_id, sport_category FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });
        const { coach_id, sport_id, sport_category } = coachRows[0];
        
        const passwordHash = await bcrypt.hash(password, 10);
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [userResult] = await connection.query(
                'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
                [email, passwordHash, 'player']
            );
            
            await connection.query(
                "INSERT INTO player (user_id, managed_by_captain_id, coach_id, sport_id, name, gender, age, sport_category, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Approved')",
                [userResult.insertId, captain_id, coach_id, sport_id, name, gender || null, age || null, sport_category]
            );
            await connection.commit();
            res.status(201).json({ message: 'Player added successfully' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyTeammates = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'player') return res.status(403).json({ message: 'Forbidden' });
        
        const [playerRows] = await db.query('SELECT managed_by_captain_id FROM player WHERE user_id = ?', [user_id]);
        if (!playerRows.length || !playerRows[0].managed_by_captain_id) {
            return res.json({ teammates: [] });
        }
        
        const [teammates] = await db.query(
            `SELECT p.player_id, p.name, p.age, p.gender, p.position, p.skill_level, u.email 
             FROM player p
             JOIN users u ON p.user_id = u.user_id
             WHERE p.managed_by_captain_id = ? AND p.user_id != ?`,
            [playerRows[0].managed_by_captain_id, user_id]
        );
        res.json({ teammates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadProfilePhoto = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        if (role !== 'player') {
            return res.status(403).json({ message: 'Only players can upload profile photos.' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const photoPath = `uploads/${req.file.filename}`;

        await db.query(
            'UPDATE player SET profile_photo = ? WHERE user_id = ?',
            [photoPath, user_id]
        );

        res.json({
            message: 'Profile photo updated successfully.',
            photo_photo: photoPath,
            photoUrl: `http://localhost:5000/${photoPath}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error uploading profile photo.' });
    }
};

exports.getDirectorTeamView = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'director') return res.status(403).json({ message: 'Forbidden' });

        const [sports] = await db.query('SELECT sport_id, sport_name, sport_type FROM sports');
        const [managers] = await db.query('SELECT manager_id, name, sport_specialization FROM sport_manager');
        const [coaches] = await db.query('SELECT coach_id, name, sport_id, manager_id FROM coach');
        const [captains] = await db.query('SELECT captain_id, name, sport_id, managed_by_coach_id FROM captain');
        const [players] = await db.query('SELECT player_id, name, sport_id, managed_by_captain_id, coach_id, approval_status FROM player');

        const teamTree = sports.map(s => {
            const sportManagers = managers.filter(m => m.sport_specialization === s.sport_name);
            const sportCoaches = coaches.filter(c => c.sport_id === s.sport_id);
            const sportCaptains = captains.filter(c => c.sport_id === s.sport_id);
            const sportPlayers = players.filter(p => p.sport_id === s.sport_id);

            return {
                sport_id: s.sport_id,
                sport_name: s.sport_name,
                sport_type: s.sport_type,
                managers: sportManagers,
                coaches: sportCoaches.map(c => {
                    const coachesCaptains = sportCaptains.filter(cap => cap.managed_by_coach_id === c.coach_id);
                    return {
                        ...c,
                        captains: coachesCaptains.map(cap => {
                            const captainsPlayers = sportPlayers.filter(p => p.managed_by_captain_id === cap.captain_id);
                            return {
                                ...cap,
                                players: captainsPlayers
                            };
                        })
                    };
                })
            };
        });

        res.json({ teamTree });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving team structure.' });
    }
};

exports.getManagerSportView = async (req, res) => {
    try {
        const { role, user_id } = req.user;
        if (role !== 'manager') return res.status(403).json({ message: 'Forbidden' });

        const [mgrRows] = await db.query('SELECT manager_id, sport_specialization FROM sport_manager WHERE user_id = ?', [user_id]);
        if (!mgrRows.length) return res.status(404).json({ message: 'Manager profile not found' });
        const { sport_specialization } = mgrRows[0];

        // Find sport info
        const [sportRows] = await db.query('SELECT sport_id, sport_name, sport_type FROM sports WHERE sport_name = ?', [sport_specialization]);
        if (!sportRows.length) return res.json({ message: 'No sport category matches manager specialization', coaches: [], captains: [], players: [] });
        const sport_id = sportRows[0].sport_id;

        const [coaches] = await db.query('SELECT coach_id, name, team_group, coaching_level FROM coach WHERE sport_id = ?', [sport_id]);
        const [captains] = await db.query('SELECT captain_id, name, position, total_score FROM captain WHERE sport_id = ?', [sport_id]);
        const [players] = await db.query('SELECT player_id, name, position, approval_status, skill_level FROM player WHERE sport_id = ?', [sport_id]);

        res.json({
            sport: sportRows[0],
            coaches,
            captains,
            players
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error retrieving manager sport view.' });
    }
};

exports.updatePlayerPerformance = async (req, res) => {
    try {
        const { role, user_id } = req.user;
        if (role !== 'coach') return res.status(403).json({ message: 'Forbidden: Only coaches can evaluate players.' });

        const { player_id } = req.params;
        const {
            performance_rating,
            skill_level,
            fitness_level,
            injury_status,
            availability,
            bonus_points,
            penalty_points,
            coach_eval_sc,
            achievements,
            remarks
        } = req.body;

        const [coachRows] = await db.query('SELECT coach_id FROM coach WHERE user_id = ?', [user_id]);
        if (!coachRows.length) return res.status(404).json({ message: 'Coach profile not found' });
        const coach_id = coachRows[0].coach_id;

        // Verify this player belongs to this coach
        const [playerRows] = await db.query('SELECT player_id FROM player WHERE player_id = ? AND coach_id = ?', [player_id, coach_id]);
        if (!playerRows.length) {
            return res.status(403).json({ message: 'Not authorized to evaluate this player.' });
        }

        const rating = Number(performance_rating) || 0;
        const evalScore = Number(coach_eval_sc) || 0;
        const bonus = Number(bonus_points) || 0;
        const penalty = Number(penalty_points) || 0;
        const total_score = Math.max(0, Math.min(100, (rating * 4) + (evalScore * 6) + bonus - penalty));

        await db.query(
            `UPDATE player SET 
                performance_rating = ?,
                skill_level = ?,
                fitness_level = ?,
                injury_status = ?,
                availability = ?,
                bonus_points = ?,
                penalty_points = ?,
                coach_eval_sc = ?,
                total_score = ?,
                achievements = ?,
                remarks = ?
             WHERE player_id = ?`,
            [
                rating,
                skill_level || 'Medium',
                fitness_level || 'Medium',
                injury_status || 'Fit',
                availability || 'Available',
                bonus,
                penalty,
                evalScore,
                total_score,
                achievements || '',
                remarks || '',
                player_id
            ]
        );

        res.json({ message: 'Player performance record updated successfully.', total_score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating player performance.' });
    }
};

