import mongoose from "mongoose";

const engineerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    pinHash: { type: String, default: null },
    pinSet: { type: Boolean, default: false },

    gasSafeRegisterNumber: { type: String, default: "" },
    engineerName: { type: String, default: "" },
    gasSafeLicenceNumber: { type: String, default: "" },
    businessName: { type: String, default: "" },

    houseAddress: { type: String, default: "" },
    area: { type: String, default: "" },
    postCode: { type: String, default: "" },

    contactNumber: { type: String, default: "" },
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export function engineerToJson(doc) {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    pinSet: doc.pinSet,
    gasSafeRegisterNumber: doc.gasSafeRegisterNumber,
    engineerName: doc.engineerName,
    gasSafeLicenceNumber: doc.gasSafeLicenceNumber,
    businessName: doc.businessName,
    houseAddress: doc.houseAddress,
    area: doc.area,
    postCode: doc.postCode,
    contactNumber: doc.contactNumber,
    profileComplete: doc.profileComplete,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const Engineer = mongoose.model("Engineer", engineerSchema);
