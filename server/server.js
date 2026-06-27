const express = require("express");
const cors = require('cors');
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(logger);
app.use(express.json());
app.use(cors());

// Export Gemini client when API key is present, null otherwise (demo mode)
if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not set — running in demo mode with scripted responses.");
    module.exports = null;
} else {
    module.exports = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}
//basic route
app.get("/", async (req, res) => {

    try {
        return res.status(200).json({ message: "server working" });

    } catch (error) {
        console.log(error);
    }

});

//-------------------------------------------------------
//server port 
//todo add .env Port variable
const port = process.env.PORT || 3000;

//routes sectiong to differentiate api calls
const promptsRouter =require("./routes/prompts.js");

const utentiRouter =require("./routes/utenti.js");

const patologieRouter =require("./routes/patologie.js");

const attivitaFisiche =require("./routes/attivitaFisiche.js");

const authRouter = require("./routes/auth.js");

//-------------------------------------------------------
/*  route use
    necessary to use the operations in the specific routes
*/
app.use("/prompts", promptsRouter)

app.use("/utenti", utentiRouter)

app.use("/patologie", patologieRouter)

app.use("/attivitaFisiche", attivitaFisiche)

app.use("/auth", authRouter)

//-------------------------------------------------------
/*basic logger that shows the url being called on the server*/
function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

//-------------------------------------------------------
// server listening start
app.listen(port, () => {
    // console.log(openai)
    const mode = process.env.GEMINI_API_KEY ? "live" : "demo";
    console.log(`Server listening on port ${port} [${mode} mode]`);
});
