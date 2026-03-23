import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { getUser, deleteUser } from '@/services/userService'
import { getProperties } from '@/services/propertyService'
import { getContracts } from '@/services/contractService'
import StatusBadge from '@/components/custom/StatusBadge'
import EnergyBadge from '@/components/custom/EnergyBadge'
import ContractCard from '@/components/custom/ContractCard'
import GroupLabel from '@/components/custom/GroupLabel'
import SectionTitleLink from '@/components/custom/SectionTitleLink'
import FieldValue from '@/components/custom/FieldValue'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import {
  HouseIcon,
  DocumentTextIcon,
  UserCircleIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  InfoIcon,
  SquaresIcon,
  BedIcon,
  WrenchIcon,
  WarningTriangleIcon,
} from '@/components/icons'
import { formatDate, formatCurrency, isCertExpiringSoon } from '@/utils/formatters'

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
        setProperties(
          Array.isArray(propertiesData)
            ? propertiesData.filter((p) => p.owner_id === profileUuid)
            : []
        )
        setContracts(Array.isArray(contractsData) ? contractsData : [])
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [profileUuid])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteUser(profileUuid)
      toast.success('Cuenta eliminada correctamente')
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
    return <LoadingSpinner />
  }

  // ── Error ──
  if (error && !profileData) {
    const msg =
      error.status === 403 ? 'No tienes permiso para ver este perfil.' :
      error.status === 404 ? 'Usuario no encontrado.' :
      error.status === 0   ? 'No se pudo conectar con el servidor.' :
      error.message ?? 'Se ha producido un error.'

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">{msg}</p>
      </div>
    )
  }

  // Group contracts by property_id
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
      <div className="flex items-center gap-1.5 mb-3.5 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 bg-white border border-slate-200
                     text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg
                     hover:bg-slate-50 transition-colors"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          Volver
        </button>
        <button
          onClick={() => navigate(paramUuid ? `/users/${paramUuid}/edit` : '/my-profile/edit')}
          className="inline-flex items-center gap-1.5 text-white text-xs font-medium
                     px-3 py-1.5 rounded-lg transition-colors"
          style={{ backgroundColor: accent }}
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-medium
                     px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
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
          SECTION 1 — User info card (unchanged)
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-2.5">

        {/* Profile hero */}
        <div className="flex items-center gap-3.5 px-5 py-[18px] border-b border-slate-100">
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center
                       font-semibold text-xl text-white flex-shrink-0"
            style={{ backgroundColor: avatarBg }}
          >
            {profileData?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-[18px] font-medium text-slate-900">{profileData?.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">Información del Propietario</p>
          </div>
        </div>

        {/* Two-column info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* LEFT — Personal */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-1.5 mb-3">
              <UserCircleIcon className="w-[11px] h-[11px] text-blue-600" />
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                Información Personal
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <FieldValue label="Nombre Completo" value={profileData?.name} />
              <FieldValue label="DNI/NIE/TIE" value={profileData?.dni} />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium block mb-0.5">
                  Correo
                </span>
                <span className="text-xs text-blue-600 font-medium">{profileData?.email ?? '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium block mb-0.5">
                  Teléfono
                </span>
                <span className="text-xs text-blue-600 font-medium">{profileData?.phone ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Address */}
          <div className="px-5 py-4 border-t md:border-t-0 md:border-l border-slate-100">
            <div className="flex items-center gap-1.5 mb-3">
              <MapPinIcon className="w-[11px] h-[11px] text-blue-600" />
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                Dirección
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              <FieldValue label="Calle" value={profileData?.address} />
              <FieldValue
                label="Ciudad"
                value={
                  profileData?.city && profileData?.postal_code
                    ? `${profileData.city} (${profileData.postal_code})`
                    : profileData?.city
                }
              />
              <FieldValue label="Provincia" value={profileData?.province} />
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 2 — Properties card (Spec B)
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-2.5">

        {/* Card header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center">
            <HouseIcon className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <SectionTitleLink
            title="Propiedades"
            count={properties.length}
            to="/properties"
          />
        </div>

        {/* Empty state */}
        {properties.length === 0 ? (
          <div className="text-center py-6 px-5">
            <p className="text-xs text-slate-400 mb-1.5">No hay propiedades registradas.</p>
            <Link to="/properties/create" className="text-xs text-blue-600 font-medium hover:underline">
              Añadir propiedad →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 px-5 py-4">
            {properties.map((property) => {
              const energyExpiring = isCertExpiringSoon(property.energy_certificate_expiry)
              const habitabilityExpiring = isCertExpiringSoon(property.habitability_certificate_expiry)

              return (
                <div
                  key={property.id}
                  onClick={() => navigate(`/properties/${property.id}`)}
                  className="border border-slate-200 rounded-[10px] p-3 flex flex-col gap-2.5
                             cursor-pointer hover:border-blue-300 hover:bg-[#fafcff]
                             transition-all duration-[140ms]"
                >
                  {/* Top row */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 bg-blue-50 rounded-[7px] flex items-center
                                    justify-center flex-shrink-0">
                      <HouseIcon className="w-[13px] h-[13px] text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-slate-900 leading-snug truncate">
                        {property.address}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{property.city}</p>
                    </div>
                  </div>

                  {/* Chips row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-[3px] text-[11px] text-slate-500">
                      <SquaresIcon className="w-[11px] h-[11px] text-slate-400" />
                      {property.surface_area} m²
                    </span>
                    <span className="inline-flex items-center gap-[3px] text-[11px] text-slate-500">
                      <BedIcon className="w-[11px] h-[11px] text-slate-400" />
                      {property.bedrooms} hab.
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {property.bathrooms} baño{property.bathrooms !== 1 ? 's' : ''}
                    </span>
                    <EnergyBadge rating={property.energy_certificate_rating} />
                  </div>

                  {/* Certificate warnings */}
                  {energyExpiring && (
                    <span className="inline-flex items-center gap-[3px] text-[11px] text-amber-700">
                      <WarningTriangleIcon className="w-[11px] h-[11px]" />
                      Cert. energético vence pronto · {formatDate(property.energy_certificate_expiry)}
                    </span>
                  )}
                  {habitabilityExpiring && (
                    <span className="inline-flex items-center gap-[3px] text-[11px] text-amber-700">
                      <WarningTriangleIcon className="w-[11px] h-[11px]" />
                      Cert. habitabilidad vence pronto · {formatDate(property.habitability_certificate_expiry)}
                    </span>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-[3px]">
                    <span className="text-[11px] font-medium text-blue-600 pointer-events-none">
                      Ver detalles ›
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          SECTION 3 — Contracts card (Spec B)
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        {/* Card header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center">
            <DocumentTextIcon className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <SectionTitleLink
            title="Contratos"
            count={contracts.length}
            to="/contracts"
          />
        </div>

        {/* Empty state */}
        {contracts.length === 0 ? (
          <div className="text-center py-6 px-5">
            <p className="text-xs text-slate-400 mb-1.5">No hay contratos registrados.</p>
            {properties.length > 0 ? (
              <Link to="/contracts/new" className="text-xs text-blue-600 font-medium hover:underline">
                Crear primer contrato →
              </Link>
            ) : (
              <Link to="/properties/create" className="text-xs text-blue-600 font-medium hover:underline">
                Añadir una propiedad primero →
              </Link>
            )}
          </div>
        ) : (
          <div className="px-5 py-4 flex flex-col gap-1.5">
            {properties.map((property) => {
              const propContracts = contractsByProperty[property.id] ?? []
              if (propContracts.length === 0) return null
              return (
                <div key={property.id} className="flex flex-col gap-1.5 mt-2.5 first:mt-0">
                  <GroupLabel text={`${property.address} · ${property.city}`} />
                  {propContracts.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      property={property}
                      variant="full"
                    />
                  ))}
                </div>
              )
            })}

            {/* Edge case: contracts whose property is not in this owner's list */}
            {contracts
              .filter((c) => !properties.some((p) => p.id === c.property_id))
              .map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  property={null}
                  variant="full"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}