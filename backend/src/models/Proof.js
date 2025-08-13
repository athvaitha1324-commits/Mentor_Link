import mongoose from 'mongoose';

const proofSchema = new mongoose.Schema(
  {
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    teamIdString: { type: String },

    date: { type: Date, default: () => new Date() },
    driveFileId: { type: String },
    driveLink: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Proof', proofSchema);