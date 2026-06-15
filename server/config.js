import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })
dotenv.config({ path: path.join(__dirname, '.env') })

export const PORT = process.env.PORT || 8080
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL
export const JWT_SECRET = process.env.JWT_SECRET || 'gas-cert-dev-secret-change-in-production'
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Arshad'
export const ADMIN_INITIAL_PIN = process.env.ADMIN_INITIAL_PIN || ''
export const CLIENT_URLS = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean)

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required')
}

if (NODE_ENV === 'production' && JWT_SECRET === 'gas-cert-dev-secret-change-in-production') {
  throw new Error('JWT_SECRET must be set to a secure random value in production')
}

if (NODE_ENV === 'production' && CLIENT_URLS.length === 0) {
  throw new Error('CLIENT_URL must contain your Netlify site URL in production')
}

if (NODE_ENV === 'production' && !/^\d{4,6}$/.test(ADMIN_INITIAL_PIN)) {
  throw new Error('ADMIN_INITIAL_PIN must be 4 to 6 digits in production')
}
