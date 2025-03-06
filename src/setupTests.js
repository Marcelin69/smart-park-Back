const { sequelize } = require("./models"); // Assurez-vous que le chemin est correct

beforeAll(async () => {
  try {
    console.log("🔄 Resetting database before tests...");
    await sequelize.sync({ force: true }); // Supprime et recrée toutes les tables
    console.log("✅ Database reset complete.");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  }
});

afterAll(async () => {
  await sequelize.close(); // Ferme la connexion après tous les tests
});