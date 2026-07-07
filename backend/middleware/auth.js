const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
        token = token.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sportnet_secret_key');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const directorOnly = (req, res, next) => {
    if (req.user && req.user.role === 'director') {
        next();
    } else {
        res.status(403).json({ message: 'Director access required' });
    }
};

const managerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        res.status(403).json({ message: 'Manager access required' });
    }
};

const coachOnly = (req, res, next) => {
    if (req.user && req.user.role === 'coach') {
        next();
    } else {
        res.status(403).json({ message: 'Coach access required' });
    }
};

const captainOnly = (req, res, next) => {
    if (req.user && req.user.role === 'captain') {
        next();
    } else {
        res.status(403).json({ message: 'Captain access required' });
    }
};

module.exports = { protect, directorOnly, managerOnly, coachOnly, captainOnly };
