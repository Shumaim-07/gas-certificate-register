import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Loader } from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import type { SavedCertificate } from '../types'

export function DashboardPage() {
  const { engineer, logout } = useAuth()
  const [certificates, setCertificates] = useState<SavedCertificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCertificates()
      .then(setCertificates)
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false))
  }, [])

  if (!engineer) return null

  return (
    <div className="eng-dashboard">
      {/* ── Top bar ── */}
      <header className="eng-topbar">
        <div className="eng-topbar-brand">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14,2 C17,5 21,10 21,15 C21,20.5 18,24 14,24 C10,24 7,20.5 7,15 C7,10 11,5 14,2Z" fill="#D4A900"/>
            <path d="M14,10 C15.5,12 17.5,14.5 17.5,17.5 C17.5,20.5 16,22.5 14,22.5 C12,22.5 10.5,20.5 10.5,17.5 C10.5,14.5 12.5,12 14,10Z" fill="#F4EA03"/>
            <path d="M14,15 C14.8,16.2 15.5,17.2 15.5,18.5 C15.5,20 14.9,21 14,21 C13.1,21 12.5,20 12.5,18.5 C12.5,17.2 13.2,16.2 14,15Z" fill="#FEFCE8"/>
          </svg>
          <span>GasCertify UK</span>
        </div>
        <div className="eng-topbar-actions">
          <Link to="/" className="eng-btn-ghost">Home</Link>
          <Link to="/certificate/new" className="eng-btn-primary">+ New Certificate</Link>
          <Link to="/profile/edit" className="eng-btn-ghost">Edit Details</Link>
          <button type="button" className="eng-btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="eng-dashboard-body">
        {/* ── Frozen banner ── */}
        {engineer.frozen && (
          <div className="eng-frozen-banner">
            <span className="eng-frozen-icon">🔒</span>
            <div>
              <strong>Account Suspended</strong>
              <p>
                {engineer.freezeReason === 'rule_violation'
                  ? 'Your account has been suspended due to a rule violation. Please contact your administrator.'
                  : engineer.freezeReason === 'payment_not_submitted'
                    ? 'Your account has been suspended because payment was not submitted. Please submit payment to regain access.'
                    : 'Your account has been suspended. Please contact your administrator.'}
              </p>
            </div>
          </div>
        )}

        {/* ── Welcome strip ── */}
        <div className="eng-welcome">
          <div>
            <h1 className="eng-welcome-h1">Welcome back, {engineer.engineerName || engineer.userId}</h1>
            <p className="eng-welcome-sub">Gas Safe No. {engineer.gasSafeRegisterNumber || '—'} · {engineer.businessName || 'Engineer Dashboard'}</p>
          </div>
        </div>

        {/* ── Profile details ── */}
        <section className="eng-profile-card">
          <div className="eng-card-header">
            <h2>Registered Details</h2>
            <Link to="/profile/edit" className="eng-card-edit-link">Edit →</Link>
          </div>
          <dl className="eng-profile-grid">
            <div><dt>User ID</dt><dd>{engineer.userId}</dd></div>
            <div><dt>Gas Safe Register No.</dt><dd>{engineer.gasSafeRegisterNumber || '—'}</dd></div>
            <div><dt>Engineer Name</dt><dd>{engineer.engineerName || '—'}</dd></div>
            <div><dt>Licence Number</dt><dd>{engineer.gasSafeLicenceNumber || '—'}</dd></div>
            <div><dt>Business Name</dt><dd>{engineer.businessName || '—'}</dd></div>
            <div><dt>Post Code</dt><dd>{engineer.postCode || '—'}</dd></div>
            <div><dt>Contact</dt><dd>{engineer.contactNumber || '—'}</dd></div>
            <div><dt>Address</dt><dd>{engineer.houseAddress || '—'}</dd></div>
          </dl>
        </section>

        {/* ── Certificates ── */}
        <section className="eng-certs-section">
          <div className="eng-card-header">
            <h2>Certificates {!loading && certificates.length > 0 && <span className="eng-cert-count">{certificates.length}</span>}</h2>
            <Link to="/certificate/new" className="eng-btn-primary eng-btn-sm">+ New</Link>
          </div>

          {loading ? (
            <Loader text="Loading certificates…" />
          ) : certificates.length === 0 ? (
            <div className="eng-empty">
              <p>No certificates yet — create your first one.</p>
              <Link to="/certificate/new" className="eng-btn-primary">Create Certificate</Link>
            </div>
          ) : (
            <div className="eng-cert-list">
              {certificates.map((cert) => (
                <div key={cert.id} className="eng-cert-row">
                  <div className="eng-cert-ref">{cert.certificateRef || '—'}</div>
                  <div className="eng-cert-detail">
                    <span className="eng-cert-property">{cert.data.siteHouseAddress || cert.data.propertyAddress || '—'}</span>
                    <span className="eng-cert-meta">{cert.data.landlordName || '—'} · {cert.data.issueDate || '—'}</span>
                  </div>
                  <div className="eng-cert-actions">
                    <Link to={`/certificate/${cert.id}`} className="eng-cert-btn">Edit</Link>
                    <button
                      type="button"
                      className="eng-cert-btn eng-cert-btn--primary"
                      onClick={async () => {
                        try {
                          const { downloadCertificatePdf } = await import('../pdfGenerator')
                          await downloadCertificatePdf(cert.data)
                        } catch (err) {
                          console.error('Failed to print PDF:', err)
                        }
                      }}
                    >
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
