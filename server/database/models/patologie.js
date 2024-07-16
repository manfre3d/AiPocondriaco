const { connect, disconnect } = require('../config/db');

async function createPatologieTable() {
    const client = await connect();
    const query = `
        CREATE TABLE IF NOT EXISTS Patologie (
            patologia_id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            descrizione TEXT
        );
    `;
    await client.query(query);
    await disconnect(client);
}

async function insertPatologia(nome, descrizione) {
    const client = await connect();
    const query = `
        INSERT INTO Patologie (nome, descrizione)
        VALUES ($1, $2);
    `;
    await client.query(query, [nome, descrizione]);
    await disconnect(client);
}

async function getPatologie() {
    const client = await connect();
    const res = await client.query('SELECT * FROM Patologie;');
    await disconnect(client);
    return res.rows;
}

module.exports = {
    createPatologieTable,
    insertPatologia,
    getPatologie,
};