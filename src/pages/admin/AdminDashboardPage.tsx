import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import type { EngineerProfile } from '../../types'

type JoinRequest = { id: string; email: string; name: string; createdAt: string }

export function AdminDashboardPage() {
  const { adminUsername, logout } = useAuth()
  const [engineers, setEngineers] = useState<EngineerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(true)

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

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Panel</h1>
          <p>Signed in as {adminUsername}</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/admin/engineers/new" className="primary-btn">+ Create User ID</Link>
          <button type="button" className="secondary-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {/* ── Join Requests ── */}
      {(requestsLoading || joinRequests.length > 0) && (
        <section className="certificates-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Engineer Join Requests
            {joinRequests.length > 0 && (
              <span className="req-badge-count">{joinRequests.length}</span>
            )}
          </h2>
          {requestsLoading ? (
            <p className="muted">Loading…</p>
          ) : (
            <div className="cert-table-wrap">
              <table className="cert-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Requested</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {joinRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.name || <span className="muted">—</span>}</td>
                      <td><strong>{req.email}</strong></td>
                      <td>{new Date(req.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="table-actions">
                        <Link
                          to="/admin/engineers/new"
                          className="link-btn"
                          style={{ color: '#15803d' }}
                        >
                          Create ID
                        </Link>
                        <button
                          type="button"
                          className="link-btn danger"
                          onClick={() => handleDismissRequest(req.id)}
                        >
                          Dismiss
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section className="certificates-section">
        <h2>Engineer User IDs</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : engineers.length === 0 ? (
          <div className="empty-state">
            <p>No User IDs yet. Create one for each engineer.</p>
            <Link to="/admin/engineers/new" className="primary-btn">Create User ID</Link>
          </div>
        ) : (
          <div className="cert-table-wrap">
            <table className="cert-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Password</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {engineers.map((eng) => (
                  <tr key={eng.id}>
                    <td><strong>{eng.userId}</strong></td>
                    <td>{eng.pinSet ? 'Set by engineer' : 'Waiting — engineer must login'}</td>
                    <td>{eng.createdAt ? new Date(eng.createdAt).toLocaleDateString('en-GB') : '—'}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link-btn danger"
                        onClick={() => handleDelete(eng.id, eng.userId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
