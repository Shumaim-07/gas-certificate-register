import { Router } from 'express'
import { Engineer, engineerToJson } from '../models/Engineer.js'
import { Certificate } from '../models/Certificate.js'
import { requireAuth } from '../middleware/auth.js'
import { normalizeUserId, validateUserId } from '../utils/userId.js'

const router = Router()

router.use(requireAuth(['admin']))

function handleError(res, err, fallback = 'Something went wrong') {
  console.error(err)
  if (err.code === 11000) {
    return res.status(400).json({ error: 'This User ID is already taken' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  return res.status(500).json({ error: err.message || fallback })
}

router.get('/engineers/check/:userId', async (req, res) => {
  try {
    const userId = normalizeUserId(req.params.userId ?? '')
    const validationError = validateUserId(userId)
    if (validationError) {
      return res.status(400).json({ available: false, error: validationError })
    }

    const existing = await Engineer.findOne({ userId })
    res.json({
      userId,
      available: !existing,
      error: existing ? 'This User ID is already taken' : null,
    })
  } catch (err) {
    handleError(res, err, 'Could not check User ID')
  }
})

router.get('/engineers', async (_req, res) => {
  try {
    const engineers = await Engineer.find().sort({ createdAt: -1 })
    res.json(engineers.map(engineerToJson))
  } catch (err) {
    handleError(res, err, 'Could not load engineers')
  }
})

router.post('/engineers', async (req, res) => {
  try {
    const userId = normalizeUserId(req.body.userId ?? '')
    const validationError = validateUserId(userId)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const existing = await Engineer.findOne({ userId })
    if (existing) {
      return res.status(400).json({ error: 'This User ID is already taken. Choose a different one.' })
    }

    const engineer = await Engineer.create({ userId })
    res.status(201).json(engineerToJson(engineer))
  } catch (err) {
    handleError(res, err, 'Could not create User ID')
  }
})

router.delete('/engineers/:id', async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.params.id)
    if (!engineer) {
      return res.status(404).json({ error: 'Engineer not found' })
    }

    await Certificate.deleteMany({ engineerId: engineer._id })
    await engineer.deleteOne()
    res.status(204).send()
  } catch (err) {
    handleError(res, err, 'Could not delete engineer')
  }
})

router.patch('/engineers/:id/freeze', async (req, res) => {
  try {
    const { reason } = req.body
    if (!['rule_violation', 'payment_not_submitted'].includes(reason)) {
      return res.status(400).json({ error: 'Invalid freeze reason. Must be rule_violation or payment_not_submitted.' })
    }
    const engineer = await Engineer.findByIdAndUpdate(
      req.params.id,
      { frozen: true, freezeReason: reason },
      { new: true },
    )
    if (!engineer) return res.status(404).json({ error: 'Engineer not found' })
    res.json(engineerToJson(engineer))
  } catch (err) {
    handleError(res, err, 'Could not freeze engineer')
  }
})

router.patch('/engineers/:id/unfreeze', async (req, res) => {
  try {
    const engineer = await Engineer.findByIdAndUpdate(
      req.params.id,
      { frozen: false, freezeReason: null },
      { new: true },
    )
    if (!engineer) return res.status(404).json({ error: 'Engineer not found' })
    res.json(engineerToJson(engineer))
  } catch (err) {
    handleError(res, err, 'Could not unfreeze engineer')
  }
})

export default router
