import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getProperties } from '@/services/propertyService'
import { getContracts } from '@/services/contractService'

// ─── Icons ───────────────────────────────────────────────────────────────────

function HouseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function DocumentTextIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function InfoCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  )
}

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ArchiveBoxIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

function PrinterIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function ArrowRightOnRectangleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}

function DocumentListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )
}

function CheckmarkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

// ─── Navbar (public variant) ─────────────────────────────────────────────────

function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}
           className="px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-[7px] flex items-center justify-center flex-shrink-0">
            <HouseIcon className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 500 }} className="text-slate-900">
            Rentoo
          </span>
        </div>
        {/* Auth links */}
        <div className="flex items-center gap-2">
          <Link to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900
                           px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            Iniciar sesión
          </Link>
          <Link to="/register"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                           px-3.5 py-1.5 rounded-lg transition-colors">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Authenticated Navbar (simplified, no bell/dropdown needed on welcome) ───

function AuthNavbar({ user, isAdmin }) {
  const roleColor = isAdmin ? 'bg-purple-700' : 'bg-blue-600'
  const initial = user?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}
           className="px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 ${roleColor} rounded-[7px] flex items-center justify-center flex-shrink-0`}>
            <HouseIcon className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 500 }} className="text-slate-900">
            Rentoo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-slate-900
                           px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            Dashboard
          </Link>
          <div className={`w-8 h-8 ${roleColor} rounded-full flex items-center justify-center
                           text-white text-sm font-semibold`}>
            {initial}
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-center">
      <p className="text-sm text-slate-600">
        © 2026 Rentoo - Sistema de Gestión de Contratos de Alquileres
      </p>
      <p className="text-sm text-slate-600 mt-0.5">
        Desarrollado por Flavio De Souza
      </p>
    </footer>
  )
}

// ─── Feature card checklist item ─────────────────────────────────────────────

function CheckItem({ children, color }) {
  return (
    <li className="flex items-start gap-2">
      <CheckmarkIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
      <span className="text-sm text-slate-600">{children}</span>
    </li>
  )
}

// ─── Característica item ──────────────────────────────────────────────────────

function CaracteristicaItem({ icon: Icon, iconBg, iconColor, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Welcome() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // For authenticated CTA: do we have properties?
  const [hasProperties, setHasProperties] = useState(false)
  const [ctaLoading, setCtaLoading] = useState(false)
  const [redirectChecked, setRedirectChecked] = useState(false)

  useEffect(() => {
    if (!user) {
      setRedirectChecked(true)
      return
    }

    // Authenticated: check contracts to decide whether to redirect
    const checkState = async () => {
      setCtaLoading(true)
      try {
        const [props, contracts] = await Promise.all([
          getProperties(),
          getContracts(),
        ])

        const propertiesArray = Array.isArray(props) ? props : []
        const contractsArray = Array.isArray(contracts) ? contracts : []

        setHasProperties(propertiesArray.length > 0)

        // Case: has active or finalized contracts → redirect to dashboard
        const hasEligible = contractsArray.some(
          (c) => c.status === 'active' || c.status === 'finalized'
        )
        if (hasEligible) {
          navigate('/dashboard', { replace: true })
          return
        }
      } catch {
        // Network error — fall through, show authenticated CTA state
      } finally {
        setCtaLoading(false)
        setRedirectChecked(true)
      }
    }

    checkState()
  }, [user, navigate])

  // Don't flash public content while checking auth/contracts
  if (user && !redirectChecked) return null

  const adminMode = user && isAdmin()
  const primaryColor = adminMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-600 hover:bg-blue-700'
  const primaryText = adminMode ? 'text-purple-700' : 'text-blue-600'
  const primaryBorder = adminMode ? 'border-purple-700 hover:bg-purple-50' : 'border-blue-600 hover:bg-blue-50'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Navbar */}
      {user
        ? <AuthNavbar user={user} isAdmin={adminMode} />
        : <PublicNavbar />
      }

      {/* Main content */}
      <main className="flex-1">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }} className="px-6">

          {/* ── Hero section ─────────────────────────────────────────────── */}
          <section className="text-center py-[72px]">

            {/* Hero icon */}
            <div className="w-20 h-20 bg-blue-100 rounded-full inline-flex
                            items-center justify-center mb-6">
              <HouseIcon className="w-11 h-11 text-blue-600" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Bienvenido a Rentoo
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-600 max-w-xl mx-auto mb-5 leading-relaxed">
              Sistema integral de gestión de alquileres residenciales
              para propietarios en España
            </p>

            {/* LAU badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-9
                            bg-blue-50 border border-blue-200 rounded-lg">
              <InfoCircleIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-blue-800 font-medium">
                Cumplimiento con LAU y normativa catalana de vivienda
              </span>
            </div>

            {/* ── CTAs ─────────────────────────────────────────────────── */}

            {!user && (
              /* PUBLIC state */
              <div>
                <div className="flex gap-3 justify-center mb-2">
                  <Link to="/login"
                        className="bg-blue-600 text-white font-medium text-base
                                   px-7 py-2.5 rounded-lg inline-flex items-center gap-2
                                   hover:bg-blue-700 transition-colors">
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    Iniciar sesión
                  </Link>
                  <Link to="/register"
                        className="bg-white text-blue-600 font-medium text-base
                                   px-7 py-2.5 rounded-lg border-2 border-blue-600
                                   hover:bg-blue-50 transition-colors">
                    Registrarse
                  </Link>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ¿Ya tienes cuenta? Inicia sesión para gestionar tus propiedades
                </p>
              </div>
            )}

            {user && (
              /* AUTHENTICATED state (no eligible contracts) */
              <div>
                <p className="text-sm text-slate-600 mb-3">
                  Hola, {user.name}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    disabled={ctaLoading}
                    onClick={() => navigate(hasProperties ? '/contracts/new' : '/properties/create')}
                    className={`${primaryColor} text-white font-medium text-base
                                px-7 py-2.5 rounded-lg inline-flex items-center gap-2
                                transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {ctaLoading
                      ? <span className="w-4 h-4 border-2 border-white border-t-transparent
                                         rounded-full animate-spin" />
                      : <PlusIcon className="w-4 h-4" />
                    }
                    Crear contrato
                  </button>
                  <Link to="/contracts"
                        className={`bg-white ${primaryText} font-medium text-base
                                    px-7 py-2.5 rounded-lg border-2 ${primaryBorder}
                                    inline-flex items-center gap-2 transition-colors`}>
                    <DocumentListIcon className="w-4 h-4" />
                    Ver mis contratos
                  </Link>
                </div>
              </div>
            )}

          </section>

          {/* ── Feature cards ─────────────────────────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
              Gestiona todo desde un solo lugar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Propietarios */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-3 mb-2">
                  Propietarios
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Gestiona la información completa de los propietarios: datos personales,
                  DNI/NIE/TIE, datos de contacto y direcciones fiscales.
                </p>
                <ul className="space-y-2">
                  <CheckItem color="text-blue-600">Validación de DNI/NIE/TIE español</CheckItem>
                  <CheckItem color="text-blue-600">Gestión de múltiples propiedades</CheckItem>
                  <CheckItem color="text-blue-600">Perfiles completos y actualizables</CheckItem>
                </ul>
              </div>

              {/* Propiedades */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <HouseIcon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-3 mb-2">
                  Propiedades
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Gestiona el inventario de inmuebles con todos los detalles técnicos, legales
                  y certificaciones exigidas por la normativa española.
                </p>
                <ul className="space-y-2">
                  <CheckItem color="text-green-600">Referencias catastrales validadas</CheckItem>
                  <CheckItem color="text-green-600">Certificados energéticos y habitabilidad</CheckItem>
                  <CheckItem color="text-green-600">Gestión de gastos (IBI, comunidad)</CheckItem>
                </ul>
              </div>

              {/* Contratos */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-3 mb-2">
                  Contratos
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Genera contratos de arrendamiento conformes con la LAU, incluyendo
                  cláusulas específicas y documentos listos para imprimir.
                </p>
                <ul className="space-y-2">
                  <CheckItem color="text-indigo-600">Conformes con LAU vigente</CheckItem>
                  <CheckItem color="text-indigo-600">Cálculo automático de depósitos</CheckItem>
                  <CheckItem color="text-indigo-600">Documentos imprimibles y firmables</CheckItem>
                </ul>
              </div>

            </div>
          </section>

          {/* ── Características principales ───────────────────────────────── */}
          <section className="mb-16">
            <div className="bg-slate-100 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
                Características Principales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CaracteristicaItem
                  icon={ShieldCheckIcon}
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                  title="Cumplimiento Legal"
                  desc="Validación automática de documentos conforme a la normativa española y catalana"
                />
                <CaracteristicaItem
                  icon={ClockIcon}
                  iconBg="bg-green-100"
                  iconColor="text-green-600"
                  title="Ahorro de Tiempo"
                  desc="Genera contratos completos en minutos, no en horas"
                />
                <CaracteristicaItem
                  icon={ArchiveBoxIcon}
                  iconBg="bg-indigo-100"
                  iconColor="text-indigo-600"
                  title="Gestión Centralizada"
                  desc="Toda la información de alquileres en un solo lugar"
                />
                <CaracteristicaItem
                  icon={PrinterIcon}
                  iconBg="bg-amber-100"
                  iconColor="text-amber-700"
                  title="Documentos Profesionales"
                  desc="Contratos listos para imprimir con formato legal estándar"
                />
              </div>
            </div>
          </section>

          {/* ── Stat cards ───────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-blue-600">150+</p>
                <p className="text-sm text-slate-600 mt-1">Propietarios registrados</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-green-600">300+</p>
                <p className="text-sm text-slate-600 mt-1">Propiedades gestionadas</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-indigo-600">500+</p>
                <p className="text-sm text-slate-600 mt-1">Contratos generados</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}