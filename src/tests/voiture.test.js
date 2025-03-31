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
var token = "";

const addVoitur = async () => {
  const utilisateur = {
    email: "marcelintingougoui3@gmail.com",
    nom: "Tingougoui",
    prenom: "Marcelin",
    password: "123456789",
    age: 18,
  };
  const responseUser = await request(app)
    .post("/api/auth/register")
    .send(utilisateur);

  const responseLogin = await request(app)
    .post("/api/auth/login")
    .send(utilisateur);

  token = responseLogin.body.data;
  const voiture = {
    marque: "clio",
    modele: "renault",
    immatriculation: "AM-25-UO",
    couleur: "bleu",
    duree: "2025-03-07 11:30:00",
  };
  const response = await request(app)
    .post("/api/voiture/ajoutVoiture")
    .set("Authorization", `Bearer ${token}`)
    .send(voiture);
  return response;
};

const afterRun = async () => {

  const models = Object.keys(sequelize.models);

  // Vérifiez que le modèle existe avant de tenter de le réinitialiser
  if (models.length > 2) {
    const modelName = models[2];
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
   * @test Vérification des champs obligatoires lors de l'ajout d'une voiture.
   * Ce test s'assure qu'une erreur est retournée si un champ est manquant.
   */
  it("❌ Devrait retourner une erreur si un champ est manquant", async () => {
    await addVoitur();

    const voiture = {
      marque: "clio",
      modele: "renault",
      immatriculation: "AM-25-LO",
      // couleur manquant
    };
    const response = await request(app)
      .post("/api/voiture/ajoutVoiture")
      .set("Authorization", `Bearer ${token}`)
      .send(voiture);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Tous les champs sont requis"
    );
    afterRun();
  });

  /**
   * @test Vérification de l'ajout d'une voiture valide.
   */
  it("✅ Devrait ajouter une voiture avec succès", async () => {
    const response = await addVoitur();
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Voiture ajouté avec succès"
    );
    afterRun();
  });

  /**
   * @test Vérification de la modification d'une voiture existante.
   */
  it("✏️ Devrait modifier une voiture existante", async () => {
    await addVoitur();
    const voiture = {
      marque: "clii", // Correction de la marque
      modele: "renault",
      immatriculation: "AM-25-UO",
      couleur: "bleu",
    };
    const response = await request(app)
      .patch("/api/voiture/modifierVoiture")
      .set("Authorization", `Bearer ${token}`)
      .send(voiture);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Voiture modifié avec succès"
    );
    afterRun();
  });

  /**
   * @test Vérification de la récupération de toutes les voitures.
   */
  it("📋 Devrait récupérer toutes les voitures disponibles", async () => {
    await addVoitur();
    const response = await request(app).get("/api/voiture/getAllVoiture");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "les Voitures disponible avec succès"
    );
    afterRun();
  });

  /**
   * @test Vérification de la récupération d'une voiture spécifique par immatriculation.
   */
  it("🔍 Devrait récupérer une voiture existante par immatriculation", async () => {
    await addVoitur();

    const immatriculation = "AM-25-UO";
    const response = await request(app)
      .get("/api/voiture/getVoitureByMatricul")
      .query({ immatriculation });


    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Voiture disponible avec succès"
    );
    afterRun();
  });

  /**
   * @test suppression de voiture*/
  it("🚮 Devrait supprimer une voiture existante par id", async () => {
    await addVoitur();
    const id = 1;
    const response = await request(app)
      .delete("/api/voiture/deleteVoiture")
      .set("Authorization", `Bearer ${token}`)

      .query({ id });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Voiture supprimé avec succès"
    );
    afterRun();
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
