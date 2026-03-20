import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/router/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import PropertiesList from '@/pages/Properties/PropertiesList'
import PropertyDetail from '@/pages/Properties/PropertyDetail'

// Placeholder
const Placeholder = ({ label }) => (
  <div className="py-20 text-center text-sm text-slate-400">{label}</div>
)

// Route wrapper helper
const Protected = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-profile"  element={<Protected><Profile /></Protected>} />
          <Route path="/users/:uuid" element={<Protected><Profile /></Protected>} />

          <Route path="/properties"           element={<Protected><PropertiesList /></Protected>} />
          <Route path="/properties/create"    element={<Protected><Placeholder label="PropertyCreate — Session 6" /></Protected>} />
          <Route path="/properties/:uuid"     element={<Protected><PropertyDetail /></Protected>} />
          <Route path="/properties/:uuid/edit" element={<Protected><Placeholder label="PropertyEdit — Session 6" /></Protected>} />

          <Route path="/contracts"            element={<Protected><Placeholder label="ContractsList — Session 7" /></Protected>} />
          <Route path="/contracts/new"        element={<Protected><Placeholder label="ContractCreate — Session 8" /></Protected>} />
          <Route path="/contracts/:uuid"      element={<Protected><Placeholder label="ContractDetail — Session 7" /></Protected>} />
          <Route path="/contracts/:uuid/edit" element={<Protected><Placeholder label="ContractEdit — Session 8" /></Protected>} />

          <Route path="/admin/users" element={<Protected><Placeholder label="UsersList — Session 9" /></Protected>} />

          <Route path="/dashboard" element={<Protected><Placeholder label="Dashboard — Session 10" /></Protected>} />

          {/* Redirects */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}