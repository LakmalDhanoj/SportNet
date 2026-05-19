const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('SportNet Backend is Running ✅');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});