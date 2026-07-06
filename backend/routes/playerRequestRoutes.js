const express = require('express');
const router = express.Router();
const prc = require('../controllers/playerRequestController');
const { protect } = require('../middleware/auth');

// Captain endpoints
router.post('/', protect, prc.submitPlayerRequest);
router.get('/captain', protect, prc.getCaptainRequests);
router.delete('/:request_id/remove', protect, prc.removePlayerRequest);

// Coach endpoints
router.get('/coach', protect, prc.getCoachRequests);
router.put('/:request_id/review', protect, prc.reviewPlayerRequest);

module.exports = router;
