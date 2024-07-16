const express = require("express");
const router = express.Router()

const attivitàFisicheService = require("../database/services/attivitaFisicheService");

router.get("/",(req,res)=>{
    res.send("test attività fisiche route");
})


router.get("/attivitàFisiche",async (req,res)=>{
   let attivitaFisiche = await attivitàFisicheService.fetchPatologie();
   return res.status(200).json({ attività_fisiche: attivitaFisiche});
})


router.post("/initAttivitaFisiche", async (req, res) => {
        await attivitàFisicheService.initializePatologie()
})    

module.exports = router;