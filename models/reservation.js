'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reservation.init({
    statu: DataTypes.STRING,
    date: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    marque: DataTypes.STRING,
    modele: DataTypes.STRING,
    couleur: DataTypes.STRING,
    immatriculation: DataTypes.STRING,
    duree: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};