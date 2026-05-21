const db = require('./config/db');

async function run() {
    try {
        console.log('Adding approval_status column...');
        await db.query(`ALTER TABLE player ADD COLUMN approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending' AFTER managed_by_captain_id`);
        console.log('Column added.');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error(e);
        }
    }
    
    try {
        console.log('Updating existing players to Approved...');
        await db.query(`UPDATE player SET approval_status = 'Approved'`);
        console.log('Players updated.');
    } catch (e) {
        console.error(e);
    }
    
    process.exit();
}
run();
