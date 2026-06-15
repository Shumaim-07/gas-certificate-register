import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import type { EngineerProfile } from '../../types'

export function AdminDashboardPage() {
  const { adminUsername, logout } = useAuth()
  const [engineers, setEngineers] = useState<EngineerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEngineers = () => {
    setLoading(true)
    api.adminGetEngineers()
      .then(setEngineers)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load engineers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadEngineers()
  }, [])

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
