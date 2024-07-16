const { connect, disconnect } = require('../config/db');

async function createUtentiTable() {
    const client = await connect();
    const query = `
        CREATE TABLE IF NOT EXISTS Utenti (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            cognome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await client.query(query);
    await disconnect(client);
}

async function insertUtente(nome, cognome, email, password) {
    const client = await connect();
    const query = `
        INSERT INTO Utenti (nome, cognome, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const res = await client.query(query, [nome, cognome, email, password]);
    await disconnect(client);
    return res.rows[0];
}

async function getUtenti() {
    const client = await connect();
    const res = await client.query('SELECT * FROM Utenti;');
    await disconnect(client);
    return res.rows;
}

module.exports = {
    createUtentiTable,
    insertUtente,
    getUtenti,
};
