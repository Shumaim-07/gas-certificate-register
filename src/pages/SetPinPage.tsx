import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export function SetPinPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginEngineer } = useAuth()
  const userId = (location.state as { userId?: string } | null)?.userId ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!userId) {
    return (
      <div className="page-center">
        <div className="page-card auth-card">
          <p className="muted">No User ID provided.</p>
          <Link to="/login" className="primary-btn">Back to Login</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.setEngineerPin(userId, password, confirmPassword)
      loginEngineer(result.token, result.engineer!)
      navigate(result.needsProfile ? '/setup-profile' : '/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="eng-form-page">
      <div className="eng-pin-card">
        <div className="eng-pin-icon">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#F4EA03" />
            <polyline points="6,14 11,19 22,9" stroke="#3D3431" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="eng-pin-title">Create Your Password</h1>
        <p className="eng-pin-sub">
          User ID: <strong>{userId}</strong><br />
          Choose a 4–6 digit password for future logins.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="eng-pin-fields">
          <div className="eng-field eng-field--full">
            <label htmlFor="pin-password">Password</label>
            <input
              id="pin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              autoComplete="new-password"
              placeholder="4–6 digits"
            />
          </div>
          <div className="eng-field eng-field--full">
            <label htmlFor="pin-confirm">Confirm Password</label>
            <input
              id="pin-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              autoComplete="new-password"
              placeholder="Repeat digits"
            />
          </div>
        </div>

        <button type="button" className="eng-submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : 'Save Password & Continue'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
          <Link to="/login" className="eng-back-link">← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
