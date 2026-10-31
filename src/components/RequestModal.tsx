import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export function RequestModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [gasSafeNumber, setGasSafeNumber] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

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
    <>
      <div className="req-modal-overlay" onClick={onClose}>
        <div className="req-modal" onClick={(e) => e.stopPropagation()}>
          <button className="req-modal-close" onClick={onClose} aria-label="Close">✕</button>

          {status === 'success' ? (
            <div className="req-modal-success">
              <div className="req-success-icon">✓</div>
              <h2>Request sent!</h2>
              <p>
                We've received your request. Our team will create your account
                and send your login details to <strong>{email}</strong> in 24 hours.
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
                <div className="req-terms">
                  <label className="req-terms-label">
                    <input
                      type="radio"
                      name="agree-terms"
                      checked={agreedToTerms}
                      onChange={() => setAgreedToTerms(true)}
                      required
                    />
                    <span>
                      I agree to the{' '}
                      <button
                        type="button"
                        className="req-terms-link"
                        onClick={() => setShowTerms(true)}
                      >
                        Terms &amp; Conditions
                      </button>
                    </span>
                  </label>
                </div>
                {status === 'error' && <p className="req-error">{errorMsg}</p>}
                <button
                  type="submit"
                  className="lp-btn-dark req-submit"
                  disabled={status === 'loading' || !agreedToTerms}
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

      {showTerms && (
        <div className="req-modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="req-modal" onClick={(e) => e.stopPropagation()}>
            <button className="req-modal-close" onClick={() => setShowTerms(false)} aria-label="Close">✕</button>
            <div className="req-modal-hd">
              <h2>Terms &amp; Conditions</h2>
            </div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', fontSize: '0.875rem', lineHeight: 1.55, color: '#6b6360' }}>
              <p>These Terms &amp; Conditions govern your request to join as an engineer. By submitting a request, you agree to the following:</p>
              <p><strong>1. Eligibility</strong><br />You confirm that you are a qualified gas engineer and that the Gas Safe number you provide is valid and belongs to you.</p>
              <p><strong>2. Account Creation</strong><br />We will create an account on your behalf and send login details to the email address you provide. You are responsible for keeping those details secure.</p>
              <p><strong>3. Acceptable Use</strong><br />You agree to use the platform only for lawful purposes and in accordance with all applicable regulations.</p>
              <p><strong>4. Data &amp; Privacy</strong><br />Your details will be stored and processed in line with our Privacy Policy. We will not share your information with third parties without your consent, except where required by law.</p>
              <p><strong>5. Termination</strong><br />We reserve the right to suspend or terminate your account if these terms are breached or if your Gas Safe registration is no longer valid.</p>
              <p><strong>6. Changes</strong><br />We may update these terms from time to time. Continued use of the platform constitutes acceptance of any revised terms.</p>
              <p><strong>7. Document Retention</strong><br />Your licence and certification documents will be retained securely for a period of 8 years, in line with our record-keeping obligations. After this period, they will be securely deleted.</p>
            </div>
            <button className="lp-btn-dark" onClick={() => setShowTerms(false)} style={{ marginTop: '1.5rem' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}