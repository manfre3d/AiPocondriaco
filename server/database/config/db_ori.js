// npm install pg

const  Client = require('pg').Client;

// Configurazione della connessione al database PostgreSQL
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Ktxdkft5!',
    port: 5432,
});

async function connect() {
    try {
        await client.connect();
        console.log("Connesso correttamente al server PostgreSQL");
    } catch (err) {
        console.error("Errore di connessione", err);
    }
}

async function disconnect() {
    try {
        await client.end();
        console.log("Connessione al server PostgreSQL chiusa");
    } catch (err) {
        console.error("Errore nella chiusura della connessione", err);
    }
}

module.exports = {
    client,
    connect,
    disconnect
};
