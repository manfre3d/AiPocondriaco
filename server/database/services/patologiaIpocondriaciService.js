//const { connect, disconnect } = require('../config/db');
const patologiaIpocondriaciModel = require('../models/patologiaIpocondriaci');

async function initializePatologiaIpocondriaci() {
    //await connect();
    try {
        await patologiaIpocondriaciModel.createPatologiaIpocondriaciTable();
        console.log("Tabella PatologiaIpocondriaci creata con successo.");
    } catch (err) {
        console.error("Errore durante la creazione della tabella PatologiaIpocondriaci", err);
    } /*finally {
        await disconnect();
    }*/
}

async function addPatologiaIpocondriaco(ipocondriaco_id, patologia_id, data_diagnosi) {
    //await connect();
    try {
        const patologiaIpocondriaco = await patologiaIpocondriaciModel.insertPatologiaIpocondriaci(ipocondriaco_id, patologia_id, data_diagnosi);
        console.log("Patologia per Ipocondriaco inserita con successo.");
        return patologiaIpocondriaco;
    } catch (err) {
        console.error("Errore durante l'inserimento della patologia per l'ipocondriaco", err);
    } /*finally {
        await disconnect();
    }*/
}

async function fetchPatologiaIpocondriaci() {
    //await connect();
    try {
        const patologiaIpocondriaci = await patologiaIpocondriaciModel.getPatologiaIpocondriaci();
        return patologiaIpocondriaci;
    } catch (err) {
        console.error("Errore durante il recupero delle patologie degli ipocondriaci", err);
    } /*finally {
        await disconnect();
    }*/
}

module.exports = {
    initializePatologiaIpocondriaci,
    addPatologiaIpocondriaco,
    fetchPatologiaIpocondriaci,
};
