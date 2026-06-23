import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { Loader } from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import type { SavedCertificate } from '../types'
import flameImg from '../assets/flame.png'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

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
          <img src={flameImg} width="28" height="28" alt="" />
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
              {certificates.map((cert) => {
                const age = Date.now() - new Date(cert.createdAt).getTime()
                const locked = age > ONE_WEEK_MS || (cert.editCount ?? 0) >= 3
                const editsLeft = Math.max(0, 3 - (cert.editCount ?? 0))
                const editTitle = editsLeft === 1 ? '1 edit remaining' : `${editsLeft} edits remaining`
                return (
                  <div key={cert.id} className="eng-cert-row">
                    <div className="eng-cert-ref">{cert.certificateRef || '—'}</div>
                    <div className="eng-cert-detail">
                      <span className="eng-cert-property">{cert.data.siteHouseAddress || cert.data.propertyAddress || '—'}</span>
                      <span className="eng-cert-meta">{cert.data.landlordName || '—'} · {cert.data.issueDate || '—'}</span>
                    </div>
                    <div className="eng-cert-actions">
                      {locked ? (
                        <span className="eng-cert-btn eng-cert-btn--locked" title="This certificate can no longer be edited">Locked</span>
                      ) : (
                        <Link to={`/certificate/${cert.id}`} className="eng-cert-btn" title={editTitle}>Edit</Link>
                      )}
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
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
