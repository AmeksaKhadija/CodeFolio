import mongoose, { Document, Schema } from "mongoose";

export interface IProfil extends Document {
  nom: string;
  prenom: string;
  titre: string;
  bio: string;
  email: string;
  telephone?: string;
  localisation?: string;
  photo?: string;
  reseauxSociaux: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

const profilSchema = new Schema<IProfil>(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    titre: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    telephone: String,
    localisation: String,
    photo: String,
    reseauxSociaux: {
      github: String,
      linkedin: String,
      twitter: String,
      portfolio: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProfil>("Profil", profilSchema);
