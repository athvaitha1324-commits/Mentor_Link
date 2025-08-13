import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['mentor', 'mentee', 'hod'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    department: { type: String, required: true },
    designation: { type: String },
    year: { type: String, enum: ['1st', '2nd', '3rd', '4th'] },

    hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    mentorIdString: { type: String },
    menteeIdString: { type: String },
    teamIdString: { type: String },

    notes: { type: Map, of: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);