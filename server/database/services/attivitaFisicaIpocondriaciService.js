//const { connect, disconnect } = require('../config/db');
const attivitaFisicaIpocondriaciModel = require('../models/attivitaFisicaIpocondriaci');

async function initializeAttivitaFisicaIpocondriaci() {
    //await connect();
    try {
        await attivitaFisicaIpocondriaciModel.createAttivitaFisicaIpocondriaciTable();
        console.log("Tabella AttivitaFisicaIpocondriaci creata con successo.");
    } catch (err) {
        console.error("Errore durante la creazione della tabella AttivitaFisicaIpocondriaci", err);
    } /*finally {
        await disconnect();
    }*/
}

async function addAttivitaFisicaIpocondriaci(paziente_id, attivita_id, durata) {
    //await connect();
    try {
        await attivitaFisicaIpocondriaciModel.insertAttivitaFisicaIpocondriaci(paziente_id, attivita_id, durata);
        console.log("Attività fisica Ipocondriaci inserita con successo.");
    } catch (err) {
        console.error("Errore durante l'inserimento dell'attività fisica Ipocondriaci", err);
    } /*finally {
        await disconnect();
    }*/
}

async function fetchAttivitaFisicaIpocondriaci() {
    //await connect();
    try {
        const attivitaFisicaIpocondriaci = await attivitaFisicaIpocondriaciModel.getAttivitaFisicaIpocondriaci();
        return attivitaFisicaIpocondriaci;
    } catch (err) {
        console.error("Errore durante il recupero delle attività fisiche Ipocondriaci", err);
    } /*finally {
        await disconnect();
    }*/
}

module.exports = {
    initializeAttivitaFisicaIpocondriaci,
    addAttivitaFisicaIpocondriaci,
    fetchAttivitaFisicaIpocondriaci,
};
