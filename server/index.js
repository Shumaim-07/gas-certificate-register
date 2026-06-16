import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { connectDb, ensureDbConnected, isDbConnected } from './db.js'
import { CLIENT_URLS, NODE_ENV, PORT } from './config.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import engineerRoutes from './routes/engineer.js'
import certificateRoutes from './routes/certificates.js'
import requestRoutes from './routes/requests.js'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true)
    }

    const normalizedOrigin = origin.replace(/\/+$/, '')
    const developmentOrigin = NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(normalizedOrigin)
    if (developmentOrigin || CLIENT_URLS.includes(normalizedOrigin)) {
      return callback(null, true)
    }

    return callback(new Error('Origin not allowed by CORS'))
  },
}))
app.use(express.json({ limit: '2mb' }))

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
app.use('/api/requests', requestRoutes)

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

async function start() {
  try {
    await connectDb()
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`API server listening on port ${PORT}`)
    })

    async function shutdown(signal) {
      console.log(`${signal} received; shutting down`)
      server.close(async () => {
        await mongoose.disconnect()
        process.exit(0)
      })
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  } catch (err) {
    console.error('Server startup failed:', err.message)
    process.exit(1)
  }
}

start()
