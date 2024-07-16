//const { connect, disconnect } = require('../config/db');
const attivitaFisicheModel = require('../models/attivitaFisiche');

async function initializeAttivitaFisiche() {
    //await connect();
    try {
        await attivitaFisicheModel.createAttivitaFisicheTable();
        const attivitaFisiche = [
            { nome: 'Corsa', descrizione: 'Corsa leggera all\'aperto' },
            { nome: 'Nuoto', descrizione: 'Nuoto in piscina' },
            { nome: 'Ciclismo', descrizione: 'Bicicletta su strada' },
            { nome: 'Yoga', descrizione: 'Sessioni di yoga' },
            { nome: 'Sollevamento pesi', descrizione: 'Allenamento con i pesi' },
            { nome: 'Escursionismo', descrizione: 'Camminate in montagna' },
            { nome: 'Pilates', descrizione: 'Esercizi di pilates' },
            { nome: 'Danza', descrizione: 'Lezioni di danza' },
            { nome: 'Tennis', descrizione: 'Partite di tennis' },
            { nome: 'Basket', descrizione: 'Partite di basket' }
        ];
        for (const attivita of attivitaFisiche) {
            await attivitaFisicheModel.insertAttivitaFisica(attivita.nome, attivita.descrizione);
        }
        console.log("Attività fisiche inserite con successo.");
    } catch (err) {
        console.error("Errore durante l'inserimento delle attività fisiche", err);
    } /*finally {
        await disconnect();
    }*/
}

async function fetchAttivitaFisiche() {
    //await connect();
    try {
        const attivitaFisiche = await attivitaFisicheModel.getAttivitaFisiche();
        return attivitaFisiche;
    } catch (err) {
        console.error("Errore durante il recupero delle attività fisiche", err);
    } /*finally {
        await disconnect();
    }*/
}

module.exports = {
    initializeAttivitaFisiche,
    fetchAttivitaFisiche,
};
