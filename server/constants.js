// constants.js
// const OPENAI_MODEL_TEXT_GENERATION = "gpt-3.5-turbo";
const OPENAI_MODEL_TEXT_GENERATION = "gpt-4o";
const OPENAI_MODEL_IMAGE_GENERATION = "dall-e-3";

const INITIAL_MESSAGE = {
  role: "user",
  content: `Questo è l'inizio della conversazione. 
    Tu sei Ai pocondriaco un assistente virtuale per la salute e il benessere della persona.
    Ogni volta che ti chiedono chi sei dovrai rispondere che sei l'assistente dell'applicazione
    AI Pocondria. 
    Dai sempre informazioni sui dati aggiornati alla tua ultima versione. 
    Ogni risposta che dai deve essere considerata tenendo a mente che verrà inserita all'interno di un componente
    html <div> nell'innerHTML, quindi formatta sempre la risposta che fornisci in HTML.    
    La risposta deve essere correttamente formattata in caso di liste, grassetto e interruzioni di paragrafo.
    Prenditi cura di mandare a capo il paragrafo che viene generato per rendere il testo più leggibile.
    Non menzionare il gdpr e la protezione dei dati e cerca sempre di fornire una risposta in tema salute 
    e tema medico.
    Nel caso in cui ti vengono richieste informazioni esterne, cerca sempre di fornire una risposta in base ai dati
    in tuo possesso, inserendo un avvertimento e indicando che per informazioni più precise l'utente
    si deve rivolgere a un medico. 
    Cerca su google riferimenti e possibili risposte e dove possibile includi link di riferimento.
    Considera sempre che il testo che generi verrà inserito all'interno di un innerHTML 
    quindi deve essere SEMPRE formattato in html.
    `,
};

const HEALTH_SCORE_MESSAGE = `based on the current conversation give me a json object with a score 
            from 0 to 100 of my health conditions provide the response in a json format similar to
            this structure {healthScore:value}.
            Always try to give a score even with limited information. 
            Always provide in the response just the object without any explanation without any writing
            or punctuation before the object and without an reference to a json at the start {}.`;

const USER_DESCRIPTION_MESSAGE = `
            Basandoti sulla conversazione attuale, prendi i messaggi dal ruolo "user" e crea un oggetto con struttura chiave-valore che contenga informazioni sulle condizioni di salute e del corpo, nome, cognome ed email dell'utente se forniti. 
            Non includere nell'oggetto propietà, link o valori non presenti o menzionati nella conversazione 
            dall'user. 
            Assicurati che le informazioni abbiano nomi significativi in italiano come chiave dell'oggetto.
            Assicurati anche che i valori associati alle chiavi siano stringhe brevi e concise. 
            Esempio: statoPeso: "sovrappeso". 
            La tua risposta deve essere generata fornendo solo l'oggetto sotto forma di stringa. 
            es: {Altezza: "1,80m", AttivitaFisica: "Non pratico sport da almeno 1 anno", BMI: 23.15, Età: 28, Nome: "Manfredi", Peso: "75kg", Sesso: "Maschio"}.
            Ricorda di tradurre tutto in italiano e fornire solo ed esclusivamente un oggetto (in lingua italiano) che non contenga oggetti annidati o array.  
            Assicurati che le chiavi dell'oggetto non contengano trattini e che i valori nell'oggetto non contengano virgole.
            Non includere propietà con valori true, come di seguito:
            dietaEquilibrata:true o Sovrappeso: true.
            Non includere propietà con valori "https://www.who.int/news-room/fact-sheets/detail/physical-activity", come di seguito:
            linkUlterioriInformazioni: "https://www.who.int/news-room/fact-sheets/detail/physical-activity"
            Non includere propietà senza valori, come di seguito:
            circonferenzaVita: null;
            Non includere propietà con oggetti come valore:
            es.
            {"alimentazione": {"mangia_equilibrato": "Assicurati"}}
            Non includere propietà "consigli" nell'oggetto.
            Non creare nelle chiavi dell'oggetto principale oggetti annidati o array come valori.
            Considera che la risposta che generi verrà inserita nel metodo JSON.parse().
            Chiave e valore devono essere in italiano.
            Tieni in considerazione tutto quello che è stato scritto in precedenza.
            `;

const IMAGE_GENERATION_PROMPT = `based on the current conversation give me a paragraph in italian describing a
    picture with the user physical description and write it in a somewhat funny way.
            Make sure that the description you give is similar to this one and short
            "A photo of an individual having fun".
            if you see specific data displayed numerically make the information more easy to understand in words without including specific sizes or numbers
            but giving a generic description. 
            Consider accurately the size and physical features described by the user, so that it is clear if the user is fat or skinny or normal weight.
            Focus on a specific, visual rappresentation of a person.
            Describe actions and scenarios rather than abstract concepts.
            Avoid ambiguous language that could be interpreted as including text.
            Make sure the paragrap is in Italian.
            if the user is very tall, chose between saying that he is as tall as a skyscraper, as tall as a sunflower. 
            `;

module.exports = {
  OPENAI_MODEL_TEXT_GENERATION,
  OPENAI_MODEL_IMAGE_GENERATION,
  IMAGE_GENERATION_PROMPT,
  INITIAL_MESSAGE,
  HEALTH_SCORE_MESSAGE,
  USER_DESCRIPTION_MESSAGE,
};
