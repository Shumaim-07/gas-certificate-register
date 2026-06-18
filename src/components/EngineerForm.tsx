import type { EngineerFormData } from '../types'
import { SignatureInput } from './SignatureInput'

interface EngineerFormProps {
  data: EngineerFormData
  onChange: (data: EngineerFormData) => void
  onSubmit: () => void
  submitLabel: string
  saving: boolean
  title: string
  subtitle: string
}

const fields: { key: keyof EngineerFormData; label: string; placeholder?: string; multiline?: boolean; full?: boolean }[] = [
  { key: 'gasSafeRegisterNumber', label: 'Gas Safe Register No.', placeholder: 'e.g. 512887' },
  { key: 'engineerName', label: 'Registered Engineer Name', placeholder: 'Full name as on Gas Safe card' },
  { key: 'gasSafeLicenceNumber', label: 'Licence Number', placeholder: 'e.g. 123456' },
  { key: 'businessName', label: 'Business Name', placeholder: 'Your company or trading name' },
  { key: 'houseAddress', label: 'Street Address', placeholder: 'House number and street', multiline: true, full: true },
  { key: 'area', label: 'Area / City', placeholder: 'Town or city', full: true },
  { key: 'postCode', label: 'Post Code', placeholder: 'e.g. SW1A 1AA' },
  { key: 'contactNumber', label: 'Contact Number', placeholder: 'e.g. 07700 900000' },
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
    <div className="eng-form-card">
      <div className="eng-form-header">
        <div className="eng-form-accent" />
        <div>
          <h1 className="eng-form-title">{title}</h1>
          <p className="eng-form-sub">{subtitle}</p>
        </div>
      </div>

      <div className="eng-form-grid">
        {fields.map((field) => (
          <div key={field.key} className={`eng-field${field.full ? ' eng-field--full' : ''}`}>
            <label htmlFor={`ef-${field.key}`}>{field.label}</label>
            {field.multiline ? (
              <textarea
                id={`ef-${field.key}`}
                value={data[field.key] ?? ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={2}
              />
            ) : (
              <input
                id={`ef-${field.key}`}
                type={field.key === 'contactNumber' ? 'tel' : 'text'}
                value={data[field.key] ?? ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <div className="eng-field eng-field--full sig-section">
          <label>Engineer Signature</label>
          <p className="sig-section-hint">This signature will appear on generated certificates.</p>
          <SignatureInput
            value={data.signature}
            onChange={(val) => onChange({ ...data, signature: val })}
          />
        </div>
      </div>

      <button type="button" className="eng-submit-btn" onClick={onSubmit} disabled={saving}>
        {saving ? 'Saving…' : submitLabel}
      </button>
    </div>
  )
}
