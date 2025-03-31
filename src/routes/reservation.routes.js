const router = require("express").Router();
const { authMiddleware } = require("../../middlware/auth");
const {
  ajoutReservation,
  modifierreservation,
  getAllreservation,
  deletereservation,
  getreservationByMatricul,
} = require("../controllers/reservation.controller");

router.post("/ajout", authMiddleware, ajoutReservation);
router.patch("/modifier",authMiddleware, modifierreservation);
router.get("/getAllreservation", getAllreservation);
router.delete("/deletereservation",authMiddleware, deletereservation);
router.get("/getByMatricul", getreservationByMatricul);

module.exports = router;
