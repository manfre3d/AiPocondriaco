const express = require("express");
const router = express.Router()

const attivitaFisicaIpocondriaciService = require("../database/services/attivitaFisicaIpocondriaciService");

router.get("/",(req,res)=>{
    res.send("test attività fisica ipocondriaci route");
})

router.get("/attivitaFisicaIpocondriaci",async (req,res)=>{
    let attivitaFisicaIpocondriaci = await attivitaFisicaIpocondriaciService.fetchAttivitaFisicaIpocondriaci();
    return res.status(200).json({ attivitaFisicaIpocondriaci: attivitaFisicaIpocondriaci});
 })

router.post("/addAttivitaFisicaIpocondriaci", async (req, res) => {
    await attivitaFisicaIpocondriaciService.addAttivitaFisicaIpocondriaci(req.body.ipocondriacoID, req.body.arrivitaID, req.body.durata) 
}) 

 router.post("/initAttivitaFisicaIpocondriaci", async (req, res) => {
    await attivitaFisicaIpocondriaciService.initializeAttivitaFisicaIpocondriaci()
})

module.exports = router;