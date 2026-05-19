const db = require('./config/db');

async function test() {
    try {
        console.log('Testing connection...');
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('Connection successful! Result:', rows[0].result);
        
        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        console.log('Users in database:', users[0].count);
        
        process.exit(0);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
}

test();
