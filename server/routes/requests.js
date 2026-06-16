import { Router } from 'express'
import { JoinRequest } from '../models/JoinRequest.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase()
    const name = (req.body.name || '').trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' })
    }

    const existing = await JoinRequest.findOne({ email, status: 'pending' })
    if (existing) {
      return res.status(200).json({ message: 'already_submitted' })
    }

    await JoinRequest.create({ email, name })
    res.status(201).json({ message: 'submitted' })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not submit request' })
  }
})

router.get('/', requireAuth(['admin']), async (_req, res) => {
  try {
    const requests = await JoinRequest.find({ status: 'pending' }).sort({ createdAt: -1 })
    res.json(
      requests.map((r) => ({
        id: r._id.toString(),
        email: r.email,
        name: r.name,
        createdAt: r.createdAt,
      }))
    )
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not load requests' })
  }
})

router.delete('/:id', requireAuth(['admin']), async (req, res) => {
  try {
    await JoinRequest.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not dismiss request' })
  }
})

export default router
