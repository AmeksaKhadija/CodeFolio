"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = __importDefault(require("../../models/User"));
const Profil_1 = __importDefault(require("../../models/Profil"));
const Projet_1 = __importDefault(require("../../models/Projet"));
const Competence_1 = __importDefault(require("../../models/Competence"));
const Experience_1 = __importDefault(require("../../models/Experience"));
const jwt_1 = require("../../utils/jwt");
const auth_1 = require("../../middleware/auth");
exports.resolvers = {
    Query: {
        getPortfolio: async () => {
            const profil = await Profil_1.default.findOne();
            const projets = await Projet_1.default.find()
                .populate("competences")
                .sort({ dateDebut: -1 });
            const competences = await Competence_1.default.find().sort({
                categorie: 1,
                nom: 1,
            });
            const experiences = await Experience_1.default.find()
                .populate("competences")
                .sort({ dateDebut: -1 });
            return {
                profil,
                projets,
                competences,
                experiences,
            };
        },
        getProfil: async () => {
            return await Profil_1.default.findOne();
        },
        getProjets: async () => {
            return await Projet_1.default.find()
                .populate("competences")
                .sort({ dateDebut: -1 });
        },
        getProjet: async (_, { id }) => {
            return await Projet_1.default.findById(id).populate("competences");
        },
        getCompetences: async () => {
            return await Competence_1.default.find().sort({ categorie: 1, nom: 1 });
        },
        getExperiences: async () => {
            return await Experience_1.default.find()
                .populate("competences")
                .sort({ dateDebut: -1 });
        },
    },
    Mutation: {
        // ========== AUTHENTIFICATION ==========
        login: async (_, { username, password }) => {
            const user = await User_1.default.findOne({ username });
            if (!user) {
                throw new apollo_server_express_1.AuthenticationError("Identifiants invalides");
            }
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw new apollo_server_express_1.AuthenticationError("Identifiants invalides");
            }
            const token = (0, jwt_1.generateToken)({
                userId: user.id,
                username: user.username,
                role: user.role,
            });
            return {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
            };
        },
        // ========== PROFIL (ADMIN) ==========
        updateProfil: async (_, { input }, context) => {
            (0, auth_1.authenticate)(context);
            let profil = await Profil_1.default.findOne();
            if (!profil) {
                profil = new Profil_1.default(input);
            }
            else {
                Object.assign(profil, input);
            }
            await profil.save();
            return profil;
        },
        // ========== PROJETS (ADMIN) ==========
        createProjet: async (_, { input }, context) => {
            (0, auth_1.authenticate)(context);
            const projet = new Projet_1.default(input);
            await projet.save();
            return await projet.populate("competences");
        },
        updateProjet: async (_, { id, input }, context) => {
            (0, auth_1.authenticate)(context);
            const projet = await Projet_1.default.findByIdAndUpdate(id, input, {
                new: true,
            }).populate("competences");
            if (!projet) {
                throw new apollo_server_express_1.UserInputError("Projet non trouvé");
            }
            return projet;
        },
        deleteProjet: async (_, { id }, context) => {
            (0, auth_1.authenticate)(context);
            const result = await Projet_1.default.findByIdAndDelete(id);
            return !!result;
        },
        // ========== COMPÉTENCES (ADMIN) ==========
        createCompetence: async (_, { input }, context) => {
            (0, auth_1.authenticate)(context);
            const competence = new Competence_1.default(input);
            await competence.save();
            return competence;
        },
        updateCompetence: async (_, { id, input }, context) => {
            (0, auth_1.authenticate)(context);
            const competence = await Competence_1.default.findByIdAndUpdate(id, input, {
                new: true,
            });
            if (!competence) {
                throw new apollo_server_express_1.UserInputError("Compétence non trouvée");
            }
            return competence;
        },
        deleteCompetence: async (_, { id }, context) => {
            (0, auth_1.authenticate)(context);
            const result = await Competence_1.default.findByIdAndDelete(id);
            return !!result;
        },
        // ========== EXPÉRIENCES (ADMIN) ==========
        createExperience: async (_, { input }, context) => {
            (0, auth_1.authenticate)(context);
            const experience = new Experience_1.default(input);
            await experience.save();
            return await experience.populate("competences");
        },
        updateExperience: async (_, { id, input }, context) => {
            (0, auth_1.authenticate)(context);
            const experience = await Experience_1.default.findByIdAndUpdate(id, input, {
                new: true,
            }).populate("competences");
            if (!experience) {
                throw new apollo_server_express_1.UserInputError("Expérience non trouvée");
            }
            return experience;
        },
        deleteExperience: async (_, { id }, context) => {
            (0, auth_1.authenticate)(context);
            const result = await Experience_1.default.findByIdAndDelete(id);
            return !!result;
        },
    },
};
