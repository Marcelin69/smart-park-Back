const { StatusCodes } = require("http-status-codes");
const { Voiture, Reservation } = require("../../models");
const { where } = require("sequelize");

const ajoutReservation = (req, res) => {
  console.log("Current environment:", process.env.NODE_ENV || "not defined");

  const {
    statu,
    date,
    marque,
    modele,
    couleur,
    immatriculation,
    duree,
  } = req.body;

  if (
    !marque ||
    !modele ||
    !immatriculation ||
    !couleur ||
    !duree ||
    !date ||
    !statu
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Tous les champs sont requis" });
  }
  Reservation.findOne({
    where: {
      immatriculation: immatriculation,
    },
  }).then((reservationEsist) => {
    if (!reservationEsist) {
      Reservation.create({
        statu,
        date,
        marque,
        modele,
        couleur,
        immatriculation,
        duree,
      })
        .then((reservation) => {
          res.json({
            code: StatusCodes.OK,
            message: "Reservation ajouté avec succès",
            data: reservation,
            error: null,
          });
        })
        .catch((err) => {
          res.json({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Erreur lors de la reservation de la reservation",
            data: null,
            error: err.message, // Renvoie l'erreur exacte pour debug
          });
        });
    } else {
      res.json({
        code: StatusCodes.BAD_REQUEST,
        message: "reservation existe déjà",
        data: null,
        error: "reservation existe déjà",
      });
    }
  });
};
const modifierreservation = async (req, res) => {
  const { immatriculation, ...updatedFields } = req.body;
  console.log(immatriculation);

  await Reservation
    .findOne({
      where: {
        immatriculation: immatriculation,
      },
    })
    .then(async (reservationFund) => {
      if (!reservationFund) {
        return res.status(StatusCodes.NOT_FOUND).json({
          code: StatusCodes.NOT_FOUND,
          message: "Reservation non trouvé",
          data: null,
          error: "Reservation non trouvé",
        });
      }
      
      
      
      // Mise à jour dynamique des valeurs envoyées uniquement
      Object.keys(updatedFields).forEach((key) => {
        if (updatedFields[key] !== undefined) {
          reservationFund[key] = updatedFields[key];
        }
      });
      await reservationFund.save();
      res.json({
        code: StatusCodes.OK,
        message: "Reservation modifié avec succès",
        data: reservationFund,
        error: null,
      });
    })
    .catch((error) => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de la mise à jour de la Reservation",
        data: null,
        error: error.message,
      });
    });
};
const getAllreservation = async (req, res) => {
  await Reservation.findAll()
    .then(async (reservationFund) => {
      res.json({
        code: StatusCodes.OK,
        message: "les Reservation disponible ",
        data: reservationFund,
        error: null,
      });
    })
    .catch(() => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de la recupération de la reservation",
        data: null,
        error: "Erreur lors de la recupération de la reservation",
      });
    });
};
const getreservationByMatricul = async (req, res) => {
  try {
    var reservationFund = await Reservation.findOne({
      where: {
        immatriculation: req.query.immatriculation,
      },
    });
    if (!reservationFund) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: "Reservation non trouvé",
        data: null,
        error: "Reservation non trouvé",
      });
    }
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: "Reservation disponible avec succès",
      data: reservationFund,
      error: null,
    });
  } catch (error) {
    return res.json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
const deletereservation = async (req, res) => {
  const id = req.query.id;
  await Reservation.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.json({
        code: StatusCodes.OK,
        message: "Reservation supprimé avec succès",
        data: null,
        error: null,
      });
    })
    .catch((error) => {
      res.json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Erreur lors de la suppression de la reservation",
        data: null,
        error: error.message,
      });
    });
};

module.exports = {
  ajoutReservation,
  modifierreservation,
  getAllreservation,
  deletereservation,
  getreservationByMatricul,
};
