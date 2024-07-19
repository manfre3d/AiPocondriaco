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
        console.error("Errore di connessione:", error);
    }
}

async function disconnect(client) {
    try {
        await client.release();
    } catch (error) {
        console.error("Errore durante la disconnessione:", error);
    }
}

connect();

module.exports = {
    connect,
    disconnect,
};
