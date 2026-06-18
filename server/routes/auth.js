import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { rateLimit } from 'express-rate-limit'
import { Engineer, engineerToJson } from '../models/Engineer.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import { ADMIN_USERNAME } from '../config.js'
import { getOrCreateAdmin } from '../db.js'
import { normalizeUserId } from '../utils/userId.js'

const router = Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
})

function validatePin(pin) {
  if (!/^\d{4,6}$/.test(pin)) {
    return 'PIN must be 4–6 digits'
  }
  return null
}

function profileFieldsComplete(engineer) {
  return Boolean(
    engineer.gasSafeRegisterNumber?.trim() &&
    engineer.engineerName?.trim() &&
    engineer.gasSafeLicenceNumber?.trim() &&
    engineer.businessName?.trim() &&
    engineer.houseAddress?.trim() &&
    engineer.area?.trim() &&
    engineer.postCode?.trim() &&
    engineer.contactNumber?.trim(),
  )
}

router.get('/admin/status', async (_req, res) => {
  const admin = await getOrCreateAdmin()
  res.json({ username: admin.username, pinSet: admin.pinSet })
})

router.post('/admin/set-pin', authLimiter, async (req, res) => {
  const { pin, confirmPin } = req.body

  if (!pin || !confirmPin) {
    return res.status(400).json({ error: 'PIN and confirmation are required' })
  }

  if (pin !== confirmPin) {
    return res.status(400).json({ error: 'PINs do not match' })
  }

  const pinError = validatePin(pin)
  if (pinError) {
    return res.status(400).json({ error: pinError })
  }

  const admin = await getOrCreateAdmin()

  if (admin.pinSet) {
    return res.status(400).json({ error: 'PIN already set. Please login.' })
  }

  admin.pinHash = await bcrypt.hash(pin, 10)
  admin.pinSet = true
  await admin.save()

  const token = signToken({ role: 'admin', id: admin._id.toString(), username: admin.username })
  res.json({ token, role: 'admin', username: admin.username })
})

router.post('/admin/login', authLimiter, async (req, res) => {
  const { pin } = req.body

  if (!pin) {
    return res.status(400).json({ error: 'PIN is required' })
  }

  const admin = await getOrCreateAdmin()

  if (!admin.pinSet || !admin.pinHash) {
    return res.status(403).json({ error: 'PIN not set yet', code: 'PIN_NOT_SET' })
  }

  const valid = await bcrypt.compare(pin, admin.pinHash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid PIN' })
  }

  const token = signToken({ role: 'admin', id: admin._id.toString(), username: admin.username })
  res.json({ token, role: 'admin', username: admin.username })
})

router.post('/engineer/check-user', authLimiter, async (req, res) => {
  const userId = normalizeUserId(req.body.userId ?? '')
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  const engineer = await Engineer.findOne({ userId })
  if (!engineer) {
    return res.status(404).json({ error: 'User ID not found. Contact your admin.' })
  }

  res.json({ userId: engineer.userId, pinSet: engineer.pinSet })
})

router.post('/engineer/set-pin', authLimiter, async (req, res) => {
  const userId = normalizeUserId(req.body.userId ?? '')
  const { pin, confirmPin } = req.body

  if (!userId || !pin || !confirmPin) {
    return res.status(400).json({ error: 'User ID, password, and confirmation are required' })
  }

  if (pin !== confirmPin) {
    return res.status(400).json({ error: 'Passwords do not match' })
  }

  const pinError = validatePin(pin)
  if (pinError) {
    return res.status(400).json({ error: pinError })
  }

  const engineer = await Engineer.findOne({ userId })
  if (!engineer) {
    return res.status(404).json({ error: 'User ID not found' })
  }

  if (engineer.pinSet) {
    return res.status(400).json({ error: 'Password already set. Please login.' })
  }

  engineer.pinHash = await bcrypt.hash(pin, 10)
  engineer.pinSet = true
  await engineer.save()

  const token = signToken({ role: 'engineer', id: engineer._id.toString(), userId: engineer.userId })
  res.json({
    token,
    role: 'engineer',
    engineer: engineerToJson(engineer),
    needsProfile: !engineer.profileComplete,
  })
})

router.post('/engineer/login', authLimiter, async (req, res) => {
  const userId = normalizeUserId(req.body.userId ?? '')
  const { pin } = req.body

  if (!userId || !pin) {
    return res.status(400).json({ error: 'User ID and password are required' })
  }

  const engineer = await Engineer.findOne({ userId })
  if (!engineer) {
    return res.status(401).json({ error: 'Invalid User ID or password' })
  }

  if (!engineer.pinSet || !engineer.pinHash) {
    return res.status(403).json({ error: 'Password not set yet', code: 'PIN_NOT_SET', userId: engineer.userId })
  }

  const valid = await bcrypt.compare(pin, engineer.pinHash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid User ID or password' })
  }

  if (engineer.frozen) {
    const reasonMessages = {
      rule_violation: 'Your account has been suspended due to a rule violation. Please contact the administrator.',
      payment_not_submitted: 'Your account has been suspended because payment was not submitted. Please pay to regain access.',
    }
    const msg = reasonMessages[engineer.freezeReason] ?? 'Your account has been suspended. Please contact the administrator.'
    return res.status(403).json({ error: msg, code: 'ACCOUNT_FROZEN', reason: engineer.freezeReason })
  }

  const token = signToken({ role: 'engineer', id: engineer._id.toString(), userId: engineer.userId })
  res.json({
    token,
    role: 'engineer',
    engineer: engineerToJson(engineer),
    needsProfile: !engineer.profileComplete,
  })
})

router.get('/me', requireAuth(), async (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ role: 'admin', username: req.user.username })
  }

  const engineer = await Engineer.findById(req.user.id)
  if (!engineer) {
    return res.status(404).json({ error: 'Engineer not found' })
  }

  res.json({
    role: 'engineer',
    engineer: engineerToJson(engineer),
    needsProfile: !engineer.profileComplete,
  })
})

export function updateProfileComplete(engineer) {
  engineer.profileComplete = profileFieldsComplete(engineer)
  return engineer.profileComplete
}

export default router
