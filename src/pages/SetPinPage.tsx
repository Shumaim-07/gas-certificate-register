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
    <div className="page-center">
      <div className="page-card auth-card">
        <div className="page-header">
          <h1>Create Your Password</h1>
          <p>
            User ID: <strong>{userId}</strong> — choose a 4–6 digit password for future logins.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-grid single-col">
          <label className="form-field full-width">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              autoComplete="new-password"
            />
          </label>
          <label className="form-field full-width">
            <span>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              autoComplete="new-password"
            />
          </label>
        </div>

        <button type="button" className="primary-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : 'Save Password & Continue'}
        </button>

        <p className="auth-footer">
          <Link to="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
