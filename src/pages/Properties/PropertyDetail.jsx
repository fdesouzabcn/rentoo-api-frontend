import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProperty, deleteProperty } from '@/services/propertyService'
import { getContracts } from '@/services/contractService'
import EnergyBadge from '@/components/custom/EnergyBadge'
import ContractCard from '@/components/custom/ContractCard'
import FieldValue from '@/components/custom/FieldValue'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import {
  HouseIcon,
  InfoIcon,
  ShieldCheckIcon,
  EuroCircleIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  WarningTriangleIcon,
  ExclamationTriangleIcon,
  SquaresIcon,
  BedIcon,
  WrenchIcon,
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PropertyDetail() {
  const { uuid } = useParams()
  const navigate = useNavigate()

  const [property, setProperty] = useState(null)
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [conflictBanner, setConflictBanner] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [prop, allContracts] = await Promise.all([
          getProperty(uuid),
          getContracts(),
        ])
        setProperty(prop)
        // Filter to contracts for this property only
        setContracts(allContracts.filter((c) => c.property_id === uuid))
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [uuid])

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deleteProperty(uuid)
      navigate('/properties')
    } catch (err) {
      setShowDeleteModal(false)
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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    const msg = error.status === 403
      ? 'No tienes permiso para ver esta propiedad.'
      : error.status === 404
        ? 'Propiedad no encontrada.'
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

  const energyExpiring = isCertExpiringSoon(property.energy_certificate_expiry)
  const habitabilityExpiring = isCertExpiringSoon(property.habitability_certificate_expiry)

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

      {/* Action bar */}
      <div className="flex items-center gap-1.5 mb-3.5">
        <button
          type="button"
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-1.5 bg-white border border-slate-200
                     text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg
                     hover:bg-slate-50 transition-colors"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          Volver a Propiedades
        </button>
        <button
          type="button"
          onClick={() => navigate(`/properties/${uuid}/edit`)}
          className="inline-flex items-center gap-1.5 bg-blue-600 text-white
                     text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          type="button"
          onClick={() => { setShowDeleteModal(true); setConflictBanner(false) }}
          className="inline-flex items-center gap-1.5 bg-red-600 text-white
                     text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>

      {/* ── Master card ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-2.5">

        {/* Property hero */}
        <div className="flex items-center gap-3.5 px-5 py-[18px] border-b border-slate-100">
          <div className="w-[46px] h-[46px] bg-blue-50 rounded-[10px] flex items-center
                          justify-center flex-shrink-0">
            <HouseIcon className="w-[22px] h-[22px] text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-slate-900">{property.address}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {property.city} · {property.postal_code} · {property.province}
            </p>
            <div className="flex gap-1.5 flex-wrap mt-1.5">
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
            </div>
          </div>
          <EnergyBadge rating={property.energy_certificate_rating} />
        </div>

        {/* Section: Información básica */}
        <div>
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center">
              <InfoIcon className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[13px] font-medium text-slate-900">Información básica</span>
          </div>
          <div className="px-5 py-4 border-b border-slate-100 grid grid-cols-2 gap-3">
            <FieldValue label="Dirección completa" value={property.address} />
            <FieldValue label="Referencia catastral" value={property.cadastral_reference} />
            <FieldValue label="Ciudad" value={`${property.city} (${property.postal_code})`} />
            <FieldValue label="Provincia" value={property.province} />
            <div className="col-span-2">
              <FieldValue
                label="Descripción"
                value={property.description || null}
              />
            </div>
          </div>
        </div>

        {/* Section: Certificados */}
        <div>
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[13px] font-medium text-slate-900">Certificados y documentación</span>
          </div>
          <div className="px-5 py-4 border-b border-slate-100 grid grid-cols-2 gap-2.5">
            {/* Energético */}
            <div
              className={`bg-slate-50 rounded-lg px-3.5 py-3 flex flex-col gap-2 ${
                energyExpiring ? 'border border-amber-200' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-900">Certificado energético</span>
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
            <div
              className={`bg-slate-50 rounded-lg px-3.5 py-3 flex flex-col gap-2 ${
                habitabilityExpiring ? 'border border-amber-200' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-900">Cédula de habitabilidad</span>
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

        {/* Section: Información financiera */}
        <div>
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center">
              <EuroCircleIcon className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[13px] font-medium text-slate-900">Información financiera</span>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <FieldValue label="IBI anual" value={formatCurrency(property.ibi_annual_amount)} />
            <FieldValue label="Comunidad/mes" value={formatCurrency(property.community_fees_monthly)} />
            <FieldValue label="Basura anual" value={formatCurrency(property.garbage_fees_annual)} />
            <FieldValue label="Último alquiler" value={formatCurrency(property.last_rent_amount)} />
          </div>
        </div>
      </div>

      {/* ── Contracts card ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center">
            <DocumentTextIcon className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-[13px] font-medium text-slate-900">Contratos</span>
          <span className="text-xs text-slate-400 font-normal">({contracts.length})</span>
        </div>

        {/* Contract rows */}
        {contracts.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-slate-400">
            No hay contratos para esta propiedad.
          </div>
        ) : (
          contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              property={property}
              variant="compact"
            />
          ))
        )}

        {/* "Nuevo Contrato" CTA */}
        <div className="flex justify-end px-5 py-2.5">
          <button
            type="button"
            onClick={() => navigate('/contracts/new', { state: { property_id: uuid } })}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400
                       opacity-70 hover:opacity-100 hover:text-blue-600 transition-all"
          >
            <PlusIcon className="w-[11px] h-[11px]" />
            Nuevo Contrato para esta propiedad
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <DeletePropertyModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
