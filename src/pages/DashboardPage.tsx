import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
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
            <rect width="28" height="28" rx="7" fill="#F4EA03" />
            <polyline points="6,14 11,19 22,9" stroke="#3D3431" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>GasCertify UK</span>
        </div>
        <div className="eng-topbar-actions">
          <Link to="/certificate/new" className="eng-btn-primary">+ New Certificate</Link>
          <Link to="/profile/edit" className="eng-btn-ghost">Edit Details</Link>
          <button type="button" className="eng-btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="eng-dashboard-body">
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
            <p className="muted" style={{ padding: '1.5rem 0' }}>Loading certificates…</p>
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
                          const { printCertificatePdf } = await import('../pdfGenerator')
                          await printCertificatePdf(cert.data)
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
