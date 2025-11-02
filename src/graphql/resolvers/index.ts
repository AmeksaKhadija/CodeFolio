import { AuthenticationError, UserInputError } from "apollo-server-express";
import User from "../../models/User";
import Profil from "../../models/Profil";
import Projet from "../../models/Projet";
import Competence from "../../models/Competence";
import Experience from "../../models/Experience";
import { generateToken } from "../../utils/jwt";
import { authenticate, Context } from "../../middleware/auth";

export const resolvers = {
  Query: {
    getPortfolio: async () => {
      const profil = await Profil.findOne();
      const projets = await Projet.find()
        .populate("competences")
        .sort({ dateDebut: -1 });
      const competences = await Competence.find().sort({
        categorie: 1,
        nom: 1,
      });
      const experiences = await Experience.find()
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
      return await Profil.findOne();
    },

    getProjets: async () => {
      return await Projet.find()
        .populate("competences")
        .sort({ dateDebut: -1 });
    },

    getProjet: async (_: any, { id }: { id: string }) => {
      return await Projet.findById(id).populate("competences");
    },

    getCompetences: async () => {
      return await Competence.find().sort({ categorie: 1, nom: 1 });
    },

    getExperiences: async () => {
      return await Experience.find()
        .populate("competences")
        .sort({ dateDebut: -1 });
    },
  },

  Mutation: {
    // ========== AUTHENTIFICATION ==========
    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("Identifiants invalides");
      }

      const isValidPassword = await user.comparePassword(password);

      if (!isValidPassword) {
        throw new AuthenticationError("Identifiants invalides");
      }

      const token = generateToken({
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
    updateProfil: async (_: any, { input }: any, context: Context) => {
      authenticate(context);

      let profil = await Profil.findOne();

      if (!profil) {
        profil = new Profil(input);
      } else {
        Object.assign(profil, input);
      }

      await profil.save();
      return profil;
    },

    // ========== PROJETS (ADMIN) ==========
    createProjet: async (_: any, { input }: any, context: Context) => {
      authenticate(context);

      const projet = new Projet(input);
      await projet.save();
      return await projet.populate("competences");
    },

    updateProjet: async (_: any, { id, input }: any, context: Context) => {
      authenticate(context);

      const projet = await Projet.findByIdAndUpdate(id, input, {
        new: true,
      }).populate("competences");

      if (!projet) {
        throw new UserInputError("Projet non trouvé");
      }

      return projet;
    },

    deleteProjet: async (_: any, { id }: { id: string }, context: Context) => {
      authenticate(context);

      const result = await Projet.findByIdAndDelete(id);
      return !!result;
    },

    // ========== COMPÉTENCES (ADMIN) ==========
    createCompetence: async (_: any, { input }: any, context: Context) => {
      authenticate(context);

      const competence = new Competence(input);
      await competence.save();
      return competence;
    },

    updateCompetence: async (_: any, { id, input }: any, context: Context) => {
      authenticate(context);

      const competence = await Competence.findByIdAndUpdate(id, input, {
        new: true,
      });

      if (!competence) {
        throw new UserInputError("Compétence non trouvée");
      }

      return competence;
    },

    deleteCompetence: async (
      _: any,
      { id }: { id: string },
      context: Context
    ) => {
      authenticate(context);

      const result = await Competence.findByIdAndDelete(id);
      return !!result;
    },

    // ========== EXPÉRIENCES (ADMIN) ==========
    createExperience: async (_: any, { input }: any, context: Context) => {
      authenticate(context);

      const experience = new Experience(input);
      await experience.save();
      return await experience.populate("competences");
    },

    updateExperience: async (_: any, { id, input }: any, context: Context) => {
      authenticate(context);

      const experience = await Experience.findByIdAndUpdate(id, input, {
        new: true,
      }).populate("competences");

      if (!experience) {
        throw new UserInputError("Expérience non trouvée");
      }

      return experience;
    },

    deleteExperience: async (
      _: any,
      { id }: { id: string },
      context: Context
    ) => {
      authenticate(context);

      const result = await Experience.findByIdAndDelete(id);
      return !!result;
    },
  },
};
