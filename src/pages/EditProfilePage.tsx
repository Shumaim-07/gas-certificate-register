import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { EngineerForm } from '../components/EngineerForm'
import { useAuth } from '../context/AuthContext'
import { emptyEngineerData } from '../types'

export function EditProfilePage() {
  const navigate = useNavigate()
  const { engineer, setEngineer } = useAuth()
  const [data, setData] = useState(emptyEngineerData)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (engineer) {
      setData({
        gasSafeRegisterNumber: engineer.gasSafeRegisterNumber,
        engineerName: engineer.engineerName,
        gasSafeLicenceNumber: engineer.gasSafeLicenceNumber,
        businessName: engineer.businessName,
        houseAddress: engineer.houseAddress,
        area: engineer.area,
        postCode: engineer.postCode,
        contactNumber: engineer.contactNumber,
      })
    }
  }, [engineer])

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const updated = await api.updateEngineerProfile(data)
      setEngineer(updated)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-with-nav">
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      {error && <div className="alert alert-error">{error}</div>}
      <EngineerForm
        data={data}
        onChange={setData}
        onSubmit={handleSubmit}
        submitLabel="Update Details"
        saving={saving}
        title="Edit Engineer Details"
        subtitle="Update your registration and business information."
      />
    </div>
  )
}
