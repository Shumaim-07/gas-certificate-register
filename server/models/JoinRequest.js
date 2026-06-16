import mongoose from 'mongoose'

const joinRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, default: '', trim: true },
    status: { type: String, enum: ['pending', 'dismissed'], default: 'pending' },
  },
  { timestamps: true }
)

export const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema)
