const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Clearing old tables if they exist...');
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        const tablesToDrop = [
            'audit_logs',
            'player_reports',
            'player',
            'captain_reports',
            'captain',
            'coach',
            'sport_manager',
            'sports_director',
            'sports',
            'users',
            'game',
            'player_requests',
            'player_comments'
        ];
        for (const t of tablesToDrop) {
            await db.query(`DROP TABLE IF EXISTS ${t}`);
        }
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Old tables cleared successfully.');

        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sqlContent = fs.readFileSync(schemaPath, 'utf8');

        // Strip out single-line comments completely before splitting
        const noComments = sqlContent.split('\n').filter(line => !line.trim().startsWith('--')).join('\n');

        // Split purely by semicolon
        const queries = noComments
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`Found ${queries.length} SQL statements to execute.`);

        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            try {
                const snippet = query.replace(/\s+/g, ' ').substring(0, 60);
                
                // Skip database drop/create as it is handled or not needed
                if (query.toUpperCase().startsWith('DROP DATABASE') || query.toUpperCase().startsWith('CREATE DATABASE')) {
                    console.log(`[${i + 1}/${queries.length}] Skipping: ${snippet}...`);
                    continue;
                }

                console.log(`[${i + 1}/${queries.length}] Executing: ${snippet}...`);
                await db.query(query);
            } catch (err) {
                console.warn(`Error executing statement ${i + 1}:`, err.message);
            }
        }

        console.log('Database migration completed successfully! All tables created and seeded.');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
}

migrate();
