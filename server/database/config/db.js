const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password_del_tuo_utente_db_postgres',
    port: 5432,
});

async function connect() {
    try {
        const client = await pool.connect();
        return client;
        

    } catch (error) {
        // Suppress connection errors — DB is not required for demo mode
    }
}

async function disconnect(client) {
    try {
        await client.release();
    } catch (error) {
        // ignore
    }
}

connect();

module.exports = {
    connect,
    disconnect,
};
