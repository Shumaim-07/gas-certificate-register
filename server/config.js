import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })
dotenv.config({ path: path.join(__dirname, '.env') })

export const PORT = process.env.PORT || 3001
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gas-cert'
export const JWT_SECRET = process.env.JWT_SECRET || 'gas-cert-dev-secret-change-in-production'
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Arshad'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'