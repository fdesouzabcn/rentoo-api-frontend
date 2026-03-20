import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getFinancialSummary } from '@/services/financialService'
import { HouseIcon, PlusIcon, BellIcon, UserIcon, MenuIcon, CloseIcon, ChevronRightIcon } from '@/components/icons'

// ─── Nav link helper ──────────────────────────────────────────────────────────

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

// ─── Mobile nav link with active pill ────────────────────────────────────────

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
      {/* ── Main bar ──────────────────────────────────────────────────────── */}
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
                style={{ width: '28px', height: '28px', backgroundColor: accent }}
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
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Crear Nuevo
            </button>

            {/* Bell icon */}
            <div ref={bellRef} className="relative">
              <button
                onClick={() => { setBellOpen((v) => !v); setAvatarOpen(false) }}
                className="relative flex items-center justify-center hover:bg-slate-100
                           transition-colors"
                style={{ width: '34px', height: '34px', borderRadius: '8px' }}
                aria-label="Notificaciones"
              >
                <BellIcon className="w-5 h-5 text-slate-600" />
                {contractsExpiring > 0 && (
                  <span
                    className="absolute top-1 right-1 rounded-full bg-red-500"
                    style={{
                      width: '7px',
                      height: '7px',
                      border: '1.5px solid white',
                    }}
                  />
                )}
              </button>

              {bellOpen && contractsExpiring > 0 && (
                <div
                  className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg
                             border border-slate-200 w-64 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      Tienes {contractsExpiring} contrato{contractsExpiring !== 1 ? 's' : ''} por vencer
                    </p>
                  </div>
                  <div className="px-4 py-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setBellOpen(false)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Ver panel →
                    </Link>
                  </div>
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
