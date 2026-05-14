const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Backend Server is Running! \nThis is SportNet.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});