const { authMiddleware } = require("../../middlware/auth");
const {ajoutVoiture,modifierVoiture,getAllVoiture,deleteVoiture,getVoitureByMatricul} = require("../controllers/voiture.controller");
const express = require("express")
const router = express.Router();


router.post("/ajoutVoiture",authMiddleware, ajoutVoiture)
router.patch("/modifierVoiture",authMiddleware, modifierVoiture)
router.get("/getAllVoiture",getAllVoiture)
router.delete("/deleteVoiture",authMiddleware, deleteVoiture)
router.get("/getVoitureByMatricul",getVoitureByMatricul)


module.exports = router;



