const express = require("express");
const router = express.Router()
const openai =require("../server.js");



router.get("/",(req,res)=>{
    res.send("test prompts route");
})

//Basic post test with chat gpt
router.post("/test", async (req, res) => {
    try {
        console.log(req.body);
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: req.body.messagePrompt }],
            model: "gpt-3.5-turbo",
        });
        console.log(response)
        console.log(response.choices[0].message)
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