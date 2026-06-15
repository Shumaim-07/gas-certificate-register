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

router.put('/:id', async (req, res) => {
  const certificate = await Certificate.findOne({ _id: req.params.id, engineerId: req.user.id })
  if (!certificate) {
    return res.status(404).json({ error: 'Certificate not found' })
  }

  if (req.body.certificateRef !== undefined) {
    certificate.certificateRef = req.body.certificateRef
  }
  if (req.body.data !== undefined) {
    certificate.data = req.body.data
  }

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
