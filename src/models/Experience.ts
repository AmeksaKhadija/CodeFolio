import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  poste: string;
  entreprise: string;
  localisation?: string;
  dateDebut: Date;
  dateFin?: Date;
  enCours: boolean;
  description: string;
  competences: mongoose.Types.ObjectId[];
}

const experienceSchema = new Schema<IExperience>({
  poste: { type: String, required: true },
  entreprise: { type: String, required: true },
  localisation: String,
  dateDebut: { type: Date, required: true },
  dateFin: Date,
  enCours: { type: Boolean, default: false },
  description: { type: String, required: true },
  competences: [{ type: Schema.Types.ObjectId, ref: 'Competence' }]
}, {
  timestamps: true
});

export default mongoose.model<IExperience>('Experience', experienceSchema);