import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '@/services/userService'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import { InfoIcon } from '@/components/icons'

export default function UsersList() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getUsers()
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name, 'es'))
        setUsers(sorted)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    const msg =
      error.status === 0
        ? 'No se pudo conectar con el servidor.'
        : (error.message ?? 'Ha ocurrido un error inesperado.')
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
        <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">{msg}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-medium text-slate-900">Usuarios del sistema</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {users.length} {users.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
          </p>
        </div>
      </div>

      {/* Admin info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2.5 mb-4 flex gap-2.5 items-start">
        <svg
          className="w-[15px] h-[15px] text-blue-600 flex-shrink-0 mt-0.5"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0
               001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        <p className="text-xs text-blue-800 leading-relaxed">
          Vista exclusiva de administrador. Los usuarios no pueden acceder a esta página.
        </p>
      </div>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400">No hay usuarios registrados.</p>
        </div>
      )}

      {/* User list */}
      {users.length > 0 && (
        <div className="flex flex-col gap-2">
          {users.map((user) => {
            const isUserAdmin = Array.isArray(user.roles) && user.roles.includes('Admin')
            const initial = user.name?.[0]?.toUpperCase() ?? '?'

            return (
              <div
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-3.5
                           flex items-center gap-3.5 cursor-pointer
                           hover:border-slate-300 transition-colors"
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center
                               flex-shrink-0 text-white font-medium text-[14px] ${
                    isUserAdmin ? 'bg-purple-700' : 'bg-blue-600'
                  }`}
                >
                  {initial}
                </div>

                {/* Identity block */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className="text-xs text-slate-500">{user.email}</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{user.dni}</span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{user.city}</span>
                  </div>
                </div>

                {/* Right cluster — desktop */}
                <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      isUserAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isUserAdmin ? 'Admin' : 'User'}
                  </span>
                  <span className="text-xs font-medium text-blue-600">Ver perfil ›</span>
                </div>

                {/* Right cluster — mobile (role badge only) */}
                <div className="flex items-center gap-2 md:hidden flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      isUserAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isUserAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}