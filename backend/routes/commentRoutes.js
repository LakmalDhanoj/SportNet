const express = require('express');
const router = express.Router();
const cc = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, cc.addComment);
router.get('/', protect, cc.getComments);
router.put('/:comment_id', protect, cc.editComment);
router.delete('/:comment_id', protect, cc.deleteComment);

// Coach endpoints
router.put('/:comment_id/reply', protect, cc.replyComment);
router.put('/:comment_id/resolve', protect, cc.resolveComment);

module.exports = router;
