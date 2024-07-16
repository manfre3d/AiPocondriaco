//const { connect, disconnect } = require('../config/db');
const ipocondriaciModel = require('../models/ipocondriaci');

async function initializeIpocondriaci() {
    //await connect();
    try {
        await ipocondriaciModel.createIpocondriaciTable();
        console.log("Tabella Ipocondriaci creata con successo.");
    } catch (err) {
        console.error("Errore durante la creazione della tabella Ipocondriaci", err);
    } /*finally {
        await disconnect();
    }*/
}

async function addIpocondriaco(utente_id, data_di_nascita, altezza, peso, età, indirizzo, numero_telefono) {
    //await connect();
    try {
        const ipocondriaco = await ipocondriaciModel.insertIpocondriaco(utente_id, data_di_nascita, altezza, peso, età, indirizzo, numero_telefono);
        console.log("Ipocondriaco inserito con successo.");
        return ipocondriaco;
    } catch (err) {
        console.error("Errore durante l'inserimento dell'ipocondriaco", err);
    } /*finally {
        await disconnect();
    }*/
}

async function fetchIpocondriaci() {
    //await connect();
    try {
        const ipocondriaci = await ipocondriaciModel.getIpocondriaci();
        return ipocondriaci;
    } catch (err) {
        console.error("Errore durante il recupero degli ipocondriaci", err);
    } /*finally {
        await disconnect();
    }*/
}

module.exports = {
    initializeIpocondriaci,
    addIpocondriaco,
    fetchIpocondriaci,
};
