import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getUser, deleteUser } from '@/services/userService'
import { getProperties } from '@/services/propertyService'
import { getContracts } from '@/services/contractService'
import StatusBadge from '@/components/custom/StatusBadge'

// ─── SVG Icons ───────────────────────────────────────────────────────────────

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
function DocumentTextIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414
           a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
function UserCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0
           3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function PencilIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828
           L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}
function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
           a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
function ExclamationTriangleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4
           c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}
function InfoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function GridIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z
           M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z
           M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z
           M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function LabelValue({ label, value, valueClass = 'text-sm text-slate-900' }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className={valueClass}>{value ?? '—'}</p>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ─── Delete confirmation modal ────────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-slate-900/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-7 max-w-[420px] w-full">
        <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon className="w-[22px] h-[22px] text-red-600" />
        </div>
        <h2 className="text-[17px] font-bold text-slate-900 mb-2">¿Eliminar cuenta?</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          Esta acción es permanente e irreversible. Se eliminarán todos tus datos personales.
          <br /><br />
          Tus propiedades y contratos deben eliminarse antes de poder cerrar la cuenta.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600
                       text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors
                       disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg
                       hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Eliminando…' : 'Eliminar cuenta'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Profile() {
  const { uuid: paramUuid } = useParams()
  const { user: authUser, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const topRef = useRef(null)

  // UUID resolution: /users/:uuid uses param, /my-profile uses auth context
  const profileUuid = paramUuid ?? authUser?.id

  const [profileData, setProfileData] = useState(null)
  const [properties, setProperties] = useState([])
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [conflictBanner, setConflictBanner] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch all three resources in parallel
  useEffect(() => {
    if (!profileUuid) return

    setLoading(true)
    setError(null)

    Promise.all([
      getUser(profileUuid),
      getProperties(),
      getContracts(),
    ])
      .then(([userData, propertiesData, contractsData]) => {
        setProfileData(userData)
        // Filter to this owner's properties and contracts
        setProperties(
          Array.isArray(propertiesData)
            ? propertiesData.filter((p) => p.owner_id === profileUuid)
            : []
        )
        setContracts(Array.isArray(contractsData) ? contractsData : [])
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [profileUuid])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteUser(profileUuid)
      // Own account deleted — clear session and go to login
      await logout()
      navigate('/login', { replace: true })
    } catch (err) {
      setShowDeleteModal(false)
      if (err.status === 409) {
        setConflictBanner(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setError(err)
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  // Role-based accent
  const accent = isAdmin() ? '#7e22ce' : '#1d4ed8'
  const avatarBg = profileData?.roles?.includes('Admin') ? '#7e22ce' : '#1d4ed8'

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner />
      </div>
    )
  }

  // ── Error ──
  if (error && !profileData) {
    const msg =
      error.status === 403 ? 'No tienes permiso para ver este perfil.' :
      error.status === 404 ? 'Usuario no encontrado.' :
      error.status === 0  ? 'No se pudo conectar con el servidor.' :
      error.message ?? 'Se ha producido un error.'

    return (
      <div className="min-h-screen bg-slate-50 px-6 py-8" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{msg}</p>
        </div>
      </div>
    )
  }

  // ── Group contracts by property_id ──
  const contractsByProperty = contracts.reduce((acc, contract) => {
    const pid = contract.property_id
    if (!acc[pid]) acc[pid] = []
    acc[pid].push(contract)
    return acc
  }, {})

  return (
    <div ref={topRef}>
      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}

      {/* 409 conflict banner */}
      {conflictBanner && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
          <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 leading-relaxed">
            No puedes eliminar tu cuenta mientras tengas propiedades registradas.{' '}
            <Link to="/properties" className="text-blue-600 font-medium underline">
              Elimina primero tus propiedades.
            </Link>
          </p>
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 bg-white border border-slate-200
                     text-slate-600 text-sm font-medium px-3 py-1.5 rounded-lg
                     hover:bg-slate-50 transition-colors"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          Volver
        </button>

        {/* Edit */}
        <button
          onClick={() =>
            navigate(paramUuid ? `/users/${paramUuid}/edit` : '/my-profile/edit')
          }
          className="inline-flex items-center gap-1 text-white text-sm font-medium
                     px-3.5 py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: accent }}
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Editar
        </button>

        {/* Delete */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1 bg-red-600 text-white text-sm font-medium
                     px-3.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Eliminar
        </button>

        {/* Admin role badge (admin viewing another user) */}
        {isAdmin() && paramUuid && (
          <span className="ml-auto inline-flex items-center px-2.5 py-1 rounded-full
                           text-xs font-medium bg-purple-100 text-purple-800">
            {profileData?.roles?.[0] ?? 'User'}
          </span>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 1 — User info card
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-5">

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center
                       font-semibold text-xl text-white flex-shrink-0"
            style={{ backgroundColor: avatarBg }}
          >
            {profileData?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">{profileData?.name}</p>
            <p className="text-sm text-slate-500">Información del Propietario</p>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* LEFT — Personal */}
          <div className="md:pr-6">
            <div className="flex items-center gap-1.5 mb-3.5">
              <UserCircleIcon className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-slate-500">Información Personal</span>
            </div>
            <LabelValue label="Nombre Completo" value={profileData?.name} />
            <LabelValue label="DNI/NIE/TIE" value={profileData?.dni} />
            <LabelValue
              label="Correo"
              value={profileData?.email}
              valueClass="text-sm text-blue-600"
            />
            <LabelValue
              label="Teléfono"
              value={profileData?.phone}
              valueClass="text-sm text-blue-600"
            />
          </div>

          {/* RIGHT — Address */}
          <div className="md:border-l md:border-slate-100 md:pl-6 mt-6 md:mt-0">
            <div className="flex items-center gap-1.5 mb-3.5">
              <MapPinIcon className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-slate-500">Dirección</span>
            </div>
            <LabelValue label="Calle" value={profileData?.address} />
            <LabelValue
              label="Ciudad"
              value={
                profileData?.city && profileData?.postal_code
                  ? `${profileData.city} (${profileData.postal_code})`
                  : profileData?.city
              }
            />
            <LabelValue label="Provincia" value={profileData?.province} />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 2 — Properties card
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-5">

        {/* Card header */}
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
          <HouseIcon className="w-[18px] h-[18px] text-blue-600" />
          <span className="text-base font-semibold text-slate-900">Propiedades</span>
          <span className="text-sm text-slate-400 font-normal">({properties.length})</span>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-400 mb-2">No hay propiedades registradas.</p>
            <Link to="/properties/create" className="text-sm text-blue-600 font-medium hover:underline">
              Añadir propiedad →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {properties.map((property) => (
              <div key={property.id} className="border border-slate-200 rounded-lg p-3.5 flex flex-col gap-2.5">
                {/* Top row */}
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <HouseIcon className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 leading-snug truncate">
                      {property.address}
                    </p>
                    <p className="text-xs text-slate-500">{property.city}</p>
                  </div>
                </div>

                {/* Meta chips */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <GridIcon className="w-3 h-3 text-slate-400" />
                    {property.surface_area} m²
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <HouseIcon className="w-3 h-3 text-slate-400" />
                    {property.bedrooms} hab.
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <MapPinIcon className="w-3 h-3 text-slate-400" />
                    {property.bathrooms} baños
                  </span>
                </div>

                {/* Ver detalles link */}
                <Link
                  to={`/properties/${property.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                >
                  Ver detalles
                  <ChevronRightIcon className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 3 — Contracts card
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">

        {/* Card header */}
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
          <DocumentTextIcon className="w-[18px] h-[18px] text-blue-600" />
          <span className="text-base font-semibold text-slate-900">Contratos</span>
          <span className="text-sm text-slate-400 font-normal">({contracts.length})</span>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-400 mb-2">No hay contratos registrados.</p>
            <Link
              to={properties.length > 0 ? '/contracts/new' : '/properties/create'}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              {properties.length > 0 ? 'Añadir contrato →' : 'Añade primero una propiedad →'}
            </Link>
          </div>
        ) : (
          <div>
            {properties.map((property, propIndex) => {
              const propContracts = contractsByProperty[property.id] ?? []
              if (propContracts.length === 0) return null

              return (
                <div key={property.id}>
                  {/* Group label */}
                  <div className="flex items-center gap-2 my-3">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {property.address} · {property.city}
                    </span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  {/* Contract rows */}
                  {propContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="border border-slate-200 rounded-lg px-4 py-3.5
                                 flex items-center gap-3 mb-2.5 last:mb-0"
                    >
                      {/* Left — main info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {contract.tenant1_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {property.address} · {property.city}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Inicio: {formatDate(contract.start_date)} ·{' '}
                          Fin: {contract.end_date ? formatDate(contract.end_date) : 'indefinido'}
                        </p>
                      </div>

                      {/* Right — badge + rent + link */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <StatusBadge status={contract.status} />
                        <span className="text-sm font-semibold text-slate-900">
                          {Number(contract.monthly_rent).toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </span>
                        <Link
                          to={`/contracts/${contract.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium
                                     text-blue-600 hover:underline"
                        >
                          Ver
                          <ChevronRightIcon className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Contracts that belong to properties not in this owner's list (edge case) */}
            {contracts
              .filter((c) => !properties.some((p) => p.id === c.property_id))
              .map((contract) => (
                <div
                  key={contract.id}
                  className="border border-slate-200 rounded-lg px-4 py-3.5
                             flex items-center gap-3 mb-2.5 last:mb-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{contract.tenant1_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Inicio: {formatDate(contract.start_date)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge status={contract.status} />
                    <Link
                      to={`/contracts/${contract.id}`}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Ver →
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
