import { useRef, useState, useEffect } from 'react'

interface SignatureInputProps {
  value?: string
  onChange: (value: string) => void
}

const MAX_FILE_SIZE = 1024 * 1024 // 1 MB

export function SignatureInput({ value, onChange }: SignatureInputProps) {
  const [tab, setTab] = useState<'draw' | 'upload' | 'online'>('draw')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [tab])

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    isDrawing.current = true
    lastPos.current = getPos(e.nativeEvent as MouseEvent | TouchEvent, canvas)
    e.preventDefault()
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pos = getPos(e.nativeEvent as MouseEvent | TouchEvent, canvas)
    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    lastPos.current = pos
    e.preventDefault()
  }

  const stopDraw = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    lastPos.current = null
    const canvas = canvasRef.current
    if (!canvas) return
    onChange(canvas.toDataURL('image/png'))
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File must be 1 MB or less.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      onChange(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="sig-container">
      <div className="sig-tabs">
        <button
          type="button"
          className={`sig-tab${tab === 'draw' ? ' sig-tab--active' : ''}`}
          onClick={() => setTab('draw')}
        >
          Draw
        </button>
        <button
          type="button"
          className={`sig-tab${tab === 'upload' ? ' sig-tab--active' : ''}`}
          onClick={() => setTab('upload')}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={`sig-tab${tab === 'online' ? ' sig-tab--active' : ''}`}
          onClick={() => { setTab('online'); onChange('ONLINE') }}
        >
          Not Available
        </button>
      </div>

      {tab === 'draw' && (
        <div className="sig-draw-area">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="sig-canvas"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          <p className="sig-hint">Draw your signature above</p>
          <button type="button" className="sig-clear-btn" onClick={clearCanvas}>
            Clear
          </button>
        </div>
      )}

      {tab === 'upload' && (
        <div className="sig-upload-area">
          <label className="sig-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="sig-upload-input"
            />
            <span>Choose image (max 1 MB)</span>
          </label>
          {uploadError && <p className="sig-error">{uploadError}</p>}
        </div>
      )}

      {tab === 'online' && (
        <div className="sig-online-area">
          <p className="sig-hint">No signature available — the following will appear on the certificate:</p>
          <p className="sig-online-text"><em>ONLINE</em></p>
          <button type="button" className="sig-clear-btn" onClick={() => { setTab('draw'); onChange('') }}>
            Cancel
          </button>
        </div>
      )}

      {value && value !== 'ONLINE' && (
        <div className="sig-preview">
          <p className="sig-preview-label">Current signature:</p>
          <img src={value} alt="Signature" className="sig-preview-img" />
          <button type="button" className="sig-clear-btn" onClick={() => onChange('')}>
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
