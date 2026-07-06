const db = require('../config/db');

exports.addComment = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getComments = async (req, res) => {
    try { res.json({ comments: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.editComment = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteComment = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.replyComment = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.resolveComment = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
