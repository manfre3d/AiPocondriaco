const express = require("express");
const router = express.Router()
const openai =require("../server.js");

let message = {
    "role":"user", 
    "content": `Questo è l'inizio della conversazione. 
    Tu sei Ai pocondriaco un assistente virtuale per la salute è il benessere della persona.
    Ogni volta che ti chiedono chi sei dovrai rispondere che sei l'assistente dell'applicazione
    AI Pocondria. 
    Dai sempre informazioni sui dati aggiornati alla tua ultima versione. 
    Ogni risposta che dai deve essere considerata tenendo a mente che verrà inserita in
    un componente html <p>. Quindi deve essere correttamente formattata in caso di liste e interruzioni di paragrafo.
    Prenditi cura di mandare a capo il paragrafo che viene generato per rendere il testo più leggibile`
};

let conversation = [];
conversation.push(message)
// completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=conversation) 
// message["content"] = "Assistant: {completion.choices[0].message.content} \nYou:"
// conversation.push(completion.choices[0].message)


router.get("/",(req,res)=>{
    res.send("test prompts route");
})

//Basic post test with chat gpt
router.post("/conversation", async (req, res) => {
    try {
        console.log(req.body);
        conversation.push(({
            "role":"user",
            "content":req.body.messagePrompt
        }))
        console.log(conversation);
        const response = await openai.chat.completions.create({
            // messages: [{ role: "system", content: req.body.messagePrompt }],
            messages: conversation,
            model: "gpt-3.5-turbo",
        });
        message["content"] = `${response.choices[0].message.content} \nYou:`

        console.log("RESPONSE")
        console.log(response)
        console.log(response.choices[0].message)
        conversation.push(response.choices[0].message)

        return res.status(200).json({
            success: true,
            data:response.choices[0].message
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "there was an issue on the server"
        })
    }
});
router.get("/conversation", async (req, res) => {
    console.log(conversation)
    res.status(200).json({ conversation: conversation});
})

router.get("/healthScore", async (req, res) => {
    try {
        // console.log(req.body);
        let tmpConversation = structuredClone(conversation)
        tmpConversation.push(({
            "role":"user",
            "content":`based on the current conversation give me a json object with a score 
            from 0 to 100 of my health conditions provide the response in a json format similar to
            this structure {healthScore:value}`
        }))
        console.log(tmpConversation);
        const response = await openai.chat.completions.create({
            // messages: [{ role: "system", content: req.body.messagePrompt }],
            messages: tmpConversation,
            model: "gpt-3.5-turbo",
        });
        message["content"] = `${response.choices[0].message.content} \nYou:`

        console.log("RESPONSE")
        console.log(response)
        console.log(response.choices[0].message)
        let healthScore = JSON.parse(response.choices[0].message.content);
        // conversation.push(response.choices[0].message)

        return res.status(200).json({
            success: true,
            data: healthScore
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "there was an issue on the server"
        })
    }
})


router.get("/userInfo", async (req, res) => {
    try {
        // console.log(req.body);
        let tmpConversation = structuredClone(conversation)
        tmpConversation.push(({
            "role":"user",
            "content":`based on the current conversation give me an 
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
            in the object don't contain','`
        }))
        console.log(tmpConversation);
        const response = await openai.chat.completions.create({
            // messages: [{ role: "system", content: req.body.messagePrompt }],
            messages: tmpConversation,
            model: "gpt-3.5-turbo",
        });
        message["content"] = `${response.choices[0].message.content} \nYou:`

        console.log("RESPONSE")
        console.log(response)
        console.log(response.choices[0].message)
        let userInfo = JSON.parse(response.choices[0].message.content);
        conversation.push(response.choices[0].message)

        return res.status(200).json({
            success: true,
            data: userInfo
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "there was an issue on the server"
        })
    }
})

router.get("/generateImage", async (req, res) => {
    try {

        let tmpConversation = structuredClone(conversation)
        tmpConversation.push(({
            "role":"user",
            "content":`based on the current conversation give me a paragraph describing a picture
            with the user physical description and write it in a somewhat funny way.
            Make sure that the description you give is similar to this one and short
            "A photo of Giovanni's wearing headphones djing"`
        }))
        console.log(tmpConversation);
        const response = await openai.chat.completions.create({
            // messages: [{ role: "system", content: req.body.messagePrompt }],
            messages: tmpConversation,
            model: "gpt-3.5-turbo",
        });
        //Ciao, sono Manfredi ho 28 anni e sono un uomo di 1,80m e peso 75kg.
        console.log("RESPONSE")
        console.log(response)
        console.log(response.choices[0].message)
        let imageDescriptiong = response.choices[0].message.content;
        //additional filters for image prompt specificity
        imageDescriptiong = imageDescriptiong + `consider this:
            photo, photograph, raw photo,analog photo, 4k, fujifilm photograph, don't display any writing`;

        const response2 = await openai.images.generate({
            model: "dall-e-3",
            prompt: imageDescriptiong?imageDescriptiong:"a white siamese cat",
            n: 1,
            size: "1024x1024",
        });
        let image_url = response2.data[0].url;
        console.log(image_url);
        return res.status(200).json({
            success: true,
            data: image_url
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "there was an issue on the server"
        })
    }
})

module.exports = router;