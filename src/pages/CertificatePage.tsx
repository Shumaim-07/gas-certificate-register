import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { CertificateForm } from '../components/CertificateForm'
import { Loader } from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import { downloadCertificatePdf } from '../pdfGenerator'
import { certificateFromEngineer, emptyCertificateData, type CertificateData } from '../types'
import { useEffect, useState } from 'react'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export function CertificatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { engineer } = useAuth()
  const isNew = id === 'new'

  const [data, setData] = useState<CertificateData>(emptyCertificateData)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    if (!engineer) return

    if (isNew) {
      setData(certificateFromEngineer(engineer))
      return
    }

    if (!id) return

    setLoading(true)
    api.getCertificate(id)
      .then((cert) => {
        const age = Date.now() - new Date(cert.createdAt).getTime()
        if (age > ONE_DAY_MS) {
          setIsLocked(true)
        }
        setData(cert.data)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load certificate'))
      .finally(() => setLoading(false))
  }, [engineer, id, isNew])

  const handlePrint = async () => {
    setSaving(true)
    setError(null)
    try {
      if (isNew) {
        await api.saveCertificate(data.certificateRef, data)
      } else {
        await api.updateCertificate(id!, data.certificateRef, data)
      }
      await downloadCertificatePdf(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to print certificate')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader text="Loading certificate…" fullPage />
  }

  if (isLocked) {
    return (
      <div className="certificate-page">
        <div className="certificate-topbar">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>Edit Gas Certificate</h1>
        </div>
        <div className="certificate-form-wrap">
          <div className="alert alert-error certificate-error" style={{ textAlign: 'center', padding: '2rem' }}>
            <strong>Certificate Locked</strong>
            <p style={{ marginTop: '0.5rem' }}>This certificate was issued more than 24 hours ago and can no longer be edited.</p>
            <Link to="/dashboard" className="eng-btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="certificate-page">
      <div className="certificate-topbar">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>{isNew ? 'New Gas Certificate' : 'Edit Gas Certificate'}</h1>
      </div>
      {error && <div className="alert alert-error certificate-error">{error}</div>}
      <div className="certificate-form-wrap">
        <CertificateForm
          data={data}
          onChange={setData}
          onPrint={handlePrint}
          saving={saving}
        />
      </div>
    </div>
  )
}
