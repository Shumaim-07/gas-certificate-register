import { Router } from 'express'
import { Engineer, engineerToJson } from '../models/Engineer.js'
import { requireAuth } from '../middleware/auth.js'
import { updateProfileComplete } from './auth.js'

const router = Router()

router.use(requireAuth(['engineer']))

router.get('/profile', async (req, res) => {
  const engineer = await Engineer.findById(req.user.id)
  if (!engineer) {
    return res.status(404).json({ error: 'Engineer not found' })
  }
  res.json(engineerToJson(engineer))
})

router.put('/profile', async (req, res) => {
  const engineer = await Engineer.findById(req.user.id)
  if (!engineer) {
    return res.status(404).json({ error: 'Engineer not found' })
  }

 const required = [
  'gasSafeRegisterNumber',
  'engineerName',
  'gasSafeLicenceNumber',
  'businessName',
  'houseAddress',
  'area',
  'postCode',
  'contactNumber',
]

  for (const field of required) {
    if (!req.body[field]?.trim()) {
      return res.status(400).json({ error: `${field} is required` })
    }
   engineer[field] = (req.body[field] || '').toString().trim()
  }

  updateProfileComplete(engineer)
  await engineer.save()
  res.json(engineerToJson(engineer))
})

export default router
