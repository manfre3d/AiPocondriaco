const express = require("express");
const router = express.Router()

const utentiService = require("../database/services/utentiService");
const { insertUtente } = require("../database/models/utenti");

router.get("/",(req,res)=>{
    res.send("test utenti route");
})


router.get("/utenti",async (req,res)=>{
   let utenti = await utentiService.fetchUtenti();
   return res.status(200).json({ utenti: utenti});
})


router.post("/addUtenti", async (req, res) => {
        await utentiService.addtUtente(req.body.nome, req.body.cognome, req.body.email, req.body.password);
})    

router.post("/initUtenti", async (req, res) => {
    await utentiService.initializeUtenti()
})

module.exports = router;


