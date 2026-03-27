const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({ 
    connectionString: "postgresql://postgres:joca1228@db:5432/milkshop_backend" 
});

async function run() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        await pool.query('UPDATE user_accounts SET password = $1 WHERE email = $2', [hash, 'admin@milkshop.local']);
        console.log('✅ SUCCESS: Password is now admin123');
    } catch (err) {
        console.error('❌ ERROR:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}
run();