import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { CertificateForm } from '../components/CertificateForm'
import { useAuth } from '../context/AuthContext'
import { printCertificatePdf } from '../pdfGenerator'
import { certificateFromEngineer, emptyCertificateData, type CertificateData } from '../types'
import { useEffect, useState } from 'react'

export function CertificatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { engineer } = useAuth()
  const isNew = id === 'new'

  const [data, setData] = useState<CertificateData>(emptyCertificateData)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!engineer) return

    if (isNew) {
      setData(certificateFromEngineer(engineer))
      return
    }

    if (!id) return

    setLoading(true)
    api.getCertificate(id)
      .then((cert) => setData(cert.data))
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
      await printCertificatePdf(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to print certificate')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="page-center"><p className="muted">Loading certificate…</p></div>
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
