import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import type { EngineerProfile } from '../../types'

type JoinRequest = {
  gasSafeNumber: string; id: string; email: string; name: string; createdAt: string
}

type FreezeReason = 'rule_violation' | 'payment_not_submitted'

const FREEZE_REASON_LABELS: Record<FreezeReason, string> = {
  rule_violation: 'Rule Violation',
  payment_not_submitted: 'Payment Not Submitted',
}

function FreezeModal({
  engineer,
  onConfirm,
  onClose,
}: {
  engineer: EngineerProfile
  onConfirm: (reason: FreezeReason) => void
  onClose: () => void
}) {
  const [reason, setReason] = useState<FreezeReason>('rule_violation')
  return (
    <div className="adm-modal-overlay">
      <div className="adm-modal">
        <div className="adm-modal-header">
          <div className="adm-modal-icon adm-modal-icon--freeze">🔒</div>
          <h3>Freeze Account</h3>
          <p>Select the reason for freezing <strong>{engineer.userId}</strong>:</p>
        </div>
        <div className="adm-modal-reasons">
          {(Object.entries(FREEZE_REASON_LABELS) as [FreezeReason, string][]).map(([val, label]) => (
            <label key={val} className={`adm-reason-option ${reason === val ? 'adm-reason-option--active' : ''}`}>
              <input
                type="radio"
                name="freeze-reason"
                value={val}
                checked={reason === val}
                onChange={() => setReason(val)}
              />
              <span className="adm-reason-dot" />
              {label}
            </label>
          ))}
        </div>
        <div className="adm-modal-actions">
          <button type="button" className="adm-modal-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="adm-modal-confirm" onClick={() => onConfirm(reason)}>
            Freeze Account
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  const { adminUsername, logout } = useAuth()
  const [engineers, setEngineers] = useState<EngineerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [freezeTarget, setFreezeTarget] = useState<EngineerProfile | null>(null)

  const loadEngineers = () => {
    setLoading(true)
    api.adminGetEngineers()
      .then(setEngineers)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load engineers'))
      .finally(() => setLoading(false))
  }

  const loadJoinRequests = () => {
    setRequestsLoading(true)
    api.adminGetJoinRequests()
      .then(setJoinRequests)
      .catch(() => {})
      .finally(() => setRequestsLoading(false))
  }

  useEffect(() => {
    loadEngineers()
    loadJoinRequests()
  }, [])

  const handleDismissRequest = async (id: string) => {
    try {
      await api.adminDismissJoinRequest(id)
      setJoinRequests((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not dismiss request')
    }
  }

  const handleDelete = async (id: string, userId: string) => {
    if (!confirm(`Delete User ID "${userId}" and all their certificates?`)) return
    try {
      await api.adminDeleteEngineer(id)
      setEngineers((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleFreeze = async (reason: FreezeReason) => {
    if (!freezeTarget) return
    try {
      const updated = await api.adminFreezeEngineer(freezeTarget.id, reason)
      setEngineers((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      setFreezeTarget(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not freeze account')
    }
  }

  const handleUnfreeze = async (engineer: EngineerProfile) => {
    if (!confirm(`Unfreeze account "${engineer.userId}"?`)) return
    try {
      const updated = await api.adminUnfreezeEngineer(engineer.id)
      setEngineers((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not unfreeze account')
    }
  }

  const activeCount = engineers.filter((e) => !e.frozen).length
  const frozenCount = engineers.filter((e) => e.frozen).length

  return (
    <div className="adm-dash">
      {freezeTarget && (
        <FreezeModal
          engineer={freezeTarget}
          onConfirm={handleFreeze}
          onClose={() => setFreezeTarget(null)}
        />
      )}

      {/* ── Top Bar ── */}
      <header className="adm-topbar">
        <div className="adm-topbar-brand">
          <div className="adm-topbar-logo">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#F4EA03" />
              <polyline points="6,14 11,19 22,9" stroke="#3D3431" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="adm-topbar-title">Admin Panel</div>
            <div className="adm-topbar-sub">Signed in as {adminUsername}</div>
          </div>
        </div>
        <div className="adm-topbar-actions">
          <Link to="/admin/engineers/new" className="adm-btn-primary">+ Create User ID</Link>
          <button type="button" className="adm-btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="adm-body">
        {/* ── Stats Row ── */}
        <div className="adm-stats">
          <div className="adm-stat-card adm-stat--total">
            <div className="adm-stat-value">{loading ? '—' : engineers.length}</div>
            <div className="adm-stat-label">Total Engineers</div>
          </div>
          <div className="adm-stat-card adm-stat--active">
            <div className="adm-stat-value">{loading ? '—' : activeCount}</div>
            <div className="adm-stat-label">Active</div>
          </div>
          <div className="adm-stat-card adm-stat--frozen">
            <div className="adm-stat-value">{loading ? '—' : frozenCount}</div>
            <div className="adm-stat-label">Frozen</div>
          </div>
          <div className="adm-stat-card adm-stat--pending">
            <div className="adm-stat-value">{requestsLoading ? '—' : joinRequests.length}</div>
            <div className="adm-stat-label">Pending Requests</div>
          </div>
        </div>

        {error && <div className="adm-alert-error">{error}</div>}

        {/* ── Join Requests ── */}
        {(requestsLoading || joinRequests.length > 0) && (
          <section className="adm-section">
            <div className="adm-section-header adm-section-header--amber">
              <h2>
                Engineer Join Requests
                {joinRequests.length > 0 && (
                  <span className="adm-badge-count">{joinRequests.length}</span>
                )}
              </h2>
              <p className="adm-section-desc">Engineers requesting access to the platform</p>
            </div>
            {requestsLoading ? (
              <p className="muted" style={{ padding: '1rem' }}>Loading…</p>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Gas Safe Number</th>
                      <th>Requested</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joinRequests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.name || <span className="muted">—</span>}</td>
                        <td><strong>{req.email}</strong></td>
                        <td>{req.gasSafeNumber || <span className="muted">—</span>}</td>
                        <td>{new Date(req.createdAt).toLocaleDateString('en-GB')}</td>
                        <td>
                          <div className="adm-row-actions">
                            <Link to="/admin/engineers/new" className="adm-action-btn adm-action-btn--green">
                              Create ID
                            </Link>
                            <button
                              type="button"
                              className="adm-action-btn adm-action-btn--red"
                              onClick={() => handleDismissRequest(req.id)}
                            >
                              Dismiss
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Engineers Table ── */}
        <section className="adm-section">
          <div className="adm-section-header adm-section-header--blue">
            <h2>Engineer Accounts</h2>
            <p className="adm-section-desc">Manage engineer access, passwords and account status</p>
          </div>
          {loading ? (
            <p className="muted" style={{ padding: '1rem' }}>Loading…</p>
          ) : engineers.length === 0 ? (
            <div className="adm-empty">
              <p>No engineers yet. Create a User ID for each engineer.</p>
              <Link to="/admin/engineers/new" className="adm-btn-primary">Create User ID</Link>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Password</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {engineers.map((eng) => (
                    <tr key={eng.id} className={eng.frozen ? 'adm-row--frozen' : ''}>
                      <td><strong>{eng.userId}</strong></td>
                      <td className="muted">{eng.pinSet ? 'Set by engineer' : 'Waiting — engineer must login'}</td>
                      <td>
                        {eng.frozen ? (
                          <div className="adm-status-wrap">
                            <span className="adm-badge adm-badge--frozen">Frozen</span>
                            {eng.freezeReason && (
                              <span className="adm-freeze-reason">
                                {FREEZE_REASON_LABELS[eng.freezeReason as FreezeReason] ?? eng.freezeReason}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="adm-badge adm-badge--active">Active</span>
                        )}
                      </td>
                      <td>{eng.createdAt ? new Date(eng.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                      <td>
                        <div className="adm-row-actions">
                          {eng.frozen ? (
                            <button
                              type="button"
                              className="adm-action-btn adm-action-btn--green"
                              onClick={() => handleUnfreeze(eng)}
                            >
                              Unfreeze
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="adm-action-btn adm-action-btn--orange"
                              onClick={() => setFreezeTarget(eng)}
                            >
                              Freeze
                            </button>
                          )}
                          <button
                            type="button"
                            className="adm-action-btn adm-action-btn--red"
                            onClick={() => handleDelete(eng.id, eng.userId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
