//const { connect, disconnect } = require('../config/db');
const utentiModel = require('../models/utenti');

async function initializeUtenti() {
    //await connect();
    try {
        await utentiModel.createUtentiTable();
        console.log("Tabella Utenti creata con successo.");
    } catch (err) {
        console.error("Errore durante la creazione della tabella Utenti", err);
    } /*finally {
        await disconnect();
    }*/
}

async function addUtente(nome, cognome, email, password) {
    //await connect();
    try {
        const utente = await utentiModel.insertUtente(nome, cognome, email, password);
        console.log("Utente inserito con successo.");
        return utente;
    } catch (err) {
        console.error("Errore durante l'inserimento dell'utente", err);
    } /*finally {
        await disconnect();
    }*/
}

async function fetchUtenti() {
    //await connect();
    try { 
        const utenti = await utentiModel.getUtenti();
        return utenti;
    } catch (err) {
        console.error("Errore durante il recupero degli utenti", err);
    } /*finally {
        await disconnect();
    }*/
}

module.exports = {
    initializeUtenti,
    addUtente,
    fetchUtenti,
};
