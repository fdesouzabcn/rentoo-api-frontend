import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/router/ProtectedRoute'
import RoleRoute from '@/router/RoleRoute'
import Layout from '@/components/layout/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import PropertiesList from '@/pages/Properties/PropertiesList'
import PropertyDetail from '@/pages/Properties/PropertyDetail'
import PropertyCreate from '@/pages/Properties/PropertyCreate'
import PropertyEdit from '@/pages/Properties/PropertyEdit'
import ContractsList from '@/pages/Contracts/ContractsList'
import ContractDetail from '@/pages/Contracts/ContractDetail'
import ContractCreate from '@/pages/Contracts/ContractCreate'
import ContractEdit from '@/pages/Contracts/ContractEdit'
import UsersList from '@/pages/Admin/UsersList'
import Dashboard from '@/pages/Dashboard'

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

          <Route path="/properties"             element={<Protected><PropertiesList /></Protected>} />
          <Route path="/properties/create"      element={<Protected><PropertyCreate /></Protected>} />
          <Route path="/properties/:uuid"       element={<Protected><PropertyDetail /></Protected>} />
          <Route path="/properties/:uuid/edit"  element={<Protected><PropertyEdit /></Protected>} />

          <Route path="/contracts"            element={<Protected><ContractsList /></Protected>} />
          <Route path="/contracts/new"        element={<Protected><ContractCreate /></Protected>} />
          <Route path="/contracts/:uuid"      element={<Protected><ContractDetail /></Protected>} />
          <Route path="/contracts/:uuid/edit" element={<Protected><ContractEdit /></Protected>} />

          {/* Admin-only route — RoleRoute silently redirects non-admins to /dashboard */}
          <Route path="/admin/users" element={<Protected><RoleRoute><UsersList /></RoleRoute></Protected>} />

          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />

          {/* Redirects */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}