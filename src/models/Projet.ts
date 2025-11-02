import mongoose, { Document, Schema } from "mongoose";

export interface IProjet extends Document {
  titre: string;
  description: string;
  image?: string;
  lienDemo?: string;
  lienGithub?: string;
  technologies: string[];
  dateDebut: Date;
  dateFin?: Date;
  competences: mongoose.Types.ObjectId[];
}

const projetSchema = new Schema<IProjet>(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    lienDemo: String,
    lienGithub: String,
    technologies: [{ type: String }],
    dateDebut: { type: Date, required: true },
    dateFin: Date,
    competences: [{ type: Schema.Types.ObjectId, ref: "Competence" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProjet>("Projet", projetSchema);
