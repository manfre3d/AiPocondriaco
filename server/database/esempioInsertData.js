const utentiService = require('./services/utentiService');
const ipocondriaciService = require('./services/ipocondriaciService');
const patologieService = require('./services/patologieService');
const attivitaFisicheService = require('./services/attivitaFisicheService');
const attivitaFisicaUtentiService = require('./services/attivitaFisicaUtentiService');
const patologiaIpocondriaciService = require('./services/patologiaIpocondriaciService');

async function insertData() {
    try {
        await utentiService.initializeUtenti();
        const utente = await utentiService.addUtente('Mario', 'Rossi', 'mario.rossi@example.com', 'password123');
        console.log("Utenti:", await utentiService.fetchUtenti());

        await ipocondriaciService.initializeIpocondriaci();
        const ipocondriaco = await ipocondriaciService.addIpocondriaco(utente.id, '1980-01-01', 180, 75, 40, 'Via Roma 1, Milano', '1234567890');
        console.log("Ipocondriaci:", await ipocondriaciService.fetchIpocondriaci());

        await patologieService.initializePatologie();
        console.log("Patologie:", await patologieService.fetchPatologie());

        await attivitaFisicheService.initializeAttivitaFisiche();
        console.log("Attività Fisiche:", await attivitaFisicheService.fetchAttivitaFisiche());

        await attivitaFisicaUtentiService.initializeAttivitaFisicaIpocondriaci();
        await attivitaFisicaUtentiService.addAttivitaFisicaIpocondriaci(1, 1, 30); // Paziente_id 1, Attivita_id 1, Durata 30 minuti
        console.log("Attività Fisica Utenti:", await attivitaFisicaUtentiService.fetchAttivitaFisicaIpocondriaci());

        await patologiaIpocondriaciService.initializePatologiaIpocondriaci();
        await patologiaIpocondriaciService.addPatologiaIpocondriaco(ipocondriaco.id, 1, '2023-07-01');
        console.log("Patologia Ipocondriaci:", await patologiaIpocondriaciService.fetchPatologiaIpocondriaci());

    } catch (err) {
        console.error("Errore durante l'inserimento dei dati", err);
    } finally {
        process.exit();
    }
}

insertData();
