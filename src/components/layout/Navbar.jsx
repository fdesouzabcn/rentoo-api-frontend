import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getFinancialSummary } from '@/services/financialService'

// ─── SVG Icons ──────────────────────────────────────────────────────────────

function HouseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10
           a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4
           a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118
           a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

// ─── Nav link helper ─────────────────────────────────────────────────────────

function NavLink({ to, children, isAdmin, onClick }) {
  const location = useLocation()
  const active = location.pathname === to || location.pathname.startsWith(to + '/')

  const activeColour = isAdmin ? '#7e22ce' : '#1d4ed8'
  const adminLink = to === '/admin/users'

  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-sm text-slate-700 hover:text-slate-900 transition-colors relative pb-1"
      style={{
        fontWeight: active ? 500 : 400,
        color: active ? (adminLink ? '#7e22ce' : activeColour) : adminLink ? '#7e22ce' : undefined,
        borderBottom: active ? `2px solid ${adminLink ? '#7e22ce' : activeColour}` : '2px solid transparent',
      }}
    >
      {children}
    </Link>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [contractsExpiring, setContractsExpiring] = useState(0)

  const avatarRef = useRef(null)
  const bellRef = useRef(null)

  // Close dropdowns on route change
  useEffect(() => {
    setMobileOpen(false)
    setAvatarOpen(false)
    setBellOpen(false)
  }, [location.pathname])

  // Fetch expiring contracts count (only when authenticated)
  useEffect(() => {
    if (!user) return
    getFinancialSummary(user.id)
      .then((data) => setContractsExpiring(data?.contracts_expiring ?? 0))
      .catch(() => {}) // Non-critical — fail silently
  }, [user])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false)
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleCreateNew = () => {
    if (user) {
      navigate('/properties/create')
    } else {
      navigate('/login')
    }
    setMobileOpen(false)
  }

  // Role-based accent colour
  const accent = isAdmin() ? '#7e22ce' : '#1d4ed8'
  const accentHover = isAdmin() ? '#6b21a8' : '#1e40af'

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 w-full bg-white"
        style={{ borderBottom: '1px solid #e2e8f0', height: '56px' }}
      >
        <div
          className="h-full flex items-center justify-between px-6"
          style={{ maxWidth: '1100px', margin: '0 auto' }}
        >
          {/* LEFT — Logo + desktop nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
              <div
                className="flex items-center justify-center rounded-[7px] flex-shrink-0"
                style={{
                  width: '28px', height: '28px',
                  backgroundColor: accent,
                }}
              >
                <HouseIcon className="w-4 h-4 text-white" />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 500, color: '#0f172a' }}>
                Rentoo
              </span>
            </Link>

            {/* Desktop nav — hidden on mobile */}
            {user && (
              <nav className="hidden md:flex items-center gap-6">
                <NavLink to="/dashboard" isAdmin={isAdmin()}>Inicio</NavLink>
                <NavLink to="/properties" isAdmin={isAdmin()}>Propiedades</NavLink>
                <NavLink to="/contracts" isAdmin={isAdmin()}>Contratos</NavLink>
                {isAdmin() && (
                  <NavLink to="/admin/users" isAdmin={isAdmin()}>Usuarios</NavLink>
                )}
              </nav>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* "+ Crear Nuevo" button */}
            <button
              onClick={handleCreateNew}
              className="hidden md:inline-flex items-center gap-1.5 text-white text-[13px]
                         font-medium transition-colors duration-150"
              style={{
                backgroundColor: accent,
                borderRadius: '7px',
                padding: '7px 14px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accentHover }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = accent }}
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Crear Nuevo
            </button>

            {/* Bell notification */}
            <div ref={bellRef} className="relative">
              <button
                onClick={() => { setBellOpen((v) => !v); setAvatarOpen(false) }}
                className="relative flex items-center justify-center rounded-[8px]
                           transition-colors hover:bg-slate-100"
                style={{ width: '34px', height: '34px' }}
                aria-label="Notificaciones"
              >
                <BellIcon className="w-5 h-5 text-slate-600" />
                {contractsExpiring > 0 && (
                  <span
                    className="absolute top-1 right-1 rounded-full bg-red-500"
                    style={{ width: '7px', height: '7px', border: '1.5px solid white' }}
                  />
                )}
              </button>

              {/* Bell dropdown */}
              {bellOpen && (
                <div
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200
                             w-64 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {contractsExpiring > 0
                        ? `Tienes ${contractsExpiring} contrato${contractsExpiring > 1 ? 's' : ''} por vencer`
                        : 'Sin notificaciones pendientes'
                      }
                    </p>
                  </div>
                  {contractsExpiring > 0 && (
                    <div className="px-4 py-3">
                      <Link
                        to="/dashboard"
                        onClick={() => setBellOpen(false)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Ver panel →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Avatar (authenticated) */}
            {user && (
              <div ref={avatarRef} className="relative hidden md:block">
                <button
                  onClick={() => { setAvatarOpen((v) => !v); setBellOpen(false) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                             text-white text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: accent }}
                  aria-label="Perfil"
                >
                  {user.name?.[0]?.toUpperCase() ?? '?'}
                </button>

                {/* Avatar dropdown */}
                {avatarOpen && (
                  <div
                    className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg
                               border border-slate-200 w-52 z-50 overflow-hidden"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        to="/my-profile"
                        onClick={() => setAvatarOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Mi perfil
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setAvatarOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Dashboard
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium
                                   hover:bg-red-50 transition-colors"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Public profile icon (unauthenticated) */}
            {!user && (
              <div ref={avatarRef} className="relative hidden md:block">
                <button
                  onClick={() => { setAvatarOpen((v) => !v); setBellOpen(false) }}
                  className="w-8 h-8 rounded-full bg-slate-400 hover:bg-slate-500
                             flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Acceso"
                >
                  <UserIcon className="w-4 h-4 text-white" />
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg
                                  border border-slate-200 w-48 z-50 overflow-hidden py-1">
                    <Link
                      to="/login"
                      onClick={() => setAvatarOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setAvatarOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center rounded-[8px]
                         hover:bg-slate-100 transition-colors"
              style={{ padding: '8px' }}
              aria-label="Menú"
            >
              {mobileOpen
                ? <CloseIcon className="w-5 h-5 text-slate-700" />
                : <MenuIcon className="w-5 h-5 text-slate-700" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu panel ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed top-[56px] left-0 right-0 z-50 bg-white
                     border-t border-slate-200 shadow-md"
        >
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <MobileNavLink to="/dashboard" accent={accent} onClick={() => setMobileOpen(false)}>
                  Inicio
                </MobileNavLink>
                <MobileNavLink to="/properties" accent={accent} onClick={() => setMobileOpen(false)}>
                  Propiedades
                </MobileNavLink>
                <MobileNavLink to="/contracts" accent={accent} onClick={() => setMobileOpen(false)}>
                  Contratos
                </MobileNavLink>
                {isAdmin() && (
                  <MobileNavLink to="/admin/users" accent="#7e22ce" onClick={() => setMobileOpen(false)}>
                    Usuarios
                  </MobileNavLink>
                )}
                <MobileNavLink to="/my-profile" accent={accent} onClick={() => setMobileOpen(false)}>
                  Mi perfil
                </MobileNavLink>

                <div className="border-t border-slate-200 pt-2 mt-2">
                  {/* Mobile create button */}
                  <button
                    onClick={handleCreateNew}
                    className="w-full flex items-center justify-center gap-1.5
                               text-white text-sm font-medium py-2.5 rounded-lg mt-1
                               transition-colors"
                    style={{ backgroundColor: accent }}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Crear Nuevo
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false) }}
                    className="w-full text-left px-3 py-2.5 mt-1 text-sm text-red-600
                               font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" accent="#1d4ed8" onClick={() => setMobileOpen(false)}>
                  Iniciar sesión
                </MobileNavLink>
                <MobileNavLink to="/register" accent="#1d4ed8" onClick={() => setMobileOpen(false)}>
                  Registrarse
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Mobile nav link with active pill
function MobileNavLink({ to, children, accent, onClick }) {
  const location = useLocation()
  const active = location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors"
      style={{
        backgroundColor: active ? accent : undefined,
        color: active ? 'white' : '#475569',
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </Link>
  )
}
