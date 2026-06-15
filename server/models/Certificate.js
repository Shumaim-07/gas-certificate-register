import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Engineer', required: true },
    certificateRef: { type: String, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
)

export function certificateToJson(doc) {
  return {
    id: doc._id.toString(),
    engineerId: doc.engineerId.toString(),
    certificateRef: doc.certificateRef,
    data: doc.data,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export const Certificate = mongoose.model('Certificate', certificateSchema)
