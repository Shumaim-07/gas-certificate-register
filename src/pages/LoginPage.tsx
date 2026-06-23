import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { sanitizeUserIdInput } from '../utils/userId'
import { useAuth } from '../context/AuthContext'
import { RequestModal } from '../components/RequestModal'
import flameImg from '../assets/flame.png'

function LogoMark() {
  return (
    <div className="lp-login-logo">
      <img src={flameImg} width="32" height="32" alt="" />
      <span>GasCertify UK</span>
    </div>
  )
}

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
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [frozenInfo, setFrozenInfo] = useState<{ message: string; reason: string | null } | null>(null)

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
      const e = err as Error & { code?: string; userId?: string; reason?: string }
      if (e.code === 'PIN_NOT_SET' && e.userId) {
        navigate('/set-pin', { state: { userId: e.userId } })
        return
      }
      if (e.code === 'ACCOUNT_FROZEN') {
        setFrozenInfo({ message: e.message, reason: e.reason ?? null })
        return
      }
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      step === 'userid' ? handleCheckUser() : handleLogin()
    }
  }

  return (
    <div className="login-split">
      {showRequestModal && <RequestModal onClose={() => setShowRequestModal(false)} />}

      {/* ── LEFT PANEL ── */}
      <div className="login-left">
        <LogoMark />

        <div className="login-left-body">
          <h1 className="login-left-h1">
            Welcome back.
          </h1>
          <p className="login-left-sub">
            Your next <span className="login-cp12">CP12</span> is one tap away.
          </p>
          <p className="login-left-desc">
            Pick up where you left off — properties,<br />
            appliances and signatures, all ready when you are.
          </p>
        </div>

        <p className="login-left-trust">TRUSTED BY UK GAS SAFE ENGINEERS</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-right">
        {frozenInfo ? (
          <div className="login-frozen-card">
            <div className="login-frozen-icon">🔒</div>
            <h2 className="login-frozen-title">Account Suspended</h2>
            <p className="login-frozen-msg">{frozenInfo.message}</p>
            {frozenInfo.reason === 'payment_not_submitted' && (
              <p className="login-frozen-hint">Once payment is confirmed by your administrator, your account will be reactivated.</p>
            )}
            {frozenInfo.reason === 'rule_violation' && (
              <p className="login-frozen-hint">Please contact your administrator to appeal this decision.</p>
            )}
            <button
              type="button"
              className="login-frozen-back"
              onClick={() => { setFrozenInfo(null); setPassword(''); setError(null) }}
            >
              ← Back to login
            </button>
          </div>
        ) : (
          <>
        <div className="login-card">
          <h2 className="login-card-h2">Log in</h2>
          <p className="login-card-sub">Engineer &amp; admin access.</p>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <div className="login-form">
            {step === 'userid' ? (
              <div className="login-field">
                <label htmlFor="login-userid">USER ID</label>
                <input
                  id="login-userid"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(sanitizeUserIdInput(e.target.value))}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. ENG001"
                  maxLength={20}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="login-back"
                  onClick={() => { setStep('userid'); setPassword(''); setError(null) }}
                >
                  ← {checkedUserId}
                </button>
                <div className="login-field">
                  <label htmlFor="login-password">PASSWORD</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>
              </>
            )}

            <button
              type="button"
              className="login-btn"
              onClick={step === 'userid' ? handleCheckUser : handleLogin}
              disabled={loading || serverOk === false}
            >
              {loading
                ? 'Please wait…'
                : step === 'userid'
                  ? 'Continue'
                  : 'Log in'}
            </button>
          </div>

          <div className="login-divider"><span>OR</span></div>

          <p className="login-signup-text">
            New engineer?{' '}
            <button
              type="button"
              className="login-signup-link"
              onClick={() => setShowRequestModal(true)}
            >
              Get started
            </button>
          </p>
        </div>

        <p className="login-footer-note">
          Protected sign-in. Only Gas Safe registered engineers can issue certificates.
        </p>
          </>
        )}
      </div>
    </div>
  )
}
