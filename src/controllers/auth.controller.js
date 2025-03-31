const bcrypt = require("bcrypt");
const { Utilisateur, Reservation } = require("../../models");
require("dotenv").config();
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/reservation.routes");

const registerController = async (req, res) => {
  try {
    const { nom, prenom, email, password, age } = req.body;
    if (!nom || !prenom || !email || !password || !age) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: "Tous les champs sont requis",
        data: null,
        error: null,
      });
    }
    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: "Le mot de passe doit contenir au moins 6 caractères",
        data: null,
        error: null,
      });
    }
    if (age < 18) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: "L'âge doit être supérieur à 18 ans",
        data: null,
        error: null,
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const exitUser = await Utilisateur.findOne({
      where: {
        email: email,
      },
    });
    if (exitUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: "L'utilisateur a un compte",
        data: null,
        error: null,
      });
    }
    const user = await Utilisateur.create({
      email,
      password: hashedPassword,
      nom,
      prenom,
      age,
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_GATEWAY,
        message: "Utilisateur non enregistré",
        data: null,
      });
    }

  
    var jeton = jwt.sign({ id: user.id, email:user.email  }, process.env.SECRETE_KET);

    res.status(StatusCodes.ACCEPTED).json({
      code: StatusCodes.ACCEPTED,
      message: "utilisateur enregistré avec succès",
      data: jeton,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Erreur lors de l'enregistrement de l'utilisateur",
      data: error.message,
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await Utilisateur.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_GATEWAY,
      message: "utilisateur non trouvé",
      data: null,
    });
  }
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_GATEWAY,
      message: "Mot de passe incorrect",
      data: null,
    });
  }
  var jeton = jwt.sign({ id: user.id, email:user.email  }, process.env.SECRETE_KET);
  //   await cookies().set('token', token, { maxAge: 20000 })
  res.status(StatusCodes.ACCEPTED).json({
    code: StatusCodes.ACCEPTED,
    message: "Utilisateur connecté avec succès",
    data: jeton,
  });
};

module.exports = {
  registerController,
  loginController,
};
