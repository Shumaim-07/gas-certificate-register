import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })
dotenv.config({ path: path.join(__dirname, '.env') })

export const PORT = process.env.PORT || 3001
// REMOVE the localhost fallback - use only Railway's variable
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET || 'gas-cert-dev-secret-change-in-production'
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Arshad'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456'

// Add a check to ensure MONGODB_URI is set
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!')
  process.exit(1)
}