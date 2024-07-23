const express = require("express");
const router = express.Router()
const openai =require("../server.js");

let message = {
    "role":"user", 
    "content": "This is the beginning of your chat with AI. [To exit, send \"###\".]\n\nYou:"
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
router.post("/test", async (req, res) => {
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
        message["content"] = `Assistant: ${response.choices[0].message.content} \nYou:`

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


module.exports = router;