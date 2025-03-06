const { StatusCodes } = require("http-status-codes");
const { Voiture } = require("../../models");
const { where } = require("sequelize");

const ajoutVoiture = (req, res) => {
  console.log("Current environment:", process.env.NODE_ENV || "not defined");

  const { marque, modele, immatriculation, couleur } = req.body;

  if (!marque || !modele || !immatriculation || !couleur) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Tous les champs sont requis" });
  }
  Voiture.findOne({
    where: {
      immatriculation: immatriculation,
    },
  }).then((voitureEsist) => {
    if (!voitureEsist) {
      Voiture.create({
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
        .catch((err) => {
          res.json({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Erreur lors de l'ajout de la voiture",
            data: null,
            error: err.message, // Renvoie l'erreur exacte pour debug
          });
        });
    }
  });
};
const modifierVoiture = async (req, res) => {
  const { immatriculation, ...updatedFields } = req.body;
  console.log(immatriculation);

  await Voiture.findOne({
    where: {
      immatriculation: immatriculation,
    },
  })
    .then(async (voitureFund) => {
      if (!voitureFund) {
        return res.status(StatusCodes.NOT_FOUND).json({
          code: StatusCodes.NOT_FOUND,
          message: "Voiture non trouvé",
          data: null,
          error: "Voiture non trouvé",
        });
      }

      // Mise à jour dynamique des valeurs envoyées uniquement
      Object.keys(updatedFields).forEach((key) => {
        if (updatedFields[key] !== undefined) {
          voitureFund[key] = updatedFields[key];
        }
      });
      await voitureFund.save();
      res.json({
        code: StatusCodes.OK,
        message: "Voiture modifié avec succès",
        data: voitureFund,
        error: null,
      });
    })
    .catch((error) => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de la mise à jour de la voiture",
        data: null,
        error: error.message,
      });
    });
};
const getAllVoiture = async (req, res) => {
  await Voiture.findAll()
    .then(async (voitureFund) => {
      res.json({
        code: StatusCodes.OK,
        message: "les Voitures disponible avec succès",
        data: voitureFund,
        error: null,
      });
    })
    .catch(() => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de la recupération de la voiture",
        data: null,
        error: "Erreur lors de la recupération de la voiture",
      });
    });
};
const getVoitureByMatricul = async (req, res) => {
  await Voiture.findOne({
    where: {
      immatriculation: req.query.immatriculation,
    }
  })
    .then(async (voitureFund) => {
      if (voitureFund) {
        res.json({
          code: StatusCodes.OK,
          message: "la Voiture est disponible",
          data: voitureFund,
          error: null,
        });
      }else{
        res.json({
          code: StatusCodes.NOT_FOUND,
          message: "la voiture n'est pas disponible",
          data: null,
          error: "la voiture n'est pas disponible",
          });
      }
    })
    .catch((err) => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de la recupération de la voiture",
        data: err.message,
        error: "Erreur lors de la recupération de la voiture",
      });
    });
};
const deleteVoiture = async (req, res) => {
  const id = req.params.id;
  await Voiture.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.json({
        code: StatusCodes.OK,
        message: "Voiture supprimé avec succès",
        data: null,
        error: null,
      });
    })
    .catch((error) => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de la suppression de la voiture",
        data: null,
        error: error.message,
      });
    });
};

module.exports = { ajoutVoiture, modifierVoiture, getAllVoiture,deleteVoiture,getVoitureByMatricul };
