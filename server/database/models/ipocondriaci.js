const { connect, disconnect } = require('../config/db');

async function createIpocondriaciTable() {
    const client = await connect();
    const query = `
        CREATE TABLE IF NOT EXISTS Ipocondriaci (
            id SERIAL PRIMARY KEY,
            utente_id INT UNIQUE REFERENCES Utenti(id),
            data_di_nascita DATE NOT NULL,
            altezza NUMERIC NOT NULL,
            peso NUMERIC NOT NULL,
            età INT NOT NULL,
            indirizzo VARCHAR(255) NOT NULL,
            numero_telefono VARCHAR(15) NOT NULL,
            data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await client.query(query);
    await disconnect(client);
}

async function insertIpocondriaco(utente_id, data_di_nascita, altezza, peso, età, indirizzo, numero_telefono) {
    const client = await connect();
    const query = `
        INSERT INTO Ipocondriaci (utente_id, data_di_nascita, altezza, peso, età, indirizzo, numero_telefono)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const res = await client.query(query, [utente_id, data_di_nascita, altezza, peso, età, indirizzo, numero_telefono]);
    await disconnect(client);
    return res.rows[0];
}

async function getIpocondriaci() {
    const client = await connect();
    const res = await client.query('SELECT * FROM Ipocondriaci;');
    await disconnect(client);
    return res.rows;
}

module.exports = {
    createIpocondriaciTable,
    insertIpocondriaco,
    getIpocondriaci,
};
