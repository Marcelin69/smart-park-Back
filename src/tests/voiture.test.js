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

describe("🚗 Test CRUD de voiture", () => {
  /**
   * @test Vérification des champs obligatoires lors de l'ajout d'une voiture.
   * Ce test s'assure qu'une erreur est retournée si un champ est manquant.
   */
  it("❌ Devrait retourner une erreur si un champ est manquant", async () => {
    const voiture = {
      marque: "clio",
      modele: "renault",
      immatriculation: "AM-25-LO",
      // couleur manquant
    };
    const response = await request(app)
      .post("/api/voiture/ajoutVoiture")
      .send(voiture);
      console.log(response.body);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Tous les champs sont requis");
  });

  /**
   * @test Vérification de l'ajout d'une voiture valide.
   */
  it("✅ Devrait ajouter une voiture avec succès", async () => {
    const voiture = {
      marque: "clio",
      modele: "renault",
      immatriculation: "AM-25-UO",
      couleur: "bleu",
      duree:"2025-03-07 11:30:00"
    };
    const response = await request(app)
      .post("/api/voiture/ajoutVoiture")
      .send(voiture);
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Voiture ajouté avec succès");
  });

  /**
   * @test Vérification de la modification d'une voiture existante.
   */
  it("✏️ Devrait modifier une voiture existante", async () => {
    const voiture = {
      marque: "clii", // Correction de la marque
      modele: "renault",
      immatriculation: "AM-25-UO",
      couleur: "bleu",
    };
    const response = await request(app)
      .patch("/api/voiture/modifierVoiture")
      .send(voiture);
      console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Voiture modifié avec succès");
  });

  /**
   * @test Vérification de la récupération de toutes les voitures.
   */
  it("📋 Devrait récupérer toutes les voitures disponibles", async () => {
    const response = await request(app).get("/api/voiture/getAllVoiture");
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "les Voitures disponible avec succès");
  });

  /**
   * @test Vérification de la récupération d'une voiture spécifique par immatriculation.
   */
  it("🔍 Devrait récupérer une voiture existante par immatriculation", async () => {
    const immatriculation = "AM-25-UO";
    const response = await request(app)
      .get("/api/voiture/getVoitureByMatricul")
      .query({ immatriculation });
    
    console.log(response.body); // Debug: Vérifier la réponse de l'API
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Voiture disponible avec succès");
  });
});

/**
 * Ferme le serveur après l'exécution des tests pour éviter les erreurs liées aux ports.
 */
afterAll( async() => {
  const models = Object.keys(sequelize.models);
  for (const model of models) {
    await sequelize.models[model].destroy({ where: {}, force: true });
    await sequelize.query(`ALTER TABLE ${model}s AUTO_INCREMENT = 1;`);
  }
  server.close();
});