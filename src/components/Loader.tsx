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
            <path d="M14,2 C17,5 21,10 21,15 C21,20.5 18,24 14,24 C10,24 7,20.5 7,15 C7,10 11,5 14,2Z" fill="#D4A900"/>
            <path d="M14,10 C15.5,12 17.5,14.5 17.5,17.5 C17.5,20.5 16,22.5 14,22.5 C12,22.5 10.5,20.5 10.5,17.5 C10.5,14.5 12.5,12 14,10Z" fill="#F4EA03"/>
            <path d="M14,15 C14.8,16.2 15.5,17.2 15.5,18.5 C15.5,20 14.9,21 14,21 C13.1,21 12.5,20 12.5,18.5 C12.5,17.2 13.2,16.2 14,15Z" fill="#FEFCE8"/>
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
