import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export function RequestModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [gasSafeNumber, setGasSafeNumber] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await api.submitJoinRequest(email, name, gasSafeNumber)
      setStatus(res.message === 'already_submitted' ? 'duplicate' : 'success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="req-modal-overlay" onClick={onClose}>
      <div className="req-modal" onClick={(e) => e.stopPropagation()}>
        <button className="req-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {status === 'success' ? (
          <div className="req-modal-success">
            <div className="req-success-icon">✓</div>
            <h2>Request sent!</h2>
            <p>
              We've received your request. Our team will create your account
              and send your login details to <strong>{email}</strong>.
            </p>
            <button className="lp-btn-dark" onClick={onClose} style={{ marginTop: '1.5rem' }}>
              Done
            </button>
          </div>
        ) : status === 'duplicate' ? (
          <div className="req-modal-success">
            <div className="req-success-icon" style={{ background: '#F4EA03', color: '#3D3431' }}>!</div>
            <h2>Already requested</h2>
            <p>
              We already have a pending request for <strong>{email}</strong>.
              We'll be in touch soon — please check your inbox.
            </p>
            <button className="lp-btn-dark" onClick={onClose} style={{ marginTop: '1.5rem' }}>
              Got it
            </button>
          </div>
        ) : (
          <>
            <div className="req-modal-hd">
              <span className="lp-badge" style={{ marginBottom: '0.75rem' }}>
                <span className="small-dot" />
                NEW ENGINEER ACCESS
              </span>
              <h2>Request to join as an engineer</h2>
              <p>
                Enter your details below and we'll create your account and send
                you your login details.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="req-modal-form">
              <div className="req-field">
                <label htmlFor="req-name">
                  Full name <span className="req-required">*</span>
                </label>
                <input
                  id="req-name"
                  type="text"
                  placeholder="e.g. James Whitmore"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="req-field">
                <label htmlFor="req-gas-safe">
                  Gas Safe number <span className="req-required">*</span>
                </label>
                <input
                  id="req-gas-safe"
                  type="text"
                  placeholder="e.g. 512887"
                  value={gasSafeNumber}
                  onChange={(e) => setGasSafeNumber(e.target.value)}
                  required
                />
              </div>
              <div className="req-field">
                <label htmlFor="req-email">
                  Email address <span className="req-required">*</span>
                </label>
                <input
                  id="req-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              {status === 'error' && <p className="req-error">{errorMsg}</p>}
              <button
                type="submit"
                className="lp-btn-dark req-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending…' : 'Request access →'}
              </button>
            </form>
            <p className="req-modal-note">
              Already have an account?{' '}
              <Link to="/login" onClick={onClose}>
                Log in here.
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}