const express = require("express");
require("dotenv").config();
const { OpenAI } = require("openai");
const app = express()
// import OpenAI from "openai";


app.use(logger);
app.use(express.json());


//check if a .env file is properly configured and a apikey is correctly configured
if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set. Check your .env file.");
    process.exit(1); // Exit the application if the API key is not set
}

//set openai class configuring the api key in the class 
const openaiApiConfig = {
    apiKey: process.env.OPENAI_API_KEY
}
// exports the class to be used externally
module.exports = new OpenAI(openaiApiConfig);
//basic route test
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

//-------------------------------------------------------
/*  route use
    necessary to use the operations in the specific routes
*/ 
app.use("/prompts", promptsRouter)


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
    console.log(`Server listening on port ${port} ${process.env.OPENAI_API_KEY}`)
});
