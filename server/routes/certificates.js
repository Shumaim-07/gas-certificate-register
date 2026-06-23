import { Router } from 'express'
import { Certificate, certificateToJson } from '../models/Certificate.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth(['engineer']))

router.get('/', async (req, res) => {
  const certificates = await Certificate.find({ engineerId: req.user.id }).sort({ createdAt: -1 })
  res.json(certificates.map(certificateToJson))
})

router.get('/:id', async (req, res) => {
  const certificate = await Certificate.findOne({ _id: req.params.id, engineerId: req.user.id })
  if (!certificate) {
    return res.status(404).json({ error: 'Certificate not found' })
  }
  res.json(certificateToJson(certificate))
})

router.post('/', async (req, res) => {
  const { certificateRef, data } = req.body
  if (!data) {
    return res.status(400).json({ error: 'Certificate data is required' })
  }

  const certificate = await Certificate.create({
    engineerId: req.user.id,
    certificateRef: certificateRef ?? '',
    data,
  })

  res.status(201).json(certificateToJson(certificate))
})

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
const MAX_EDITS = 3

router.put('/:id', async (req, res) => {
  const certificate = await Certificate.findOne({ _id: req.params.id, engineerId: req.user.id })
  if (!certificate) {
    return res.status(404).json({ error: 'Certificate not found' })
  }

  const age = Date.now() - new Date(certificate.createdAt).getTime()
  if (age > ONE_WEEK_MS) {
    return res.status(403).json({ error: 'This certificate can no longer be edited. The 1-week edit window has expired.', code: 'EDIT_WINDOW_EXPIRED' })
  }

  const editCount = certificate.editCount ?? 0
  if (editCount >= MAX_EDITS) {
    return res.status(403).json({ error: 'This certificate has reached the maximum of 3 edits.', code: 'EDIT_LIMIT_REACHED' })
  }

  if (req.body.certificateRef !== undefined) {
    certificate.certificateRef = req.body.certificateRef
  }
  if (req.body.data !== undefined) {
    certificate.data = req.body.data
  }
  certificate.editCount = editCount + 1

  await certificate.save()
  res.json(certificateToJson(certificate))
})

router.delete('/:id', async (req, res) => {
  const certificate = await Certificate.findOne({ _id: req.params.id, engineerId: req.user.id })
  if (!certificate) {
    return res.status(404).json({ error: 'Certificate not found' })
  }

  await certificate.deleteOne()
  res.status(204).send()
})

export default router
