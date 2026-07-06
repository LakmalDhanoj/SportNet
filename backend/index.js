const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const sportRoutes = require('./routes/sportRoutes');
const playerRequestRoutes = require('./routes/playerRequestRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/player-requests', playerRequestRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('SportNet Backend is Running ✅');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});