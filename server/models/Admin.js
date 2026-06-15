import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    pinHash: { type: String, default: null },
    pinSet: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Admin = mongoose.model('Admin', adminSchema)
