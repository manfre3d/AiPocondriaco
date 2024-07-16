//const { connect, disconnect } = require('../config/db');
const patologieModel = require('../models/patologie');

async function initializePatologie() {
    //await connect();
    try {
        await patologieModel.createPatologieTable();
        const patologie = [
            { nome: 'Ipertensione', descrizione: 'Pressione del sangue alta' },
            { nome: 'Diabete', descrizione: 'Livelli di zucchero nel sangue elevati' },
            { nome: 'Asma', descrizione: 'Infiammazione cronica delle vie aeree' },
            { nome: 'Cardiopatia', descrizione: 'Malattia del cuore' },
            { nome: 'Artrite', descrizione: 'Infiammazione delle articolazioni' },
            { nome: 'Depressione', descrizione: 'Disturbo dell\'umore' },
            { nome: 'Ansia', descrizione: 'Disturbo d\'ansia generalizzata' },
            { nome: 'Obesità', descrizione: 'Eccessivo accumulo di grasso corporeo' },
            { nome: 'Emicrania', descrizione: 'Mal di testa ricorrente' },
            { nome: 'Allergie', descrizione: 'Reazioni immunitarie avverse' }
            // altre patologie...
        ];
        for (const patologia of patologie) {
            await patologieModel.insertPatologia(patologia.nome, patologia.descrizione);
        }
        console.log("Patologie inserite con successo.");
    } catch (err) {
        console.error("Errore durante l'inserimento delle patologie", err);
    } /*finally {
        await disconnect();
    }*/
}

async function fetchPatologie() {
    //await connect();
    try {
        const patologie = await patologieModel.getPatologie();
        return patologie;
    } catch (err) {
        console.error("Errore durante il recupero delle patologie", err);
    } /*finally {
        await disconnect();
    }*/
}

module.exports = {
    initializePatologie,
    fetchPatologie,
};
