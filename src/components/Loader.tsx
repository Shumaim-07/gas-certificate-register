interface LoaderProps {
  text?: string
  fullPage?: boolean
}

export function Loader({ text = 'Loading…', fullPage = false }: LoaderProps) {
  const inner = (
    <div className="loader-wrap">
      <div className="loader-visual">
        <div className="loader-ring" />
        <div className="loader-logo">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#F4EA03" />
            <polyline
              points="6,14 11,19 22,9"
              stroke="#3D3431"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="loader-label-wrap">
        <span className="loader-brand">GasCertify UK</span>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  )

  if (fullPage) {
    return <div className="loader-fullpage">{inner}</div>
  }

  return <div className="loader-inline">{inner}</div>
}
