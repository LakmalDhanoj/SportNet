const mysql = require('mysql2/promise');

async function main() {
    try {
        console.log("Connecting to MariaDB/MySQL...");
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });
        console.log("Connected successfully! Creating database 'sportnet' if not exists...");
        await connection.query('CREATE DATABASE IF NOT EXISTS sportnet');
        console.log("Database 'sportnet' checked/created successfully.");
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error("Error occurred:", err);
        process.exit(1);
    }
}

main();
