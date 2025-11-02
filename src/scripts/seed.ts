import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User";
import Profil from "../models/Profil";
import Competence from "../models/Competence";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connecté à MongoDB");

    await User.deleteMany({});
    await Profil.deleteMany({});
    await Competence.deleteMany({});

    const admin = await User.create({
      username: "admin",
      password: "admin123",
      role: "admin",
    });
    console.log("✅ Admin créé:", admin.username);

    // Créer un profil de base
    const profil = await Profil.create({
      nom: "Doe",
      prenom: "John",
      titre: "Développeur Full Stack",
      bio: "Passionné par le développement web et les nouvelles technologies.",
      email: "john.doe@example.com",
      telephone: "+212 6 00 00 00 00",
      localisation: "Casablanca, Maroc",
      reseauxSociaux: {
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      },
    });
    console.log("✅ Profil créé");

    // Créer quelques compétences
    const competences = await Competence.insertMany([
      { nom: "JavaScript", categorie: "frontend", niveau: 5 },
      { nom: "TypeScript", categorie: "frontend", niveau: 4 },
      { nom: "React", categorie: "frontend", niveau: 5 },
      { nom: "Node.js", categorie: "backend", niveau: 4 },
      { nom: "MongoDB", categorie: "database", niveau: 4 },
      { nom: "GraphQL", categorie: "backend", niveau: 4 },
    ]);
    console.log(`✅ ${competences.length} compétences créées`);

    console.log("\n🎉 Seed terminé avec succès!");
    console.log("\n📝 Identifiants admin:");
    console.log("   Username: admin");
    console.log("   Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  }
};

seedDatabase();
