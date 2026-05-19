const express = require('express');
const router = express.Router();
const uc = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// ── Admin: full user management ───────────────────────────────────────────────
router.get('/', protect, adminOnly, uc.getAllUsers);
router.post('/', protect, adminOnly, uc.createUser);
router.delete('/:user_id', protect, adminOnly, uc.deleteUser);
router.get('/audit-logs', protect, uc.getAuditLogs);


// ── Role-specific list endpoints ──────────────────────────────────────────────
router.get('/my-players', protect, uc.getMyPlayers);
router.get('/my-captains', protect, uc.getMyCaptains);
router.get('/all-coaches', protect, uc.getAllCoaches);
router.get('/all-captains', protect, uc.getAllCaptains);
router.get('/all-players', protect, uc.getAllPlayers);

// ── Dropdown lists ────────────────────────────────────────────────────────────
router.get('/list/directors', protect, uc.getDirectorList);
router.get('/list/managers', protect, uc.getManagerList);
router.get('/list/coaches', protect, uc.getCoachList);
router.get('/list/captains', protect, uc.getCaptainList);

module.exports = router;
