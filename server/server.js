const express = require("express");
require("dotenv").config();
const {OpenAI} = require("openai");
const app = express()


app.use(logger);
app.use(express.json());


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
app.get("/", async (req,res)=>{

    try {
        return res.status(200).json({message:"server working"});
        
    } catch (error) {
        console.log(error);     
    }

});

app.get("/fing-complexity", async (req, res) => {
    try {
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `
                const example = (arr) => {
                    arr.map((item)=>{
                        console.log(item2);
                    })
                }
            
                The time complexity of this function is
                ###
            `,
            max_tokens: 64,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0, 
            stop: ["\n"],
        });
        return res.status(200).json({
            success: true,
            data: response.data.choices[0].text
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response? error.response.data: "there was an issue on the server"
        })
    }
});


//server port
const port = process.env.PORT || 3000;

//routes
const promptsRouter = require("./routes/prompts.js");


//route use
app.use("/prompts",promptsRouter)

//basic logger
function logger(req,res, next){
    console.log(req.originalUrl);
    next();
}


app.listen(port,()=>{
    console.log(openai)
    console.log(`Server listening on port ${port} ${process.env.OPENAI_API_KEY}`)
});



