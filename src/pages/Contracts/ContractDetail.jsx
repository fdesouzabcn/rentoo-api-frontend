import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getContract } from '@/services/contractService'
import { getProperty } from '@/services/propertyService'
import { getUser } from '@/services/userService'
import { deleteContract } from '@/services/contractService'
import { useAuth } from '@/hooks/useAuth'
import StatusBadge from '@/components/custom/StatusBadge'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import {
  ChevronLeftIcon,
  PrinterIcon,
  PencilIcon,
  TrashIcon,
  InfoIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
} from '@/components/icons'
import {
  formatDate,
  formatDateLong,
  formatCurrency,
  formatCurrencyLong,
} from '@/utils/formatters'
import { toast } from 'sonner'

export default function ContractDetail() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [contract, setContract] = useState(null)
  const [property, setProperty] = useState(null)
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  // Sequential fetch chain — all three must resolve before anything renders
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const contractData = await getContract(uuid)
        const propertyData = await getProperty(contractData.property_id)
        const ownerData    = await getUser(propertyData.owner_id)
        setContract(contractData)
        setProperty(propertyData)
        setOwner(ownerData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [uuid])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteContract(uuid)
      toast.success('Contrato eliminado')
      navigate('/contracts')
    } catch (err) {
      setShowDeleteModal(false)
      setDeleteError(err)
      window.scrollTo(0, 0)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    const msg =
      error.status === 403 ? 'No tienes permiso para ver este contrato.' :
      error.status === 404 ? 'Contrato no encontrado.' :
      error.status === 0   ? 'No se pudo conectar con el servidor.' :
                             (error.message ?? 'Ha ocurrido un error inesperado.')
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
        <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">{msg}</p>
      </div>
    )
  }

  const hasTenant2 = Boolean(contract.tenant2_name)
  const hasIrpa    = contract.is_tensioned_area && contract.irpa_value

  return (
    <div>
      {/* Print styles — co-located with the component */}
      <style>{`
        @media print {
          .no-print, nav, footer { display: none !important; }
          body { margin: 0; padding: 0; }
          .contract-document {
            box-shadow: none !important;
            max-width: 100% !important;
            padding: 2cm !important;
            border-radius: 0 !important;
            border: none !important;
          }
          @page { size: A4; margin: 2cm; }
        }
      `}</style>

      {/* Delete error banner */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3
                        flex gap-2.5 items-start mb-4">
          <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            {deleteError.message ?? 'No se pudo eliminar el contrato.'}
          </p>
        </div>
      )}

      {/* Action bar — hidden on print */}
      <div className="no-print flex items-center gap-1.5 mb-5 flex-wrap">
        <button
          type="button"
          onClick={() => navigate('/contracts')}
          className="inline-flex items-center gap-1 bg-white border border-slate-200
                     text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg
                     hover:bg-slate-50 transition-colors"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          Volver a Contratos
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1 bg-purple-700 text-white
                     text-xs font-medium px-3 py-1.5 rounded-lg
                     hover:bg-purple-800 transition-colors"
        >
          <PrinterIcon className="w-3.5 h-3.5" />
          Imprimir Contrato
        </button>

        <button
          type="button"
          onClick={() => navigate(`/contracts/${uuid}/edit`)}
          className={`inline-flex items-center gap-1 text-white text-xs font-medium
                      px-3 py-1.5 rounded-lg transition-colors ${
            isAdmin()
              ? 'bg-purple-700 hover:bg-purple-800'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Editar
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1 bg-red-600 text-white
                     text-xs font-medium px-3 py-1.5 rounded-lg
                     hover:bg-red-700 transition-colors"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Eliminar
        </button>

        <div className="ml-auto">
          <StatusBadge status={contract.status} />
        </div>
      </div>

      {/* ── Legal document card ─────────────────────────────────────────── */}
      <div
        className="contract-document bg-white border border-slate-200
                   rounded-xl p-10 max-w-[780px] mx-auto"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        {/* Document header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold uppercase mb-1.5 tracking-wide">
            Contrato de Arrendamiento de Vivienda
          </h1>
          <p className="text-sm text-slate-500">
            Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos (LAU)
          </p>
        </div>

        {/* ── REUNIDOS ──────────────────────────────────────────────────── */}
        <h2 className="text-base font-bold uppercase mb-3">REUNIDOS</h2>

        <p className="text-sm leading-relaxed text-justify mb-3">
          De una parte, <strong>{owner.name}</strong>, mayor de edad,
          con DNI/NIE/TIE número <strong>{owner.dni}</strong>,
          con domicilio a efectos de notificaciones en{' '}
          <strong>
            {owner.address}, {owner.city}, {owner.postal_code}, {owner.province}
          </strong>,
          en su condición de <strong>ARRENDADOR</strong>.
        </p>

        {hasTenant2 ? (
          <p className="text-sm leading-relaxed text-justify mb-3">
            Y de otra parte, <strong>{contract.tenant1_name}</strong>,
            mayor de edad, con DNI/NIE/TIE número <strong>{contract.tenant1_dni}</strong>,
            con domicilio en la vivienda arrendada,
            y <strong>{contract.tenant2_name}</strong>,
            mayor de edad, con DNI/NIE/TIE número <strong>{contract.tenant2_dni}</strong>,
            con domicilio en la vivienda arrendada,
            en su condición de <strong>ARRENDATARIOS</strong>.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-justify mb-3">
            Y de otra parte, <strong>{contract.tenant1_name}</strong>,
            mayor de edad, con DNI/NIE/TIE número <strong>{contract.tenant1_dni}</strong>,
            con domicilio en la vivienda arrendada,
            en su condición de <strong>ARRENDATARIO</strong>.
          </p>
        )}

        <p className="text-sm leading-relaxed text-justify">
          Ambas partes se reconocen mutuamente capacidad legal suficiente para
          formalizar el presente contrato y, a tal efecto,
        </p>

        {/* ── EXPONEN ───────────────────────────────────────────────────── */}
        <h2 className="text-base font-bold uppercase mb-3 mt-6">EXPONEN</h2>

        <p className="text-sm leading-relaxed text-justify mb-3">
          <strong>PRIMERO.</strong> Que el ARRENDADOR es propietario de la vivienda
          sita en{' '}
          <strong>
            {property.address}, {property.city}, {property.postal_code}, {property.province}
          </strong>,
          con referencia catastral <strong>{property.cadastral_reference}</strong>,
          con una superficie construida de{' '}
          <strong>
            {parseFloat(property.surface_area).toFixed(2).replace('.', ',')} m²
          </strong>,
          que cuenta con{' '}
          <strong>
            {property.bedrooms} {property.bedrooms === 1 ? 'habitación' : 'habitaciones'}
          </strong>{' '}
          y{' '}
          <strong>
            {property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}
          </strong>.
        </p>

        <p className="text-sm leading-relaxed text-justify mb-3">
          <strong>SEGUNDO.</strong> Que la vivienda dispone de Certificado de
          Eficiencia Energética con calificación{' '}
          <strong>{property.energy_certificate_rating}</strong>,
          número <strong>{property.energy_certificate_number}</strong>,
          con fecha de caducidad {formatDate(property.energy_certificate_expiry)},
          y Cédula de Habitabilidad número{' '}
          <strong>{property.habitability_certificate_number}</strong>,
          con fecha de caducidad {formatDate(property.habitability_certificate_expiry)}.
        </p>

        <p className="text-sm leading-relaxed text-justify">
          <strong>TERCERO.</strong> Que es voluntad del ARRENDADOR arrendar la
          mencionada vivienda, y del ARRENDATARIO{hasTenant2 ? 'S' : ''} tomarla
          en arrendamiento, destinándola exclusivamente a vivienda habitual,
          conforme a las siguientes
        </p>

        {/* ── ESTIPULACIONES ────────────────────────────────────────────── */}
        <h2 className="text-base font-bold uppercase mb-3 mt-6">ESTIPULACIONES</h2>

        {/* PRIMERA */}
        <p className="font-bold mb-2 mt-4">PRIMERA. — Objeto y duración</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          El objeto del presente contrato es el arrendamiento de la vivienda
          descrita en el expositivo PRIMERO, destinada a uso de vivienda habitual
          y permanente del arrendatario{hasTenant2 ? 's' : ''}.
        </p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          El contrato tendrá una duración de <strong>UN AÑO</strong>,
          comenzando el día{' '}
          <strong>{formatDateLong(contract.start_date) ?? 'a determinar'}</strong>{' '}
          y finalizando el día{' '}
          <strong>{formatDateLong(contract.end_date) ?? 'a determinar'}</strong>.
        </p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          El contrato se prorrogará obligatoriamente por plazos anuales hasta que
          el arrendamiento alcance una duración mínima de cinco años, salvo que el
          arrendatario{hasTenant2 ? 's' : ''} manifieste al arrendador, con treinta
          días de antelación como mínimo a la fecha de terminación del contrato o
          de cualquiera de las prórrogas, su voluntad de no renovarlo.
        </p>

        {/* SEGUNDA */}
        <p className="font-bold mb-2 mt-4">SEGUNDA. — Destino</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          La vivienda arrendada se destinará exclusivamente a uso de vivienda
          habitual y permanente del arrendatario{hasTenant2 ? 's' : ''}, quedando
          expresamente prohibida su utilización para usos distintos, el subarriendo
          total o parcial y la cesión del contrato sin el previo consentimiento
          escrito del arrendador.
        </p>

        {/* TERCERA */}
        <p className="font-bold mb-2 mt-4">TERCERA. — Renta</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          La renta mensual pactada es de{' '}
          <strong>{formatCurrencyLong(contract.monthly_rent)}</strong>,
          que se abonarán dentro de los primeros siete días de cada mes,
          mediante transferencia bancaria a la cuenta que el arrendador
          designe a tal efecto.
        </p>
        {hasIrpa && (
          <p className="text-sm leading-relaxed text-justify mb-3">
            La vivienda se encuentra en zona de mercado residencial tensionado.
            El índice de referencia de precios de alquiler (IRPA) aplicable es de{' '}
            <strong>
              {parseFloat(contract.irpa_value).toFixed(2).replace('.', ',')} €/m²/mes
            </strong>.
          </p>
        )}
        <p className="text-sm leading-relaxed text-justify mb-3">
          La renta será actualizada anualmente conforme a la variación del Índice
          de Garantía de Competitividad (IGC) o el índice que legalmente corresponda,
          en los términos establecidos en el artículo 18 de la LAU.
        </p>

        {/* CUARTA */}
        <p className="font-bold mb-2 mt-4">CUARTA. — Fianza y garantías</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          A la firma del presente contrato, el arrendatario{hasTenant2 ? 's' : ''}{' '}
          entrega al arrendador en concepto de fianza legal la cantidad de{' '}
          <strong>{formatCurrencyLong(contract.legal_deposit)}</strong>,
          equivalente a una mensualidad de renta, conforme a lo dispuesto en el
          artículo 36 de la LAU.
        </p>
        {contract.additional_deposit &&
          parseFloat(contract.additional_deposit) > 0 && (
          <p className="text-sm leading-relaxed text-justify mb-3">
            Adicionalmente, se entrega en concepto de garantía complementaria
            la cantidad de{' '}
            <strong>{formatCurrencyLong(contract.additional_deposit)}</strong>.
          </p>
        )}
        <p className="text-sm leading-relaxed text-justify mb-3">
          La fianza legal será depositada por el arrendador en el organismo
          autonómico competente en el plazo legalmente establecido.
        </p>

        {/* QUINTA */}
        <p className="font-bold mb-2 mt-4">QUINTA. — Gastos y suministros</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          Serán a cargo del arrendatario{hasTenant2 ? 's' : ''} los siguientes gastos:
        </p>
        <ul className="text-sm leading-relaxed mb-3 list-disc pl-6">
          <li>
            Suministros individuales de la vivienda (agua, luz, gas, telefonía e internet)
          </li>
          {contract.tenant_pays_community_fees && (
            <li>
              Gastos de comunidad
              {property.community_fees_monthly
                ? ` (${formatCurrency(property.community_fees_monthly)} mensuales aproximadamente)`
                : ''}
            </li>
          )}
          {contract.tenant_pays_garbage_fees && (
            <li>Tasa de basuras</li>
          )}
        </ul>
        <p className="text-sm leading-relaxed text-justify mb-3">
          Serán a cargo del arrendador los siguientes gastos:
        </p>
        <ul className="text-sm leading-relaxed mb-3 list-disc pl-6">
          {!contract.tenant_pays_ibi && (
            <li>Impuesto sobre Bienes Inmuebles (IBI)</li>
          )}
          {!contract.tenant_pays_community_fees && (
            <li>Gastos de comunidad</li>
          )}
          {!contract.tenant_pays_garbage_fees && (
            <li>Tasa de basuras</li>
          )}
          <li>
            Reparaciones necesarias para conservar la vivienda en condiciones
            de habitabilidad
          </li>
          <li>Grandes reparaciones estructurales</li>
        </ul>

        {/* SEXTA */}
        <p className="font-bold mb-2 mt-4">SEXTA. — Obras y modificaciones</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          El arrendatario{hasTenant2 ? 's' : ''} no podrá realizar obras que
          modifiquen la configuración de la vivienda o de los accesorios sin el
          consentimiento previo y escrito del arrendador. Las obras de mejora
          realizadas con dicho consentimiento quedarán en beneficio de la finca,
          sin derecho a indemnización, salvo pacto expreso en contrario.
        </p>

        {/* SÉPTIMA */}
        <p className="font-bold mb-2 mt-4">SÉPTIMA. — Conservación</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          El arrendatario{hasTenant2 ? 's' : ''} se obliga a usar la vivienda
          con la debida diligencia y destinarla exclusivamente al uso pactado.
          Deberá comunicar al arrendador, a la mayor brevedad posible, la necesidad
          de reparaciones que exija el sostenimiento de la vivienda, así como
          los daños ocasionados por caso fortuito o fuerza mayor.
        </p>

        {/* OCTAVA */}
        <p className="font-bold mb-2 mt-4">OCTAVA. — Resolución anticipada</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          Transcurridos seis meses desde la celebración del contrato, el
          arrendatario{hasTenant2 ? 's' : ''} podrá desistir del mismo, siempre que
          lo comunique al arrendador con una antelación mínima de treinta días.
          En caso de incumplimiento del plazo de preaviso, el arrendatario
          {hasTenant2 ? 's' : ''} deberá indemnizar al arrendador con una cantidad
          equivalente a una mensualidad de renta por cada año de contrato que reste
          por cumplir, prorrateándose por meses los periodos inferiores a un año.
        </p>

        {/* NOVENA */}
        <p className="font-bold mb-2 mt-4">NOVENA. — Causas de resolución</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          Serán causas de resolución del contrato, además de las establecidas en
          el Código Civil: el impago de la renta o de cualquiera de las cantidades
          cuyo pago hubiere asumido o corresponda al arrendatario
          {hasTenant2 ? 's' : ''}; la falta de pago del importe de la fianza o de
          su actualización; el subarriendo o cesión sin consentimiento del
          arrendador; la realización de daños causados dolosamente en la finca o
          de obras no consentidas por el arrendador; y la realización en la
          vivienda de actividades molestas, insalubres, nocivas, peligrosas o
          ilícitas.
        </p>

        {/* DÉCIMA */}
        <p className="font-bold mb-2 mt-4">DÉCIMA. — Jurisdicción</p>
        <p className="text-sm leading-relaxed text-justify mb-3">
          Para cualquier controversia derivada del presente contrato, las partes
          se someten expresamente a los Juzgados y Tribunales de{' '}
          <strong>{property.city}</strong>, con renuncia expresa a cualquier otro
          fuero que pudiera corresponderles.
        </p>

        {/* ── INVENTARIO ────────────────────────────────────────────────── */}
        <div className="mt-8 border-t border-b border-slate-300 py-2 text-center mb-4">
          <h2 className="text-base font-bold uppercase">Inventario</h2>
        </div>
        <p className="text-sm leading-relaxed text-justify mb-4">
          La vivienda se entrega con el mobiliario y electrodomésticos que se
          detallan a continuación, en perfecto estado de funcionamiento, quedando
          a disposición del arrendatario{hasTenant2 ? 's' : ''} para su uso durante
          la vigencia del contrato, siendo de su cargo la reparación o reposición
          de los mismos en caso de deterioro o pérdida por causa imputable al
          arrendatario{hasTenant2 ? 's' : ''}:
        </p>
        <p className="text-sm text-slate-500 italic text-center">
          [El inventario detallado se adjunta como anexo al presente contrato
          con fotografías del estado de la vivienda]
        </p>

        {/* ── FIRMAS ────────────────────────────────────────────────────── */}
        <div className="mt-8 border-t border-b border-slate-300 py-2 text-center mb-6">
          <h2 className="text-base font-bold uppercase">Firmas</h2>
        </div>

        <p className="text-sm leading-relaxed text-justify mb-10">
          Y en prueba de conformidad con cuanto antecede, ambas partes firman el
          presente contrato por duplicado en{' '}
          <strong>{property.city}</strong>,
          a {formatDateLong(contract.start_date) ?? 'fecha de firma'}.
        </p>

        <div className="grid grid-cols-2 gap-12 mt-4">
          {/* Owner */}
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mb-1">
              <p className="font-bold text-sm">EL ARRENDADOR</p>
            </div>
            <p className="text-sm">{owner.name}</p>
            <p className="text-xs text-slate-500">DNI/NIE/TIE: {owner.dni}</p>
          </div>

          {/* Tenant 1 */}
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mb-1">
              <p className="font-bold text-sm">
                EL ARRENDATARIO{hasTenant2 ? ' (1)' : ''}
              </p>
            </div>
            <p className="text-sm">{contract.tenant1_name}</p>
            <p className="text-xs text-slate-500">
              DNI/NIE/TIE: {contract.tenant1_dni}
            </p>
          </div>

          {/* Tenant 2 — spans both columns when present */}
          {hasTenant2 && (
            <div className="text-center col-span-2">
              <div className="border-t border-slate-400 pt-2 mb-1 max-w-xs mx-auto">
                <p className="font-bold text-sm">EL ARRENDATARIO (2)</p>
              </div>
              <p className="text-sm">{contract.tenant2_name}</p>
              <p className="text-xs text-slate-500">
                DNI/NIE/TIE: {contract.tenant2_dni}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirmation modal ──────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/45 flex items-center
                        justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-7 max-w-[420px] w-full">
            <div className="w-11 h-11 bg-red-100 rounded-full flex items-center
                            justify-center mb-4">
              <ExclamationTriangleIcon className="w-[22px] h-[22px] text-red-600" />
            </div>
            <h2 className="text-[17px] font-bold text-slate-900 mb-2">
              ¿Eliminar contrato?
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Esta acción eliminará permanentemente el contrato y no se puede
              deshacer.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-white border border-slate-200 text-slate-600
                           text-sm font-medium py-2.5 rounded-lg hover:bg-slate-50
                           transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white text-sm font-medium
                           py-2.5 rounded-lg hover:bg-red-700 transition-colors
                           disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando…' : 'Eliminar contrato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}