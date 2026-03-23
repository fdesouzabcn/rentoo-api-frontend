import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getProperties, deleteProperty } from '@/services/propertyService'
import { getContracts } from '@/services/contractService'
import { getUsers } from '@/services/userService'
import EnergyBadge from '@/components/custom/EnergyBadge'
import ContractCard from '@/components/custom/ContractCard'
import GroupLabel from '@/components/custom/GroupLabel'
import SectionTitleLink from '@/components/custom/SectionTitleLink'
import FieldValue from '@/components/custom/FieldValue'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import {
  HouseIcon,
  DocumentTextIcon,
  EuroCircleIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  WarningTriangleIcon,
  ExclamationTriangleIcon,
  InfoIcon,
  SquaresIcon,
  BedIcon,
  ShieldCheckIcon,
} from '@/components/icons'
import { formatCurrency, formatDate, isCertExpiringSoon } from '@/utils/formatters'

// ─── Delete modal ─────────────────────────────────────────────────────────────

function DeletePropertyModal({ onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 bg-slate-900/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-7 max-w-[420px] w-full">
        <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon className="w-[22px] h-[22px] text-red-600" />
        </div>
        <h3 className="text-[17px] font-bold text-slate-900 mb-2">¿Eliminar propiedad?</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          Esta acción eliminará permanentemente la propiedad y no se puede deshacer.
          <br /><br />
          Debes eliminar los contratos asociados antes de poder eliminar esta propiedad.
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600
                       text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium
                       rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar propiedad'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Property row (expandable) ────────────────────────────────────────────────

function PropertyRow({ property, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const energyExpiring = isCertExpiringSoon(property.energy_certificate_expiry)
  const habitabilityExpiring = isCertExpiringSoon(property.habitability_certificate_expiry)

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Row header — always visible, click to expand */}
      <div
        className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-slate-50
                   transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-[34px] h-[34px] bg-blue-50 rounded-lg flex items-center
                        justify-center flex-shrink-0">
          <HouseIcon className="w-4 h-4 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{property.address}</p>
          <p className="text-xs text-slate-500 mt-px">
            {property.city} · {property.postal_code} · {property.province}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <SquaresIcon className="w-3 h-3 text-slate-400" />
            {property.surface_area} m²
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <BedIcon className="w-3 h-3 text-slate-400" />
            {property.bedrooms} hab.
          </span>
          <span className="text-xs text-slate-500">
            {property.bathrooms} baño{property.bathrooms !== 1 ? 's' : ''}
          </span>
          <EnergyBadge rating={property.energy_certificate_rating} />
          {(energyExpiring || habitabilityExpiring) && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700">
              <WarningTriangleIcon className="w-3 h-3" />
              Cert. vence pronto
            </span>
          )}
        </div>

        <ChevronRightIcon
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-[180ms] ${
            expanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-4 flex flex-col gap-3.5">

          {/* Financial info */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <EuroCircleIcon className="w-[11px] h-[11px] text-slate-400" />
              <span className="text-[10px] uppercase tracking-wide text-slate-400">
                Información financiera
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FieldValue label="IBI anual"       value={formatCurrency(property.ibi_annual_amount)} />
              <FieldValue label="Comunidad/mes"   value={formatCurrency(property.community_fees_monthly)} />
              <FieldValue label="Basura anual"    value={formatCurrency(property.garbage_fees_annual)} />
              <FieldValue label="Último alquiler" value={formatCurrency(property.last_rent_amount)} />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Certificates */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldCheckIcon className="w-[11px] h-[11px] text-slate-400" />
              <span className="text-[10px] uppercase tracking-wide text-slate-400">
                Certificados y documentación
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Energético */}
              <div className={`bg-slate-50 rounded-lg px-3 py-2.5 flex flex-col gap-1.5 ${
                energyExpiring ? 'border border-amber-200' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    Certificado energético
                  </span>
                  <EnergyBadge rating={property.energy_certificate_rating} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FieldValue label="Número" value={property.energy_certificate_number} />
                  <div>
                    {energyExpiring ? (
                      <>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium block mb-0.5">
                          Vencimiento
                        </span>
                        <span className="text-xs text-amber-700 flex items-center gap-1">
                          <WarningTriangleIcon className="w-[11px] h-[11px]" />
                          {formatDate(property.energy_certificate_expiry)} · vence pronto
                        </span>
                      </>
                    ) : (
                      <FieldValue label="Vencimiento" value={formatDate(property.energy_certificate_expiry)} />
                    )}
                  </div>
                </div>
              </div>

              {/* Habitabilidad */}
              <div className={`bg-slate-50 rounded-lg px-3 py-2.5 flex flex-col gap-1.5 ${
                habitabilityExpiring ? 'border border-amber-200' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    Cédula de habitabilidad
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FieldValue label="Número" value={property.habitability_certificate_number} />
                  <div>
                    {habitabilityExpiring ? (
                      <>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium block mb-0.5">
                          Vencimiento
                        </span>
                        <span className="text-xs text-amber-700 flex items-center gap-1">
                          <WarningTriangleIcon className="w-[11px] h-[11px]" />
                          {formatDate(property.habitability_certificate_expiry)} · vence pronto
                        </span>
                      </>
                    ) : (
                      <FieldValue label="Vencimiento" value={formatDate(property.habitability_certificate_expiry)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}/edit`) }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500
                         border border-slate-200 rounded-[7px] px-2.5 py-1.5
                         hover:bg-slate-50 transition-colors"
            >
              <PencilIcon className="w-3 h-3" />
              Editar
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(property) }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600
                         border border-[#fca5a5] rounded-[7px] px-2.5 py-1.5
                         hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="w-3 h-3" />
              Eliminar
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}`) }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600
                         border border-blue-600 rounded-[7px] px-2.5 py-1.5
                         hover:bg-blue-50 transition-colors"
            >
              Ver detalles
              <ChevronRightIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PropertiesList() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [properties, setProperties] = useState([])
  const [contracts, setContracts] = useState([])
  const [usersMap, setUsersMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [conflictBanner, setConflictBanner] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const calls = [getProperties(), getContracts()]
        if (isAdmin()) calls.push(getUsers())

        const results = await Promise.all(calls)
        setProperties(results[0])
        setContracts(results[1])

        if (isAdmin() && results[2]) {
          const map = {}
          results[2].forEach((u) => { map[u.id] = u.name })
          setUsersMap(map)
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteProperty(deleteTarget.id)
      setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteTarget(null)
      if (err.status === 409) {
        setConflictBanner(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setError(err)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error && !conflictBanner) {
    const msg = error.status === 403
      ? 'No tienes permiso para ver estas propiedades.'
      : error.status === 0
        ? 'No se pudo conectar con el servidor.'
        : error.message ?? 'Ha ocurrido un error inesperado.'
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
        <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">{msg}</p>
      </div>
    )
  }

  // Group contracts by property id
  const contractsByProperty = contracts.reduce((acc, contract) => {
    const pid = contract.property_id
    if (!acc[pid]) acc[pid] = []
    acc[pid].push(contract)
    return acc
  }, {})

  // ── Admin: group properties by owner ──────────────────────────────────────
  // Build sorted list of unique owner IDs (A→Z by name) for admin grouping.
  const ownersSorted = isAdmin()
    ? [...new Set(properties.map((p) => p.owner_id))].sort((a, b) => {
        const nameA = usersMap[a] ?? a
        const nameB = usersMap[b] ?? b
        return nameA.localeCompare(nameB, 'es')
      })
    : []

  return (
    <div>
      {/* 409 conflict banner */}
      {conflictBanner && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start mb-4">
          <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            No puedes eliminar esta propiedad porque tiene contratos asociados.{' '}
            <button
              type="button"
              onClick={() => navigate('/contracts')}
              className="text-blue-600 font-medium underline"
            >
              Elimina primero los contratos.
            </button>
          </p>
        </div>
      )}

      {/* Page header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-xl font-medium text-slate-900">Mis propiedades</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {properties.length} propiedad{properties.length !== 1 ? 'es' : ''} registrada{properties.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/properties/create')}
          className="inline-flex items-center gap-1.5 text-white text-sm font-medium
                     px-3.5 py-2 rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: isAdmin() ? '#7e22ce' : '#1d4ed8' }}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Nueva Propiedad
        </button>
      </div>

      {/* Empty state */}
      {properties.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-slate-400 mb-2">No hay propiedades registradas.</p>
          <button
            type="button"
            onClick={() => navigate('/properties/create')}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Añadir tu primera propiedad →
          </button>
        </div>
      ) : isAdmin() ? (
        // ── Admin view: grouped by owner ──────────────────────────────────
        <div className="flex flex-col gap-4">
          {ownersSorted.map((ownerId) => {
            const ownerProps = properties.filter((p) => p.owner_id === ownerId)
            const ownerName = usersMap[ownerId] ?? ownerId
            return (
              <div key={ownerId}>
                <GroupLabel
                  text={`${ownerName} — ${ownerProps.length} propiedad${ownerProps.length !== 1 ? 'es' : ''}`}
                />
                <div className="flex flex-col gap-2.5 mt-1.5">
                  {ownerProps.map((property) => (
                    <PropertyRow
                      key={property.id}
                      property={property}
                      onDelete={(p) => { setDeleteTarget(p); setConflictBanner(false) }}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // ── User view: flat list ──────────────────────────────────────────
        <div className="flex flex-col gap-2.5">
          {properties.map((property) => (
            <PropertyRow
              key={property.id}
              property={property}
              onDelete={(p) => { setDeleteTarget(p); setConflictBanner(false) }}
            />
          ))}
        </div>
      )}

      {/* ── Contracts section ─────────────────────────────────────────────── */}
      <div className="mt-7">
        <div className="flex items-center gap-2 mb-3">
          <DocumentTextIcon className="w-[17px] h-[17px] text-blue-600" />
          <SectionTitleLink
            title="Contratos"
            count={contracts.length}
            to="/contracts"
            size="base"
          />
        </div>

        {contracts.length === 0 ? (
          <div className="text-sm text-slate-400 text-center py-4">
            No hay contratos registrados.
            {properties.length > 0 ? (
              <button
                type="button"
                onClick={() => navigate('/contracts/new')}
                className="ml-1 text-blue-600 font-medium hover:underline"
              >
                Crear primer contrato →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/properties/create')}
                className="ml-1 text-blue-600 font-medium hover:underline"
              >
                Añadir una propiedad primero →
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {properties.map((property) => {
              const propContracts = contractsByProperty[property.id] ?? []
              if (propContracts.length === 0) return null

              const ownerName = isAdmin() ? usersMap[property.owner_id] : null
              const groupLabelText = ownerName
                ? `${ownerName} · ${property.address} · ${property.city}`
                : `${property.address} · ${property.city}`

              return (
                <div key={property.id} className="flex flex-col gap-1.5 mt-1.5 first:mt-0">
                  <GroupLabel text={groupLabelText} />
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
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeletePropertyModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}