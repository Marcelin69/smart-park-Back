const { StatusCodes } = require("http-status-codes");
const { Voiture } = require("../models");

const ajoutVoiture = (req, res) => {
  const { marque, modele, immatricultion, couleur } = req.body;
  const voiture = Voiture.create({
    marque,
    modele,
    immatricultion,
    couleur,
  })
    .then((voiture) => {
      res.json({
        code: StatusCodes.OK,
        message: "Voiture ajouté avec succès",
        data: voiture,
        error: null,
      });
    })
    .catch(() => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de l'ajout de la voiture",
        data: null,
        error: "Erreur lors de l'ajout de la voiture",
      });
    });
};

module.exports = {ajoutVoiture} 
