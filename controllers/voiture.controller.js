const { StatusCodes } = require("http-status-codes");
const { Voiture } = require("../models");

const ajoutVoiture = (req, res) => {
  const { marque, modele, immatriculation, couleur } = req.body;
  console.log(marque);
  console.log(modele);
  console.log(immatriculation);
  console.log(couleur);
  
  if (!marque || !modele || !immatriculation || !couleur) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Tous les champs sont requis " });
  }
  const voiture = Voiture.create({
    marque,
    modele,
    immatriculation,
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

module.exports = { ajoutVoiture };
