const db = require('../config/db');

exports.submitPlayerRequest = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCaptainRequests = async (req, res) => {
    try { res.json({ requests: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.removePlayerRequest = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCoachRequests = async (req, res) => {
    try { res.json({ requests: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.reviewPlayerRequest = async (req, res) => {
    try { res.json({ message: 'stub: Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
