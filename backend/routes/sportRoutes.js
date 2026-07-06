const express = require('express');
const router = express.Router();
const sc = require('../controllers/sportController');
const { protect, directorOnly } = require('../middleware/auth');

// Public endpoint for Landing Page live metrics panel
router.get('/public', sc.getPublicSports);

// Protected administrative CRUD operations
router.get('/', protect, directorOnly, sc.getAllSports);
router.post('/', protect, directorOnly, sc.createSport);
router.put('/:sport_id', protect, directorOnly, sc.updateSport);
router.delete('/:sport_id', protect, directorOnly, sc.deleteSport);

module.exports = router;
