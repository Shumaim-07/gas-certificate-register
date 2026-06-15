import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { EngineerForm } from '../components/EngineerForm'
import { useAuth } from '../context/AuthContext'
import { emptyEngineerData } from '../types'

export function SetupProfilePage() {
  const navigate = useNavigate()
  const { engineer, setEngineer } = useAuth()
  const [data, setData] = useState(() => {
    if (!engineer) return emptyEngineerData()
    return {
      gasSafeRegisterNumber: engineer.gasSafeRegisterNumber,
      engineerName: engineer.engineerName,
      gasSafeLicenceNumber: engineer.gasSafeLicenceNumber,
      businessName: engineer.businessName,
      houseAddress: engineer.houseAddress,
      postCode: engineer.postCode,
      contactNumber: engineer.contactNumber,
      area: engineer.area,
    }
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    try {
      const updated = await api.updateEngineerProfile(data)
      setEngineer(updated)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-center">
      {error && <div className="alert alert-error">{error}</div>}
      <EngineerForm
        data={data}
        onChange={setData}
        onSubmit={handleSubmit}
        submitLabel="Save & Go to Dashboard"
        saving={saving}
        title="Complete Your Profile"
        subtitle="Fill in your Gas Safe registration details. These will appear on every certificate."
      />
    </div>
  )
}
