import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { CreateUserIdPage } from './pages/admin/CreateUserIdPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { CertificatePage } from './pages/CertificatePage'
import { DashboardPage } from './pages/DashboardPage'
import { EditProfilePage } from './pages/EditProfilePage'
import { LoginPage } from './pages/LoginPage'
import { SetPinPage } from './pages/SetPinPage'
import { SetupProfilePage } from './pages/SetupProfilePage'
import { LandingPage } from './pages/LandingPage'  // ← NEW IMPORT

function EngineerGuard({ children }: { children: ReactNode }) {
  const { engineer, loading } = useAuth()

  if (loading) {
    return <div className="page-center"><p className="muted">Loading…</p></div>
  }
  if (!engineer) {
    return <Navigate to="/login" replace />
  }
  if (!engineer.profileComplete) {
    return <Navigate to="/setup-profile" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  const { role, engineer, loading } = useAuth()

  if (loading) {
    return <div className="page-center"><p className="muted">Loading…</p></div>
  }

  return (
    <Routes>
      {/* NEW: Landing Page - Everyone sees this first */}
      <Route path="/" element={<LandingPage />} />  {/* ← NEW ROUTE */}

      <Route path="/login" element={role === 'engineer' ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/set-pin" element={<SetPinPage />} />
      <Route
        path="/setup-profile"
        element={
          role === 'engineer' && engineer && !engineer.profileComplete
            ? <SetupProfilePage />
            : <Navigate to={role === 'engineer' ? '/dashboard' : '/login'} replace />
        }
      />

      <Route path="/admin/login" element={role === 'admin' ? <Navigate to="/admin" replace /> : <AdminLoginPage />} />
      <Route path="/admin" element={role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/admin/login" replace />} />
      <Route
        path="/admin/engineers/new"
        element={role === 'admin' ? <CreateUserIdPage /> : <Navigate to="/admin/login" replace />}
      />

      <Route path="/dashboard" element={<EngineerGuard><DashboardPage /></EngineerGuard>} />
      <Route path="/profile/edit" element={<EngineerGuard><EditProfilePage /></EngineerGuard>} />
      <Route path="/certificate/:id" element={<EngineerGuard><CertificatePage /></EngineerGuard>} />

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}