import mongoose from 'mongoose'

const joinRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true }, // Changed: required true
    gasSafeNumber: { type: String, required: true, trim: true }, // NEW FIELD
    status: { type: String, enum: ['pending', 'dismissed'], default: 'pending' },
  },
  { timestamps: true }
)

export const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema)