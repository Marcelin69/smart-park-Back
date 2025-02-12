'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voiture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Voiture.init({
    marque: DataTypes.STRING,
    modele: DataTypes.STRING,
    immatriculation: DataTypes.STRING,
    couleur: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Voiture',
  });
  return Voiture;
};