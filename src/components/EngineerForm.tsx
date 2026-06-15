import type { EngineerFormData } from '../types'

interface EngineerFormProps {
  data: EngineerFormData
  onChange: (data: EngineerFormData) => void
  onSubmit: () => void
  submitLabel: string
  saving: boolean
  title: string
  subtitle: string
}

const fields: { key: keyof EngineerFormData; label: string; multiline?: boolean }[] = [
  { key: 'gasSafeRegisterNumber', label: 'Gas Safe Register Number' },
  { key: 'engineerName', label: 'Registered Engineer Name' },
  { key: 'gasSafeLicenceNumber', label: 'Gas Safe Register Licence Number' },
  { key: 'businessName', label: 'Business Name' },
  { key: 'houseAddress', label: 'House / Street Address', multiline: true },
  { key: 'area', label: 'Area / City', multiline: true },
  { key: 'postCode', label: 'Post Code' },
  { key: 'contactNumber', label: 'Contact Number' },
]

export function EngineerForm({
  data,
  onChange,
  onSubmit,
  submitLabel,
  saving,
  title,
  subtitle,
}: EngineerFormProps) {
  const updateField = (key: keyof EngineerFormData, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="page-card engineer-form-card">
      <div className="page-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="form-grid single-col">
        {fields.map((field) => (
          <label key={field.key} className="form-field full-width">
            <span>{field.label}</span>
            {field.multiline ? (
              <textarea
                value={data[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                rows={3}
              />
            ) : (
              <input
                type={field.key === 'contactNumber' ? 'tel' : 'text'}
                value={data[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      <button type="button" className="primary-btn" onClick={onSubmit} disabled={saving}>
        {saving ? 'Saving…' : submitLabel}
      </button>
    </div>
  )
}
