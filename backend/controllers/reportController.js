const db = require('../config/db');

exports.submitPlayerReports = async (req, res) => {
    try { res.json({ message: 'submitPlayerReports: to be implemented by Member 5' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCaptainSquadReports = async (req, res) => {
    try { res.json({ reports: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCaptainSubmissionStatus = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getPlayerReportsForCoach = async (req, res) => {
    try { res.json({ reports: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.approvePlayerReport = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.bulkApproveByCaption = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getMyCaptains = async (req, res) => {
    try { res.json({ captains: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.submitCaptainReport = async (req, res) => {
    try { res.json({ message: 'stub' }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getDirectorOverview = async (req, res) => {
    try { res.json({ overview: {} }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getManagerOverview = async (req, res) => {
    try { res.json({ overview: {} }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

exports.getPlayerReports = async (req, res) => {
    try { res.json({ reports: [] }); } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
