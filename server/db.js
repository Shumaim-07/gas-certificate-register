import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ADMIN_INITIAL_PIN, MONGODB_URI, ADMIN_USERNAME } from './config.js'
import { Admin } from './models/Admin.js'

let connecting = false

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

export async function getOrCreateAdmin() {
  let admin = await Admin.findOne({ username: ADMIN_USERNAME })
  if (!admin) {
    admin = await Admin.create({ username: ADMIN_USERNAME, pinSet: false })
    console.log(`Admin account created — username: ${ADMIN_USERNAME}`)
  }
  if (!admin.pinSet && ADMIN_INITIAL_PIN) {
    admin.pinHash = await bcrypt.hash(ADMIN_INITIAL_PIN, 10)
    admin.pinSet = true
    await admin.save()
    console.log('Initial admin PIN configured')
  }
  return admin
}

async function seedAdmin() {
  await getOrCreateAdmin()
}

export async function connectDb() {
  if (isDbConnected()) {
    await seedAdmin()
    return
  }

  if (connecting) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!connecting || isDbConnected()) {
          clearInterval(interval)
          resolve(undefined)
        }
      }, 100)
    })
    if (isDbConnected()) return
  }

  connecting = true
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
    console.log('Connected to MongoDB')
    await seedAdmin()
  } finally {
    connecting = false
  }
}

export async function ensureDbConnected() {
  if (isDbConnected()) return
  await connectDb()
}
