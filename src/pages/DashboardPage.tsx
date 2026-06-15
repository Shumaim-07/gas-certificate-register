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
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Engineer Dashboard</h1>
          <p>Welcome, {engineer.engineerName || engineer.userId}</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/certificate/new" className="primary-btn">+ New Gas Certificate</Link>
          <Link to="/profile/edit" className="secondary-btn">Edit Details</Link>
          <button type="button" className="secondary-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="profile-card">
        <h2>Your Registered Details</h2>
        <dl className="profile-grid">
          <div><dt>User ID</dt><dd>{engineer.userId}</dd></div>
          <div><dt>Gas Safe Register No.</dt><dd>{engineer.gasSafeRegisterNumber}</dd></div>
          <div><dt>Engineer Name</dt><dd>{engineer.engineerName}</dd></div>
          <div><dt>Licence Number</dt><dd>{engineer.gasSafeLicenceNumber}</dd></div>
          <div><dt>Business Name</dt><dd>{engineer.businessName}</dd></div>
          <div><dt>Address</dt><dd>{engineer.houseAddress}</dd></div>
          <div><dt>Post Code</dt><dd>{engineer.postCode}</dd></div>
          <div><dt>Contact Number</dt><dd>{engineer.contactNumber}</dd></div>
        </dl>
      </section>

      <section className="certificates-section">
        <h2>Recent Certificates</h2>
        {loading ? (
          <p className="muted">Loading certificates…</p>
        ) : certificates.length === 0 ? (
          <div className="empty-state">
            <p>No certificates yet.</p>
            <Link to="/certificate/new" className="primary-btn">Create your first certificate</Link>
          </div>
        ) : (
          <div className="cert-table-wrap">
            <table className="cert-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Property</th>
                  <th>Landlord</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert.id}>
                    <td>{cert.certificateRef || '—'}</td>
                    <td>{cert.data.propertyAddress || '—'}</td>
                    <td>{cert.data.landlordName || '—'}</td>
                    <td>{cert.data.issueDate || '—'}</td>
                    <td>
                     <td className="action-buttons">
  <button 
    onClick={async () => {
      try {
        const { printCertificatePdf } = await import('../pdfGenerator')
        await printCertificatePdf(cert.data)
      } catch (err) {
        console.error('Failed to print PDF:', err)
      }
    }} 
    className="link-btn"
  >
    Open PDF
  </button>
</td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
