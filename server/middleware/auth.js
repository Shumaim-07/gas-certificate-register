import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function requireAuth(roles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    try {
      const token = header.slice(7)
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Access denied' })
      }

      next()
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }
}
