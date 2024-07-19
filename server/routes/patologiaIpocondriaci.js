const express = require("express");
const router = express.Router()

const patologiaIpocondriaciService = require("../database/services/patologiaIpocondriaciService");

router.get("/",(req,res)=>{
    res.send("test patologia ipocondriaci route");
})

router.get("/patologiaIpocondriaci",async (req,res)=>{
    let patologiaIpocondriaci = await patologiaIpocondriaciService.fetchPatologiaIpocondriaci();
    return res.status(200).json({ patologiaIpocondriaci: patologiaIpocondriaci});
})

router.post("/addPatologiaaIpocondriaci", async (req, res) => {
    await patologiaIpocondriaciService.addPatologiaIpocondriaco(body.req.ipocondriacoID, req.bosy.patologiaID, req.body.dataDiagnosi)
}) 

router.post("/initPatologiaaIpocondriaci", async (req, res) => {
    await patologiaIpocondriaciService.initializePatologiaIpocondriaci()
})

module.exports = router;