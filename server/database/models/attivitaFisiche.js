const { connect, disconnect } = require('../config/db');

async function createAttivitaFisicheTable() {
    const client = await connect();
    const query = `
        CREATE TABLE IF NOT EXISTS AttivitaFisiche (
            attivita_id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            descrizione TEXT
        );
    `;
    await client.query(query);
    await disconnect(client);
}

async function insertAttivitaFisica(nome, descrizione) {
    const client = await connect();
    const query = `
        INSERT INTO AttivitaFisiche (nome, descrizione)
        VALUES ($1, $2);
    `;
    await client.query(query, [nome, descrizione]);
    await disconnect(client);
}

async function getAttivitaFisiche() {
    const client = await connect();
    const res = await client.query('SELECT * FROM AttivitaFisiche;');
    await disconnect(client);
    return res.rows;
}

module.exports = {
    createAttivitaFisicheTable,
    insertAttivitaFisica,
    getAttivitaFisiche,
};