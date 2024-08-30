// constants.js
const OPENAI_MODEL_TEXT_GENERATION = "gpt-3.5-turbo";
const OPENAI_MODEL_IMAGE_GENERATION = "dall-e-3";
const IMAGE_GENERATION_PROMPT = `based on the current conversation give me a paragraph in italian describing a picture
with the user physical description and write it in a somewhat funny way.
Make sure that the description you give is similar to this one and short
"A photo of an individual having fun" if you see specific data displayed
numerically make the information more easy to understand in words without including specific sizes or numbers
but giving a generic description. Consider accurately the size that are described and physical
appearance that is described by the user`;

const INITIAL_MESSAGE = {
  role: "user",
  content: `Questo è l'inizio della conversazione. 
    Tu sei Ai pocondriaco un assistente virtuale per la salute e il benessere della persona.
    Ogni volta che ti chiedono chi sei dovrai rispondere che sei l'assistente dell'applicazione
    AI Pocondria. 
    Dai sempre informazioni sui dati aggiornati alla tua ultima versione. 
    Ogni risposta che dai deve essere considerata tenendo a mente che verrà inserita in
    un componente html <p>. Quindi deve essere correttamente formattata in caso di liste e interruzioni di paragrafo.
    Prenditi cura di mandare a capo il paragrafo che viene generato per rendere il testo più leggibil.
    Non menzionare il gdpr e la protezione dei dati e cerca sempre di fornire una risposta in tema salute e tema medico.
    Nel caso in cui ti vengono richieste informazioni esterne, cerca sempre di fornire una risposta in base ai dati
    in tuo possesso, inserendo un avvertimento e indicando che per informazioni più precise l'utente
    si deve rivolgere a un medico. cerca su google riferimenti e possibili risposte.
    Dove possibile inserisci link o altri riferimenti ai soggetti.`,
};

const HEALTH_SCORE_MESSAGE = `based on the current conversation give me a json object with a score 
            from 0 to 100 of my health conditions provide the response in a json format similar to
            this structure {healthScore:value}.
            Always try to give a score even with limited information. 
            If you don't have enough info just give the initial score of 100.`;

const USER_DESCRIPTION_MESSAGE = `based on the current conversation give me an 
            object with structure key value with my health and body 
            conditions, name, surname and email if given. Do not include a value in the object
            if it's not present in the conversation.
            Make sure that the information have a significant 
            name in the key of the object and a short concise value in the 
            respective value associated to the key that you are going to provide. 
            Everything has to be returned in a json object of a similar form like 
            {Altezza: "1,80m",AttivitaFisica:"Non pratico sport da almeno 1 anno",BMI:23.15,Età:28,Nome:"Manfredi",Peso:"75kg",Sesso:"Maschio"} 
            translate everything in italian and be sure that the object doesn't have
            nested objects. Provide the object in string format on one line without line breaks.
            Make sure that the keys of the object don't contain special character or eiphens and that the values
            in the object don't contain','`;

module.exports = {
  OPENAI_MODEL_TEXT_GENERATION,
  OPENAI_MODEL_IMAGE_GENERATION,
  IMAGE_GENERATION_PROMPT,
  INITIAL_MESSAGE,
  HEALTH_SCORE_MESSAGE,
  USER_DESCRIPTION_MESSAGE,
};
