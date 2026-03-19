import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/router/ProtectedRoute'
import Layout from '@/components/layout/Layout'

// Auth pages (public)
import Login from '@/pages/Login'
import Register from '@/pages/Register'

// Session 4 — built this session
import Profile from '@/pages/Profile'

// Placeholders — will be replaced in upcoming sessions
const Dashboard = () => (
  <Layout>
    <div className="p-8 text-lg font-semibold text-slate-700">Dashboard — Session 10</div>
  </Layout>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Public routes ────────────────────────────────────────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected routes ─────────────────────────────────────────── */}

          {/* Dashboard — Session 10 */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Own profile */}
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin viewing any user's profile */}
          <Route
            path="/users/:uuid"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ── Redirects ────────────────────────────────────────────────── */}

          {/* Old /profile path → new /my-profile */}
          <Route path="/profile" element={<Navigate to="/my-profile" replace />} />

          {/* Root → dashboard for authenticated users */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}