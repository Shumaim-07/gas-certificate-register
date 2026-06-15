import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { sanitizeUserIdInput, validateUserId } from '../../utils/userId'

export function CreateUserIdPage() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [createdUserId, setCreatedUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null)

  useEffect(() => {
    const validationError = validateUserId(userId)
    if (!userId.trim()) {
      setAvailability('idle')
      setAvailabilityMessage(null)
      return
    }
    if (validationError) {
      setAvailability('invalid')
      setAvailabilityMessage(validationError)
      return
    }

    setAvailability('checking')
    setAvailabilityMessage('Checking availability…')

    const timer = setTimeout(() => {
      api.adminCheckUserId(userId)
        .then((result) => {
          if (result.available) {
            setAvailability('available')
            setAvailabilityMessage('This User ID is available')
          } else {
            setAvailability('taken')
            setAvailabilityMessage(result.error ?? 'This User ID is already taken')
          }
        })
        .catch((err) => {
          setAvailability('invalid')
          setAvailabilityMessage(err instanceof Error ? err.message : 'Could not check User ID')
        })
    }, 400)

    return () => clearTimeout(timer)
  }, [userId])

  const handleSubmit = async () => {
    const validationError = validateUserId(userId)
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError(null)
    try {
      const created = await api.adminCreateEngineer({ userId })
      setCreatedUserId(created.userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create User ID')
    } finally {
      setSaving(false)
    }
  }

  if (createdUserId) {
    return (
      <div className="page-with-nav">
        <div className="page-card success-card">
          <div className="page-header">
            <h1>User ID Created</h1>
            <p>Tell the engineer to login and create their own password.</p>
          </div>

          <div className="success-highlight">
            <span>User ID</span>
            <strong>{createdUserId}</strong>
          </div>

          <ol className="instruction-list">
            <li>Go to <strong>Engineer Login</strong></li>
            <li>Enter User ID: <strong>{createdUserId}</strong></li>
            <li>Create their own password</li>
          </ol>

          <div className="success-actions">
            <button type="button" className="primary-btn" onClick={() => navigate('/admin')}>
              Back to Admin Panel
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setCreatedUserId(null)
                setUserId('')
                setAvailability('idle')
                setAvailabilityMessage(null)
                setError(null)
              }}
            >
              Create Another User ID
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-with-nav">
      <Link to="/admin" className="back-link">← Back to Admin Panel</Link>
      <div className="page-card engineer-form-card">
        <div className="page-header">
          <h1>Create User ID</h1>
          <p>Enter a unique User ID using letters and numbers. The engineer will set their password on first login.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-grid single-col">
          <label className="form-field full-width">
            <span>User ID</span>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(sanitizeUserIdInput(e.target.value))}
              placeholder="e.g. JOHN123 or ENG001"
              maxLength={20}
            />
            {availabilityMessage && (
              <span className={`availability-hint ${availability}`}>{availabilityMessage}</span>
            )}
          </label>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={handleSubmit}
          disabled={saving || availability !== 'available'}
        >
          {saving ? 'Creating…' : 'Create User ID'}
        </button>
      </div>
    </div>
  )
}
