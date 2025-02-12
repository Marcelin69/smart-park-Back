const {ajoutVoiture} = require("../controllers/voiture.controller");
const express = require("express")
const router = express.Router();


router.post("/ajoutVoiture",ajoutVoiture)


module.exports = router;



