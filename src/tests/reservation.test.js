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
var token;

const addReservation = async () => {
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
  console.log(`utilisateur crée ${responseUser.body.data}`);

  const responseLogin = await request(app)
    .post("/api/auth/login")
    .send(utilisateur);

  token = responseLogin.body.data;

  const reservation = {
    modele: "renault",
    marque: "clio",
    immatriculation: "AA-777-BI",
    couleur: "Rouge",
    duree: "2025-03-31T12:00:00Z",
    date: "2025-03-31T09:00:00Z",
    statu: "en cours",
  };
 

  const response = await request(app)
    .post("/api/reservation/ajout")
    .set("Authorization", `Bearer ${token}`)
    .send(reservation);

  return response;
};

const afterRun = async () => {
  console.log("il est passé ici");

  const models = Object.keys(sequelize.models);

  // Vérifiez que le modèle existe avant de tenter de le réinitialiser
  if (models.length > 2) {
    const modelName = models[0];
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
   * @test Vérification des champs obligatoires lors de la reservation.
   * Ce test s'assure qu'une erreur est retournée si un champ est manquant.
   */
  it("Vérifie les champs obligatoires lors de la reservation", async () => {
    await addReservation();
    const reservation = {
      modele: "renault",
      marque: "clio",
      immatriculation: "AA-777-BI",
      couleur: "Rouge",
      duree: "2025-03-31T12:00:00Z",
      date: "2025-03-31T09:00:00Z",
    };
    console.log(`verification , ${token}`);
    
    const response = await request(app)
      .post("/api/reservation/ajout")
      .set("Authorization", `Bearer ${token}`)
      .send(reservation);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Tous les champs sont requis"
    );
    await afterRun();
  });
  it("Ajout de reservation", async () => {
    const response = await addReservation();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Reservation ajouté avec succès"
    );
    await afterRun();
  });
  it("modification de reservation", async () => {
    const responseAdd = await addReservation();

    const data = {
      modele: "renault",
      marque: "clio",
      immatriculation: "AA-777-BI",
      couleur: "Rouge",
      duree: "2025-03-31T12:00:00Z",
      date: "2025-03-31T09:00:00Z",
      statu: "en cours",
    };
    const response = await request(app)
      .patch("/api/reservation/modifier")
      .set("Authorization", `Bearer ${token}`)
      .send(data);
    

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Reservation modifié avec succès"
    );
    await afterRun();
  });
  it("suppression de reservation", async () => {
    const responseAdd = await addReservation();
    const data = {
      id: 1,
    };
    const response = await request(app)
      .delete("/api/reservation/deletereservation")
      .set("Authorization", `Bearer ${token}`)
      .query(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Reservation supprimé avec succès"
    );
    await afterRun();
  });
  it("affichage de reservation", async () => {
    const response = await request(app).get(
      "/api/reservation/getAllreservation"
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "les Reservation disponible "
    );
  });
  it("affichage de reservation par matricule", async () => {
    const responseAdd = await addReservation();

    const data = {
      immatriculation: "AA-777-BI",
    };
    const response = await request(app)
      .get("/api/reservation/getByMatricul")
      .query(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Reservation disponible avec succès"
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
