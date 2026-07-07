const express = require('express');
const router = express.Router();
const uc = require('../controllers/userController');
const { protect, directorOnly } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, webp, gif) are allowed.'));
    }
});

router.post('/profile-photo', protect, upload.single('photo'), uc.uploadProfilePhoto);

// ── Admin: full user management ───────────────────────────────────────────────
router.get('/', protect, directorOnly, uc.getAllUsers);
router.post('/', protect, directorOnly, uc.createUser);
router.delete('/:user_id', protect, directorOnly, uc.deleteUser);
router.get('/audit-logs', protect, directorOnly, uc.getAuditLogs);
router.get('/director/team-tree', protect, directorOnly, uc.getDirectorTeamView);
router.get('/manager/my-sport', protect, uc.getManagerSportView);


// ── Role-specific list endpoints ──────────────────────────────────────────────
router.get('/my-players', protect, uc.getMyPlayers);
router.get('/my-captains', protect, uc.getMyCaptains);
router.get('/all-coaches', protect, uc.getAllCoaches);
router.get('/all-captains', protect, uc.getAllCaptains);
router.get('/all-players', protect, uc.getAllPlayers);

// ── New coach/player endpoints ────────────────────────────────────────────────
router.get('/coach/pending-players', protect, uc.getPendingPlayers);
router.put('/coach/approve-player/:id', protect, uc.approvePlayer);
router.post('/coach/add-player', protect, uc.coachAddPlayer);
router.put('/coach/player-performance/:player_id', protect, uc.updatePlayerPerformance);
router.get('/player/my-teammates', protect, uc.getMyTeammates);

// ── Dropdown lists ────────────────────────────────────────────────────────────
router.get('/list/directors', protect, uc.getDirectorList);
router.get('/list/managers', protect, uc.getManagerList);
router.get('/list/coaches', protect, uc.getCoachList);
router.get('/list/captains', protect, uc.getCaptainList);

module.exports = router;
