import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { sanitizeUserIdInput } from '../utils/userId'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { loginEngineer } = useAuth()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'userid' | 'login'>('userid')
  const [checkedUserId, setCheckedUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverOk, setServerOk] = useState<boolean | null>(null)

  useEffect(() => {
    api.healthCheck()
      .then((h) => {
        setServerOk(h.db)
        if (!h.db) {
          setError('MongoDB is not connected. Ask admin to start MongoDB and restart the server.')
        }
      })
      .catch(() => {
        setServerOk(false)
        setError('Backend not running. Open terminal and run: npm run dev')
      })
  }, [])

  const handleCheckUser = async () => {
    if (!userId.trim()) {
      setError('Please enter your User ID')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const check = await api.checkEngineerUser(userId.trim())
      if (!check.pinSet) {
        navigate('/set-pin', { state: { userId: check.userId } })
        return
      }
      setCheckedUserId(check.userId)
      setStep('login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'User ID not found')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!password) {
      setError('Please enter your password')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await api.engineerLogin(checkedUserId, password)
      loginEngineer(result.token, result.engineer!)
      navigate(result.needsProfile ? '/setup-profile' : '/dashboard')
    } catch (err) {
      const e = err as Error & { code?: string; userId?: string }
      if (e.code === 'PIN_NOT_SET' && e.userId) {
        navigate('/set-pin', { state: { userId: e.userId } })
        return
      }
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="page-card auth-card">
        <div className="page-header">
          <h1>Engineer Login</h1>
          <p>
            {step === 'userid'
              ? 'Enter the User ID created by your admin.'
              : `User ID: ${checkedUserId} — enter your password.`}
          </p>
        </div>

        {serverOk === false && error && <div className="alert alert-error">{error}</div>}
        {serverOk === true && error && <div className="alert alert-error">{error}</div>}

        <div className="form-grid single-col">
          {step === 'userid' ? (
            <label className="form-field full-width">
              <span>User ID</span>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(sanitizeUserIdInput(e.target.value))}
                placeholder="e.g. JOHN123"
                maxLength={20}
                autoComplete="username"
              />
            </label>
          ) : (
            <label className="form-field full-width">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                maxLength={6}
                inputMode="numeric"
                autoComplete="current-password"
              />
            </label>
          )}
        </div>

        {step === 'login' && (
          <button
            type="button"
            className="link-btn back-step-btn"
            onClick={() => { setStep('userid'); setPassword(''); setError(null) }}
          >
            ← Use different User ID
          </button>
        )}

        <button
          type="button"
          className="primary-btn"
          onClick={step === 'userid' ? handleCheckUser : handleLogin}
          disabled={loading || serverOk === false}
        >
          {loading ? 'Please wait…' : step === 'userid' ? 'Continue' : 'Login'}
        </button>

        <p className="auth-footer">
          Admin? <Link to="/admin/login">Go to Admin Panel</Link>
        </p>
      </div>
    </div>
  )
}
