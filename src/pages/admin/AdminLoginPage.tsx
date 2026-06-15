import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'

const ADMIN_NAME = 'Arshad'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { loginAdmin } = useAuth()
  const [pinSet, setPinSet] = useState<boolean | null>(null)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    setError(null)
    try {
      const status = await api.getAdminStatus()
      setPinSet(status.pinSet)
    } catch {
      setPinSet(false)
    }
  }, [])

  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  const handleSetPin = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.setAdminPin(pin, confirmPin)
      loginAdmin(result.token, result.username)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set PIN')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.adminLogin(pin)
      loginAdmin(result.token, result.username)
      navigate('/admin')
    } catch (err) {
      const e = err as Error & { code?: string }
      if (e.code === 'PIN_NOT_SET') {
        setPinSet(false)
        setPin('')
        return
      }
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (pinSet === null) {
    return (
      <div className="page-center">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  return (
    <div className="page-center">
      <div className="page-card auth-card">
        <div className="page-header">
          <h1>{pinSet ? 'Admin Login' : 'Create Admin PIN'}</h1>
          <p>
            {pinSet
              ? 'Sign in to manage engineers and User IDs.'
              : 'Welcome Arshad — create your PIN to access the admin panel.'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-grid single-col">
          <label className="form-field full-width">
            <span>Username</span>
            <input type="text" value={ADMIN_NAME} readOnly className="input-readonly" />
          </label>

          <label className="form-field full-width">
            <span>{pinSet ? 'PIN' : 'Create PIN'}</span>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="4–6 digit PIN"
              maxLength={6}
              inputMode="numeric"
              autoComplete={pinSet ? 'current-password' : 'new-password'}
            />
          </label>

          {!pinSet && (
            <label className="form-field full-width">
              <span>Confirm PIN</span>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Re-enter PIN"
                maxLength={6}
                inputMode="numeric"
                autoComplete="new-password"
              />
            </label>
          )}
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={pinSet ? handleLogin : handleSetPin}
          disabled={loading}
        >
          {loading ? 'Please wait…' : pinSet ? 'Login' : 'Save PIN & Open Admin Panel'}
        </button>

        <p className="auth-footer">
          Engineer? <Link to="/login">Go to Engineer Login</Link>
        </p>
      </div>
    </div>
  )
}
