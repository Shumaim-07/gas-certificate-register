import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { connectDb, ensureDbConnected, isDbConnected } from './db.js'
import { PORT } from './config.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import engineerRoutes from './routes/engineer.js'
import certificateRoutes from './routes/certificates.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    db: isDbConnected(),
    version: 2,
    message: isDbConnected() ? 'Backend is running' : 'Backend running but database not connected',
  })
})

app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next()
  if (!isDbConnected()) {
    try {
      await ensureDbConnected()
    } catch {
      return res.status(503).json({
        error: 'Database not connected. Start MongoDB and try again.',
      })
    }
  }
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/engineer', engineerRoutes)
app.use('/api/certificates', certificateRoutes)

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

async function start() {
  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
  })

  try {
    await connectDb()
  } catch (err) {
    console.error('\nMongoDB connection failed — API will return errors until DB is available.')
    console.error(`URI: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gas-cert'}`)
    if (err.message?.includes('ECONNREFUSED') || err.name === 'MongooseServerSelectionError') {
      console.error('Start MongoDB: open Services → start "MongoDB Server", or run: net start MongoDB')
    } else {
      console.error(err.message)
    }
  }
}

start()

process.on('SIGINT', async () => {
  await mongoose.disconnect()
  process.exit(0)
})
