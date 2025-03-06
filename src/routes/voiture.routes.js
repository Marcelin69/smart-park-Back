const {ajoutVoiture,modifierVoiture,getAllVoiture,deleteVoiture,getVoitureByMatricul} = require("../controllers/voiture.controller");
const express = require("express")
const router = express.Router();


router.post("/ajoutVoiture",ajoutVoiture)
router.patch("/modifierVoiture",modifierVoiture)
router.get("/getAllVoiture",getAllVoiture)
router.delete("/deleteVoiture",deleteVoiture)
router.get("/getVoitureByMatricul",getVoitureByMatricul)


module.exports = router;



