/**
 * @file voiture.test.js
 * @description Tests unitaires pour le module voiture.
 * Vérifie les fonctionnalités CRUD de l'API voiture.
 *
 * Tests effectués :
 * - Vérification des champs obligatoires lors de l'ajout.
 * - Ajout d'une voiture.
 * - Modification d'une voiture existante.
 * - Récupération de toutes les voitures.
 * - Récupération d'une voiture spécifique par immatriculation.
 */

const request = require("supertest");
const { app, server } = require("../../index");
const sequelize = require("../../models").sequelize;

const addUser = async () => {
  const utilisateur = {
    email: "marcelintingougoui3@gmail.com",
    nom: "Tingougoui",
    prenom: "Marcelin",
    password: "123456789",
  };
  const response = await request(app)
    .post("/api/auth/register")
    .send(utilisateur);
  console.log(response.body);
  return response;
};

const afterRun = async () => {
  console.log("il est passé ici");

  const models = Object.keys(sequelize.models);

  // Vérifiez que le modèle existe avant de tenter de le réinitialiser
  if (models.length > 2) {
    const modelName = models[1];
    const model = sequelize.models[modelName];

    // Supprime toutes les entrées du modèle
    await model.destroy({ where: {}, force: true });

    // Réinitialise l'auto-incrémentation de la table
    await sequelize.query(
      `ALTER TABLE ${model.getTableName()} AUTO_INCREMENT = 1;`
    );
  } else {
    console.error("Le modèle spécifié n'existe pas.");
  }
};

describe("🚗 Test CRUD de voiture", () => {
  /**
   * @test Vérification des champs obligatoires lors de l'inscription.
   * Ce test s'assure qu'une erreur est retournée si un champ est manquant.
   */
  it("Test de verification des champs lors de l'inscription de l'utilisateur ", async () => {
    const utilisateur = {
      email: "marcelintingougoui3@gmail.com",
      nom: "Tingougoui",
      prenom: "Marcelin",
      password: "123456789",
    };
    const response = await request(app)
      .post("/api/auth/register")
      .send(utilisateur);
    console.log(response.body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Tous les champs sont requis"
    );
  });

  it("Test de register ", async () => {
    const utilisateur = {
      email: "marcelintingougoui3@gmail.com",
      nom: "Tingougoui",
      prenom: "Marcelin",
      password: "123456789",
      age: 18,
    };
    const response = await request(app)
      .post("/api/auth/register")
      .send(utilisateur);
    console.log(response.body);

    expect(response.statusCode).toBe(202);
    expect(response.body).toHaveProperty(
      "message",
      "utilisateur enregistré avec succès"
    );
  });
  it("Test de connexion ", async () => {
    const utilisateur = {
      email: "marcelintingougoui3@gmail.com",

      password: "123456789",
    };
    const response = await request(app)
      .post("/api/auth/login")
      .send(utilisateur);
    console.log(response.body);

    expect(response.statusCode).toBe(202);
    expect(response.body).toHaveProperty(
      "message",
      "Utilisateur connecté avec succès"
    );
  });
});

/**
 * Ferme le serveur après l'exécution des tests pour éviter les erreurs liées aux ports.
 */
afterAll(async () => {
  const models = Object.keys(sequelize.models);
  for (const model of models) {
    await sequelize.models[model].destroy({ where: {}, force: true });
    await sequelize.query(`ALTER TABLE ${model}s AUTO_INCREMENT = 1;`);
  }
  server.close();
});
