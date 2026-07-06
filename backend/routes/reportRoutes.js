const express = require('express');
const router = express.Router();
const rc = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

// ── Player Reports (Captain submits) ──────────────────────────────────────────
router.post('/player', protect, rc.submitPlayerReports);
router.get('/player/my-squad', protect, rc.getCaptainSquadReports);
router.get('/player/submission-status', protect, rc.getCaptainSubmissionStatus);
router.get('/player/for-coach', protect, rc.getPlayerReportsForCoach);
router.put('/player/:report_id/approve', protect, rc.approvePlayerReport);
router.put('/player/bulk-approve/:captain_id', protect, rc.bulkApproveByCaption);

// ── Captain Reports (Coach submits) ──────────────────────────────────────────
router.get('/captain/my-captains', protect, rc.getMyCaptains);
router.post('/captain', protect, rc.submitCaptainReport);

// ── Overview ──────────────────────────────────────────────────────────────────
router.get('/overview/director', protect, rc.getDirectorOverview);
router.get('/overview/manager', protect, rc.getManagerOverview);
// router.get('/overview/captain', protect, rc.getCaptainOverview);
// router.get('/overview/coach', protect, rc.getCoachOverview);

// ── Player self-view ──────────────────────────────────────────────────────────
router.get('/player/my-reports', protect, rc.getPlayerReports);

module.exports = router;
