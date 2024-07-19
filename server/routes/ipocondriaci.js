const express = require("express");
const router = express.Router()

const ipocondriaciService = require("../database/services/ipocondriaciService");

router.get("/",(req,res)=>{
    res.send("test ipocondriaci route");
})

router.get("/ipocondriaci",async (req,res)=>{
    let ipocondriaci = await ipocondriaciService.fetchIpocondriaci();
    return res.status(200).json({ ipocondriaci: ipocondriaci});
 })

router.post("/addIpocondriaci", async (req, res) => {
   await ipocondriaciService.addIpocondriaco(req.body.utenteID, req.body.dataNascita, req.body.altezza, req.body.peso, req.body.eta, req.body.indirizzo, req.body.numeroTelefono)
})  

router.post("/initIpocondriaci", async (req, res) => {
    await ipocondriaciService.initializeIpocondriaci()
})

module.exports = router;