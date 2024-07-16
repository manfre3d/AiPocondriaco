const { connect, disconnect } = require('../config/db');

async function createPatologiaIpocondriaciTable() {
    const client = await connect();
    const query = `
        CREATE TABLE IF NOT EXISTS PatologiaIpocondriaci (
            id SERIAL PRIMARY KEY,
            ipocondriaco_id INT REFERENCES Ipocondriaci(id),
            patologia_id INT REFERENCES Patologie(patologia_id),
            data_diagnosi DATE NOT NULL
        );
    `;
    await client.query(query);
    await disconnect(client);
}

async function insertPatologiaIpocondriaci(ipocondriaco_id, patologia_id, data_diagnosi) {
    const client = await connect();
    const query = `
        INSERT INTO PatologiaIpocondriaci (ipocondriaco_id, patologia_id, data_diagnosi)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const res = await client.query(query, [ipocondriaco_id, patologia_id, data_diagnosi]);
    await disconnect(client);
    return res.rows[0];
}

async function getPatologiaIpocondriaci() {
    const client = await connect();
    const res = await client.query('SELECT * FROM PatologiaIpocondriaci;');
    await disconnect(client);
    return res.rows;
}

module.exports = {
    createPatologiaIpocondriaciTable,
    insertPatologiaIpocondriaci,
    getPatologiaIpocondriaci,
};
