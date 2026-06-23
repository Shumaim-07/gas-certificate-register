import flameImg from '../assets/flame.png'

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
          <img src={flameImg} width="24" height="24" alt="" />
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
