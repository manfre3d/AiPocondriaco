-- Creazione del database
CREATE DATABASE AIPocondriaco;

-- Selezione del database
USE AIPocondriaco;

-- Creazione della tabella Utenti
CREATE TABLE Utenti (
    utente_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella Ipocondriaco
CREATE TABLE Ipocondriaco (
    ipocondriaco_id INT AUTO_INCREMENT PRIMARY KEY,
    utente_id INT UNIQUE,
    data_di_nascita DATE,
    altezza DECIMAL, 
    peso DECIMAL,
    sesso CHAR(1),
    età INTEGER,
    indirizzo VARCHAR(255),
    numero_telefono VARCHAR(20),
    data_registrazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utente_id) REFERENCES Utenti(utente_id)
);