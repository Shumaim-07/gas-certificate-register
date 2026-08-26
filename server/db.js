import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ADMIN_INITIAL_PIN, MONGODB_URI, ADMIN_USERNAME, NODE_ENV } from './config.js'
import { Admin } from './models/Admin.js'

/** Close Atlas connection before Railway's ~10 min serverless sleep window. */
const IDLE_DISCONNECT_MS = 8 * 60 * 1000

let connecting = false
let idleTimer = null

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

function clearIdleTimer() {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }
}

export function touchActivity() {
  clearIdleTimer()
}

export function scheduleIdleDisconnect() {
  if (NODE_ENV !== 'production') return

  clearIdleTimer()
  idleTimer = setTimeout(async () => {
    idleTimer = null
    if (!isDbConnected()) return

    try {
      await mongoose.disconnect()
      console.log('MongoDB disconnected after idle period')
    } catch (err) {
      console.error('Idle disconnect failed:', err.message)
    }
  }, IDLE_DISCONNECT_MS)
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
  touchActivity()

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
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 60_000,
      socketTimeoutMS: 45_000,
    })
    console.log('Connected to MongoDB')
    await seedAdmin()
  } finally {
    connecting = false
  }
}

export async function ensureDbConnected() {
  touchActivity()
  if (isDbConnected()) return
  await connectDb()
}

export async function disconnectDb() {
  clearIdleTimer()
  if (!isDbConnected()) return
  await mongoose.disconnect()
}
