"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Profil_1 = __importDefault(require("../models/Profil"));
const Competence_1 = __importDefault(require("../models/Competence"));
dotenv_1.default.config();
const seedDatabase = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connecté à MongoDB");
        await User_1.default.deleteMany({});
        await Profil_1.default.deleteMany({});
        await Competence_1.default.deleteMany({});
        const admin = await User_1.default.create({
            username: "admin",
            password: "admin123",
            role: "admin",
        });
        console.log("✅ Admin créé:", admin.username);
        // Créer un profil de base
        const profil = await Profil_1.default.create({
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
        const competences = await Competence_1.default.insertMany([
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
    }
    catch (error) {
        console.error("❌ Erreur lors du seed:", error);
        process.exit(1);
    }
};
seedDatabase();
