// npm install pg

const  Client = require('pg').Client;

// Configurazione della connessione al database PostgreSQL
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Ktxdkft5!',
    port: 5432,
});

async function main() {
    try {
        // Connessione al client PostgreSQL
        await client.connect();
        console.log("Connesso correttamente al server PostgreSQL");

        // Creazione della tabella Utenti
        await client.query(`
            CREATE TABLE IF NOT EXISTS Utenti (
                utente_id SERIAL PRIMARY KEY,
                nome VARCHAR(50) NOT NULL,
                cognome VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabella Utenti creata o già esistente.");

        // Creazione della tabella Ipocondriaci
        await client.query(`
            CREATE TABLE Ipocondriaci (
                ipocondriaco_id INT PRIMARY KEY,
                utente_id INT UNIQUE,
                data_di_nascita DATE,
                altezza DECIMAL, 
                peso DECIMAL,
                sesso CHAR(1),
                età INTEGER,
                indirizzo VARCHAR(255),
                numero_telefono VARCHAR(20),
                data_registrazione DATE,
                FOREIGN KEY (utente_id) REFERENCES Utenti(utente_id)
            );
        `);
        console.log("Tabella Ipocondriaci creata o già esistente.");

        // Creazione della tabella Patologie
        await client.query(`
            CREATE TABLE IF NOT EXISTS Patologie (
                idPatologia SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                descrizione TEXT
            );
        `);
        console.log("Tabella Patologie creata o già esistente.");

        // Inserimento delle patologie
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
        ];

        for (const patologia of patologie) {
            await client.query(`
                INSERT INTO Patologie (nome, descrizione)
                VALUES ($1, $2);
            `, [patologia.nome, patologia.descrizione]);
        }
        console.log("Patologie inserite con successo.");

        // Recupero e stampa delle patologie inserite
        const resPatologie = await client.query('SELECT * FROM Patologie;');
        console.log("Patologie:");
        console.log(resPatologie.rows);

        // Creazione della tabella PatologiaUtenti
        await client.query(`
            CREATE TABLE IF NOT EXISTS PatologiaUtenti (
                idPatologiaUtente SERIAL PRIMARY KEY,
                idIpocondriaco INT REFERENCES Ipocondriaci(ipocondriaco_id),
                idPatologia INT REFERENCES Patologie(idPatologia),
                data_diagnosi DATE
            );
        `);
        console.log("Tabella PatologiaUtenti creata o già esistente.");

        // Creazione della tabella AttivitàFisiche se non esiste
        await client.query(`
            CREATE TABLE IF NOT EXISTS AttivitàFisiche (
                attivita_id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                descrizione TEXT
            );
        `);
        console.log("Tabella AttivitàFisiche creata o già esistente.");

        // Inserimento delle attività fisiche
        const attivitaFisiche = [
            { nome: 'Corsa', descrizione: 'Attività di corsa leggera o intensa' },
            { nome: 'Nuoto', descrizione: 'Attività di nuoto in piscina o in mare' },
            { nome: 'Ciclismo', descrizione: 'Attività di ciclismo su strada o montagna' },
            { nome: 'Yoga', descrizione: 'Pratica di esercizi di respirazione e posture' },
            { nome: 'Sollevamento pesi', descrizione: 'Attività di sollevamento pesi in palestra' },
            { nome: 'Pilates', descrizione: 'Esercizi di pilates per la tonificazione muscolare' },
            { nome: 'Escursionismo', descrizione: 'Camminate in natura su percorsi predefiniti' },
            { nome: 'Danza', descrizione: 'Attività di ballo di vari tipi' },
            { nome: 'Aerobica', descrizione: 'Esercizi aerobici a ritmo di musica' },
            { nome: 'Tennis', descrizione: 'Partite di tennis in singolo o doppio' }
        ];

        for (const attivita of attivitaFisiche) {
            await client.query(`
                INSERT INTO AttivitàFisiche (nome, descrizione)
                VALUES ($1, $2);
            `, [attivita.nome, attivita.descrizione]);
        }
        console.log("Attività fisiche inserite con successo.");

        // Recupero e stampa delle attività fisiche inserite
        const resAttivitaFisiche = await client.query('SELECT * FROM AttivitàFisiche;');
        console.log("Attività fisiche:");
        console.log(resAttivitaFisiche.rows);

        // Creazione della tabella AttivitàFisicaPazienti se non esiste
        await client.query(`
            CREATE TABLE IF NOT EXISTS AttivitàFisicaPazienti (
                attivita_fisica_paziente_id SERIAL PRIMARY KEY,
                paziente_id INT REFERENCES Ipocondriaci(ipocondriaco_id),
                attivita_id INT REFERENCES AttivitàFisiche(attivita_id),
                durata INTERVAL
            );
        `);
        console.log("Tabella AttivitàFisicaPazienti creata o già esistente.");

    } catch (err) {
        console.error(err);
    } finally {
        // Chiudere la connessione al client
        await client.end();
        console.log("Connessione al server PostgreSQL chiusa");
    }
}

main().catch(console.error);

