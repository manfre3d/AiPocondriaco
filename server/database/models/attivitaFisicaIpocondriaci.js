const { connect, disconnect } = require('../config/db');

async function createAttivitaFisicaIpocondriaciTable() {
    const client = await connect();
    const query = `
        CREATE TABLE IF NOT EXISTS AttivitaFisicaIpocondriaci (
            attivita_ipocondriaco_id SERIAL PRIMARY KEY,
            ipocondriaco_id INT REFERENCES Ipocondriaci(id),
            attivita_id INT REFERENCES AttivitaFisiche(attivita_id),
            durata INT NOT NULL  -- durata in minuti
        );
    `;
    await client.query(query);
    await disconnect(client);
}

async function insertAttivitaFisicaIpocondriaci(paziente_id, attivita_id, durata) {
    const client = await connect();
    const query = `
        INSERT INTO AttivitaFisicaIpocondriaci (ipocondriaco_id, attivita_id, durata)
        VALUES ($1, $2, $3);
    `;
    await client.query(query, [paziente_id, attivita_id, durata]);
    await disconnect(client);
}

async function getAttivitaFisicaIpocondriaci() {
    const client = await connect();
    const res = await client.query('SELECT * FROM AttivitaFisicaIpocondriaci;');
    await disconnect(client);
    return res.rows;
}

module.exports = {
    createAttivitaFisicaIpocondriaciTable,
    insertAttivitaFisicaIpocondriaci,
    getAttivitaFisicaIpocondriaci,
};
