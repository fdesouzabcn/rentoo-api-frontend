import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// UX-only guard — backend 403 is the real security boundary.
// Non-admins are silently redirected to /dashboard.
// Admins see the wrapped children as normal.
export default function RoleRoute({ children }) {
  const { isAdmin } = useAuth()

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}