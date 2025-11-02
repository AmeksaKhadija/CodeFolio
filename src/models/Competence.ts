import mongoose, { Document, Schema } from "mongoose";

export interface ICompetence extends Document {
  nom: string;
  categorie: "frontend" | "backend" | "database" | "tools" | "other";
  niveau: number; // 1-5
  icone?: string;
}

const competenceSchema = new Schema<ICompetence>(
  {
    nom: { type: String, required: true, unique: true },
    categorie: {
      type: String,
      enum: ["frontend", "backend", "database", "tools", "other"],
      required: true,
    },
    niveau: { type: Number, min: 1, max: 5, required: true },
    icone: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompetence>("Competence", competenceSchema);
