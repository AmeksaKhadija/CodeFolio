import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type AuthPayload {
    token: String! # Compatibilité - retourne l'accessToken
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type RefreshPayload {
    accessToken: String!
  }

  type ReseauxSociaux {
    github: String
    linkedin: String
    twitter: String
    portfolio: String
  }

  type Profil {
    id: ID!
    nom: String!
    prenom: String!
    titre: String!
    bio: String!
    email: String!
    telephone: String
    localisation: String
    photo: String
    reseauxSociaux: ReseauxSociaux
  }

  type Competence {
    id: ID!
    nom: String!
    categorie: String!
    niveau: Int!
    icone: String
  }

  type Projet {
    id: ID!
    titre: String!
    description: String!
    image: String
    lienDemo: String
    lienGithub: String
    technologies: [String!]!
    dateDebut: String!
    dateFin: String
    competences: [Competence!]!
  }

  type Experience {
    id: ID!
    poste: String!
    entreprise: String!
    localisation: String
    dateDebut: String!
    dateFin: String
    enCours: Boolean!
    description: String!
    competences: [Competence!]!
  }

  type Portfolio {
    profil: Profil
    projets: [Projet!]!
    competences: [Competence!]!
    experiences: [Experience!]!
  }

  # Inputs
  input ReseauxSociauxInput {
    github: String
    linkedin: String
    twitter: String
    portfolio: String
  }

  input ProfilInput {
    nom: String!
    prenom: String!
    titre: String!
    bio: String!
    email: String!
    telephone: String
    localisation: String
    photo: String
    reseauxSociaux: ReseauxSociauxInput
  }

  input ProjetInput {
    titre: String!
    description: String!
    image: String
    lienDemo: String
    lienGithub: String
    technologies: [String!]!
    dateDebut: String!
    dateFin: String
    competences: [ID!]!
  }

  input CompetenceInput {
    nom: String!
    categorie: String!
    niveau: Int!
    icone: String
  }

  input ExperienceInput {
    poste: String!
    entreprise: String!
    localisation: String
    dateDebut: String!
    dateFin: String
    enCours: Boolean!
    description: String!
    competences: [ID!]!
  }

  # Queries
  type Query {
    # Publiques
    getPortfolio: Portfolio!
    getProfil: Profil
    getProjets: [Projet!]!
    getProjet(id: ID!): Projet
    getCompetences: [Competence!]!
    getExperiences: [Experience!]!
  }

  # Mutations
  type Mutation {
    # Authentification
    login(username: String!, password: String!): AuthPayload!
    refreshToken(refreshToken: String!): RefreshPayload!

    # Profil (Admin)
    updateProfil(input: ProfilInput!): Profil!

    # Projets (Admin)
    createProjet(input: ProjetInput!): Projet!
    updateProjet(id: ID!, input: ProjetInput!): Projet!
    deleteProjet(id: ID!): Boolean!

    # Compétences (Admin)
    createCompetence(input: CompetenceInput!): Competence!
    updateCompetence(id: ID!, input: CompetenceInput!): Competence!
    deleteCompetence(id: ID!): Boolean!

    # Expériences (Admin)
    createExperience(input: ExperienceInput!): Experience!
    updateExperience(id: ID!, input: ExperienceInput!): Experience!
    deleteExperience(id: ID!): Boolean!
  }
`;
