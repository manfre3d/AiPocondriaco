const express = require("express");
const router = express.Router()

const patologieService = require("../database/services/patologieService");

router.get("/",(req,res)=>{
    res.send("test patologie route");
})


router.get("/patologie",async (req,res)=>{
   let patologie = await patologieService.fetchPatologie();
   return res.status(200).json({ patologie: patologie});
})


router.post("/initPatologie", async (req, res) => {
        await patologieService.initializePatologie()
})    

module.exports = router;