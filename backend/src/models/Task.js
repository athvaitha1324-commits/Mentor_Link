import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },

    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teamIdString: { type: String },

    status: { type: String, enum: ['Assigned', 'Scheduled', 'Completed'], default: 'Assigned' },
    meetingLink: { type: String },
    attachment: {
      driveFileId: String,
      driveLink: String,
      originalName: String,
      mimeType: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);