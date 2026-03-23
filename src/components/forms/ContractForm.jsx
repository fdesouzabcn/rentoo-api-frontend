import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StatusBadge from '@/components/custom/StatusBadge'
import {
  HouseIcon,
  CheckCircleIcon,
  CalendarIcon,
  EuroCircleIcon,
  ClipboardCheckIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  InfoIcon,
  WarningTriangleIcon,
  CheckIcon,
} from '@/components/icons'
import {
  validateRequired,
  validateEmail,
  validateDni,
  validateNumeric,
  validateDate,
  validateFutureOrToday,
  validateDateAfter,
} from '@/utils/validators'

// ─── Styling helpers (aligned with Register.jsx / PropertyForm.jsx) ───────────

const inputBase =
  'w-full px-3 py-2 rounded-md text-sm text-slate-900 outline-none transition-all duration-150'

const stateClasses = {
  rest:  `${inputBase} border border-slate-300 bg-white focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(29,78,216,0.08)]`,
  error: `${inputBase} border border-[#fca5a5] bg-[#fff8f8] focus:border-[#fca5a5] focus:shadow-[0_0_0_3px_rgba(252,165,165,0.15)]`,
  valid: `${inputBase} border border-[#cbd5e1] bg-transparent focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.08)]`,
}

function getFieldState(name, errors, touched) {
  if (errors[name]) return 'error'
  if (touched[name]) return 'valid'
  return 'rest'
}

function ic(name, errors, touched) {
  return stateClasses[getFieldState(name, errors, touched)]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ error }) {
  if (!error) return null
  return (
    <div className="flex items-center gap-1 mt-1">
      <InfoIcon className="w-[11px] h-[11px] text-red-600 flex-shrink-0" />
      <p className="text-xs text-red-600">
        {Array.isArray(error) ? error[0] : error}
      </p>
    </div>
  )
}

function FieldHint({ hint, error }) {
  if (error || !hint) return null
  return <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5"
    >
      {children}
    </label>
  )
}

function Req() {
  return <span className="text-red-600 text-[12px] leading-none ml-0.5">*</span>
}

function Opt() {
  return <span className="text-[10px] text-slate-400 font-normal normal-case ml-1">(opcional)</span>
}

function SectionCard({ icon: Icon, iconClass = 'stroke-blue-600', iconBg = 'bg-blue-50', title, titleSuffix, cardClass = '', headerClass = '', children }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${cardClass}`}>
      <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 ${headerClass}`}>
        <div className={`w-[30px] h-[30px] ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${iconClass}`} />
        </div>
        <span className="text-[13px] font-medium text-slate-900">{title}</span>
        {titleSuffix && (
          <span className="text-[10px] text-purple-400 font-normal ml-2">{titleSuffix}</span>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BLANK_FORM = {
  property_id:                '',
  start_date:                 '',
  end_date:                   '',
  monthly_rent:               '',
  legal_deposit:              '',
  additional_deposit:         '',
  is_tensioned_area:          false,
  irpa_value:                 '',
  tenant_pays_ibi:            false,
  tenant_pays_community_fees: false,
  tenant_pays_garbage_fees:   false,
  tenant1_name:               '',
  tenant1_dni:                '',
  tenant1_email:              '',
  tenant1_phone:              '',
  tenant2_name:               '',
  tenant2_dni:                '',
  tenant2_email:              '',
  tenant2_phone:              '',
  status:                     '',
}

function buildInitialForm(initialValues) {
  if (!initialValues) return { ...BLANK_FORM }
  return {
    property_id:                initialValues.property_id ?? '',
    start_date:                 initialValues.start_date ?? '',
    end_date:                   initialValues.end_date ?? '',
    monthly_rent:               initialValues.monthly_rent ?? '',
    legal_deposit:              initialValues.legal_deposit ?? '',
    additional_deposit:         initialValues.additional_deposit ?? '',
    is_tensioned_area:          initialValues.is_tensioned_area ?? false,
    irpa_value:                 initialValues.irpa_value ?? '',
    tenant_pays_ibi:            initialValues.tenant_pays_ibi ?? false,
    tenant_pays_community_fees: initialValues.tenant_pays_community_fees ?? false,
    tenant_pays_garbage_fees:   initialValues.tenant_pays_garbage_fees ?? false,
    tenant1_name:               initialValues.tenant1_name ?? '',
    tenant1_dni:                initialValues.tenant1_dni ?? '',
    tenant1_email:              initialValues.tenant1_email ?? '',
    tenant1_phone:              initialValues.tenant1_phone ?? '',
    tenant2_name:               initialValues.tenant2_name ?? '',
    tenant2_dni:                initialValues.tenant2_dni ?? '',
    tenant2_email:              initialValues.tenant2_email ?? '',
    tenant2_phone:              initialValues.tenant2_phone ?? '',
    status:                     initialValues.status ?? '',
  }
}

// Spanish display label shown in the trigger after selection
const STATUS_LABELS = {
  draft:     'Borrador',
  active:    'Activo',
  finalized: 'Finalizado',
}

const STATUS_OPTIONS = [
  { value: 'draft',     sublabel: 'Contrato en preparación, no vigente aún' },
  { value: 'active',    sublabel: 'Contrato en vigor — inquilino ocupa la vivienda' },
  { value: 'finalized', sublabel: 'Contrato terminado, datos conservados como historial' },
]

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * ContractForm — shared controlled form for create and edit.
 *
 * @param {object|null}  initialValues     null = create, object = edit
 * @param {function}     onSubmit          async (payload) => void — throws on API error
 * @param {boolean}      isSubmitting
 * @param {object[]}     properties        pre-fetched list from parent
 * @param {string|null}  lockedPropertyId  pre-fill from PropertyDetail navigation
 * @param {boolean}      isAdmin
 */
export default function ContractForm({
  initialValues = null,
  onSubmit,
  isSubmitting,
  properties = [],
  lockedPropertyId = null,
  isAdmin = false,
}) {
  const isEditMode = initialValues !== null

  const [form, setForm] = useState(() => {
    const base = buildInitialForm(initialValues)
    if (!isEditMode && lockedPropertyId) base.property_id = lockedPropertyId
    return base
  })

  const [errors,      setErrors]      = useState({})
  const [touched,     setTouched]     = useState({})
  const [submitError, setSubmitError] = useState(null)

  const [showTenant2, setShowTenant2] = useState(() => {
    if (!initialValues) return false
    return !!(
      initialValues.tenant2_name  ||
      initialValues.tenant2_dni   ||
      initialValues.tenant2_email ||
      initialValues.tenant2_phone
    )
  })

  const [isPropertyLocked, setIsPropertyLocked] = useState(
    !isEditMode && !!lockedPropertyId
  )

  // ── Field helpers ─────────────────────────────────────────────────────────

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const markTouched = (name) =>
    setTouched((prev) => ({ ...prev, [name]: true }))

  // Mirrors Register.jsx character guards for name and phone fields
  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === 'tenant1_dni' || name === 'tenant2_dni') {
      value = value.toUpperCase().slice(0, 9)
    }
    if (name === 'tenant1_name' || name === 'tenant2_name') {
      value = value.replace(/[0-9]/g, '')
    }
    if (name === 'tenant1_phone' || name === 'tenant2_phone') {
      value = value.replace(/[^0-9\s+\-()]/g, '').slice(0, 20)
    }

    setField(name, value)
  }

  // ── Blur validation ───────────────────────────────────────────────────────

  const validateField = (name, value) => {
    switch (name) {
      case 'property_id':
        return validateRequired(value)
      case 'start_date':
        return isEditMode
          ? validateRequired(value) || validateDate(value)
          : validateFutureOrToday(value)
      case 'end_date':
        return value !== '' ? validateDateAfter(value, form.start_date) : null
      case 'monthly_rent':
        return validateRequired(value) ||
          validateNumeric(value, { min: 0, max: 999999.99, label: 'El importe' })
      case 'legal_deposit':
        return validateRequired(value) ||
          validateNumeric(value, { min: 0, max: 999999.99, label: 'El importe' })
      case 'additional_deposit':
        return value !== ''
          ? validateNumeric(value, { min: 0, max: 999999.99, label: 'El importe' })
          : null
      case 'irpa_value':
        return value !== ''
          ? validateNumeric(value, { min: 0, max: 999999.99, label: 'El importe' })
          : null
      case 'tenant1_name':  return validateRequired(value)
      case 'tenant1_dni':   return validateDni(value)
      case 'tenant1_email': return validateEmail(value)
      case 'tenant1_phone': return validateRequired(value)
      case 'tenant2_dni':   return value !== '' ? validateDni(value)   : null
      case 'tenant2_email': return value !== '' ? validateEmail(value) : null
      case 'status':        return isEditMode ? validateRequired(value) : null
      default:              return null
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    markTouched(name)
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const requiredFields = [
      'property_id', 'start_date', 'monthly_rent', 'legal_deposit',
      'tenant1_name', 'tenant1_dni', 'tenant1_email', 'tenant1_phone',
    ]
    if (isEditMode) requiredFields.push('status')

    const newErrors  = {}
    const newTouched = {}

    requiredFields.forEach((name) => {
      newTouched[name] = true
      const err = validateField(name, form[name])
      if (err) newErrors[name] = err
    })

    const conditionalFields = [
      'end_date', 'additional_deposit', 'irpa_value', 'tenant2_dni', 'tenant2_email',
    ]
    conditionalFields.forEach((name) => {
      if (form[name] !== '') {
        const err = validateField(name, form[name])
        if (err) newErrors[name] = err
      }
    })

    setTouched((prev) => ({ ...prev, ...newTouched }))

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitError(
        'Hay errores en el formulario. Por favor revisa los campos marcados en rojo antes de continuar.'
      )
      return
    }

    // Build payload
    const payload = { ...form }

    const optionalStrings = [
      'end_date', 'additional_deposit', 'irpa_value',
      'tenant2_name', 'tenant2_dni', 'tenant2_email', 'tenant2_phone',
    ]
    optionalStrings.forEach((f) => {
      if (payload[f] === '') payload[f] = null
    })

    // If not tensioned, irpa_value must be null regardless of input
    if (!payload.is_tensioned_area) payload.irpa_value = null

    // CREATE: omit status — backend uses `sometimes`, defaults to draft
    if (!isEditMode) delete payload.status

    try {
      await onSubmit(payload)
    } catch (err) {
      if (err?.errors && Object.keys(err.errors).length > 0) {
        const apiTouched = {}
        Object.keys(err.errors).forEach((k) => { apiTouched[k] = true })
        setTouched((prev) => ({ ...prev, ...apiTouched }))
        setErrors(err.errors)
        setSubmitError(
          'Hay errores en el formulario. Por favor revisa los campos marcados en rojo antes de continuar.'
        )
      } else {
        setSubmitError(err?.message ?? 'Ha ocurrido un error inesperado.')
      }
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const lockedProperty = properties.find((p) => p.id === form.property_id)
  const ctaColor       = isAdmin
    ? 'bg-purple-700 hover:bg-purple-800 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white'

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Edit mode banner */}
      {isEditMode && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-3.5 py-2.5 mb-4 flex gap-2.5 items-start">
          <PencilIcon className="w-3.5 h-3.5 stroke-purple-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-purple-800 leading-relaxed">
            Editando contrato. Las fechas de inicio no requieren fecha futura al editar — sólo al crear.
          </p>
        </div>
      )}

      {/* Submit error banner */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 mb-4 flex gap-2.5 items-start">
          <WarningTriangleIcon className="w-3.5 h-3.5 stroke-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 font-medium leading-relaxed">{submitError}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1 — Propiedad                                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionCard icon={HouseIcon} title="Propiedad">
          <div>
            <FieldLabel htmlFor="property_id">Propiedad <Req /></FieldLabel>

            {properties.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2.5 flex gap-2.5 items-start">
                <InfoIcon className="w-3.5 h-3.5 stroke-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  No tienes propiedades registradas.{' '}
                  <Link to="/properties/create" className="font-medium underline">
                    Crea una propiedad primero.
                  </Link>
                </p>
              </div>
            ) : isPropertyLocked && lockedProperty ? (
              <div>
                <div className="border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{lockedProperty.address}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lockedProperty.city} · {lockedProperty.postal_code} · {lockedProperty.province}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPropertyLocked(false)}
                    className="text-xs font-medium text-blue-600 ml-3 flex-shrink-0"
                  >
                    Cambiar propiedad ›
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Preseleccionada desde la propiedad. Pulsa para cambiarla.
                </p>
              </div>
            ) : (
              <Select
                value={form.property_id}
                onValueChange={(val) => {
                  setField('property_id', val)
                  markTouched('property_id')
                }}
              >
                <SelectTrigger
                  className={[
                    'text-sm',
                    errors.property_id ? 'border-[#fca5a5] bg-[#fff8f8]' : 'border-slate-300',
                  ].join(' ')}
                >
                  <SelectValue placeholder="Selecciona una propiedad..." />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.address} — {p.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <FieldError error={errors.property_id} />
          </div>
        </SectionCard>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2 — Estado del contrato (edit only)                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {isEditMode && (
          <div className="bg-purple-50/30 border border-purple-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-purple-100 bg-purple-50">
              <div className="w-[30px] h-[30px] bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-3.5 h-3.5 stroke-purple-700" />
              </div>
              <span className="text-[13px] font-medium text-purple-800">Estado del contrato</span>
              <span className="text-[10px] text-purple-400 font-normal ml-2">Solo visible al editar</span>
            </div>
            <div className="px-5 py-4">
              <div>
                <FieldLabel htmlFor="status">Estado <Req /></FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(val) => {
                    setField('status', val)
                    markTouched('status')
                  }}
                >
                  <SelectTrigger
                    className={[
                      'text-sm',
                      errors.status ? 'border-[#fca5a5] bg-[#fff8f8]' : 'border-slate-300',
                    ].join(' ')}
                  >
                    {/* Render Spanish label in the closed trigger */}
                    <SelectValue>
                      {form.status
                        ? STATUS_LABELS[form.status]
                        : <span className="text-slate-400">Selecciona un estado...</span>}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col py-0.5 gap-1">
                          <StatusBadge status={opt.value} />
                          <span className="text-[10px] text-slate-400">{opt.sublabel}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError error={errors.status} />
              </div>

              {form.status === 'finalized' && (
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5 mt-3">
                  <WarningTriangleIcon className="w-3.5 h-3.5 stroke-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Al finalizar el contrato quedará excluido de los ingresos activos del resumen financiero.
                    Esta acción no elimina ningún dato.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3 — Duración del contrato                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionCard icon={CalendarIcon} title="Duración del contrato">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="start_date">Fecha de inicio <Req /></FieldLabel>
              <input
                id="start_date" name="start_date" type="date"
                value={form.start_date}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('start_date', errors, touched)}
              />
              <FieldError error={errors.start_date} />
              <FieldHint hint={!isEditMode ? 'Debe ser hoy o posterior' : null} error={errors.start_date} />
            </div>

            <div>
              <FieldLabel htmlFor="end_date">Fecha de fin <Opt /></FieldLabel>
              <input
                id="end_date" name="end_date" type="date"
                value={form.end_date}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('end_date', errors, touched)}
              />
              <FieldError error={errors.end_date} />
              <FieldHint hint="Debe ser posterior a la fecha de inicio" error={errors.end_date} />
            </div>
          </div>
        </SectionCard>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 4 — Condiciones económicas                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionCard icon={EuroCircleIcon} title="Condiciones económicas">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <FieldLabel htmlFor="monthly_rent">Renta mensual (€) <Req /></FieldLabel>
              <input
                id="monthly_rent" name="monthly_rent"
                type="number" step="0.01" min="0" max="999999.99" placeholder="690.00"
                value={form.monthly_rent}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('monthly_rent', errors, touched)}
              />
              <FieldError error={errors.monthly_rent} />
            </div>

            <div>
              <FieldLabel htmlFor="legal_deposit">Fianza legal (€) <Req /></FieldLabel>
              <input
                id="legal_deposit" name="legal_deposit"
                type="number" step="0.01" min="0" max="999999.99" placeholder="690.00"
                value={form.legal_deposit}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('legal_deposit', errors, touched)}
              />
              <FieldError error={errors.legal_deposit} />
              <FieldHint hint="Equivalente a 1 mensualidad (LAU)" error={errors.legal_deposit} />
            </div>

            <div>
              <FieldLabel htmlFor="additional_deposit">Garantía adicional (€) <Opt /></FieldLabel>
              <input
                id="additional_deposit" name="additional_deposit"
                type="number" step="0.01" min="0" max="999999.99" placeholder="0.00"
                value={form.additional_deposit}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('additional_deposit', errors, touched)}
              />
              <FieldError error={errors.additional_deposit} />
            </div>
          </div>

          <div className="border-t border-slate-100 my-4" />

          {/* is_tensioned_area */}
          <div className="flex items-start gap-2.5 py-1">
            <Checkbox
              id="is_tensioned_area"
              checked={form.is_tensioned_area}
              onCheckedChange={(val) => setField('is_tensioned_area', val)}
              className="mt-0.5"
            />
            <div>
              <label htmlFor="is_tensioned_area" className="text-sm font-medium text-slate-900 cursor-pointer">
                Zona de mercado residencial tensionado
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Marcado si la propiedad está en una zona tensionada según normativa IRPA
              </p>
            </div>
          </div>

          {/* IRPA — conditional on tensioned */}
          {form.is_tensioned_area && (
            <div className="border border-purple-200 rounded-lg px-3.5 py-3 bg-purple-50/40 mt-3">
              <p className="text-[10px] font-medium text-purple-700 uppercase tracking-wide mb-2">
                Índice de referencia (IRPA)
              </p>
              <div className="max-w-[200px]">
                <FieldLabel htmlFor="irpa_value">Valor IRPA (€/m²/mes) <Opt /></FieldLabel>
                <input
                  id="irpa_value" name="irpa_value"
                  type="number" step="0.01" min="0" max="999999.99" placeholder="12.50"
                  value={form.irpa_value}
                  onChange={handleChange} onBlur={handleBlur}
                  className={ic('irpa_value', errors, touched)}
                />
                <FieldError error={errors.irpa_value} />
              </div>
            </div>
          )}
        </SectionCard>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 5 — Reparto de gastos                                  */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionCard icon={ClipboardCheckIcon} title="Reparto de gastos">
          <p className="text-xs text-slate-500 mb-3">
            Marca los gastos que corren a cargo del inquilino. Los no marcados quedan a cargo del arrendador.
          </p>

          <div className="flex flex-col">
            {[
              { id: 'tenant_pays_ibi',            label: 'IBI (Impuesto sobre Bienes Inmuebles)', sublabel: 'Por defecto a cargo del arrendador' },
              { id: 'tenant_pays_community_fees',  label: 'Gastos de comunidad',                   sublabel: 'Cuota mensual de la comunidad de propietarios' },
              { id: 'tenant_pays_garbage_fees',    label: 'Tasa de basuras',                        sublabel: 'Tasa municipal de recogida de residuos' },
            ].map((item, i) => (
              <div key={item.id}>
                {i > 0 && <div className="border-t border-slate-100 my-2" />}
                <div className="flex items-start gap-2.5 py-1">
                  <Checkbox
                    id={item.id}
                    checked={form[item.id]}
                    onCheckedChange={(val) => setField(item.id, val)}
                    className="mt-0.5"
                  />
                  <div>
                    <label htmlFor={item.id} className="text-sm font-medium text-slate-900 cursor-pointer">
                      {item.label}
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sublabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2.5 mt-4 flex gap-2.5 items-start">
            <InfoIcon className="w-3.5 h-3.5 stroke-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Los gastos no marcados corren a cargo del arrendador. Esta información se incluirá
              automáticamente en el documento del contrato.
            </p>
          </div>
        </SectionCard>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 6 — Inquilinos                                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionCard icon={UserIcon} title="Inquilinos">

          {/* Tenant 1 */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel htmlFor="tenant1_name">Nombre completo <Req /></FieldLabel>
              <input
                id="tenant1_name" name="tenant1_name"
                placeholder="Nombre y apellidos"
                value={form.tenant1_name}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('tenant1_name', errors, touched)}
              />
              <FieldError error={errors.tenant1_name} />
            </div>

            <div>
              <FieldLabel htmlFor="tenant1_dni">DNI / NIE <Req /></FieldLabel>
              <input
                id="tenant1_dni" name="tenant1_dni"
                placeholder="12345678A" maxLength={9}
                value={form.tenant1_dni}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('tenant1_dni', errors, touched)}
              />
              <FieldError error={errors.tenant1_dni} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="tenant1_email">Correo electrónico <Req /></FieldLabel>
              <input
                id="tenant1_email" name="tenant1_email" type="email"
                placeholder="inquilino@email.com"
                value={form.tenant1_email}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('tenant1_email', errors, touched)}
              />
              <FieldError error={errors.tenant1_email} />
            </div>

            <div>
              <FieldLabel htmlFor="tenant1_phone">Teléfono <Req /></FieldLabel>
              <input
                id="tenant1_phone" name="tenant1_phone"
                placeholder="600 000 000"
                value={form.tenant1_phone}
                onChange={handleChange} onBlur={handleBlur}
                className={ic('tenant1_phone', errors, touched)}
              />
              <FieldError error={errors.tenant1_phone} />
            </div>
          </div>

          {/* Tenant 2 toggle */}
          {!showTenant2 ? (
            <button
              type="button"
              onClick={() => setShowTenant2(true)}
              className="inline-flex items-center gap-1.5 border border-slate-200 rounded-lg
                         px-3 py-1.5 text-xs font-medium text-slate-500 bg-white
                         hover:bg-slate-50 transition-colors mt-4"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Añadir segundo inquilino
            </button>
          ) : (
            <div className="border border-slate-200 rounded-lg p-3.5 mt-4 bg-slate-50/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-700">Segundo inquilino</span>
                <button
                  type="button"
                  onClick={() => setShowTenant2(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ▲ Ocultar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <FieldLabel htmlFor="tenant2_name">Nombre completo <Opt /></FieldLabel>
                  <input
                    id="tenant2_name" name="tenant2_name"
                    placeholder="Nombre y apellidos"
                    value={form.tenant2_name}
                    onChange={handleChange} onBlur={handleBlur}
                    className={ic('tenant2_name', errors, touched)}
                  />
                  <FieldError error={errors.tenant2_name} />
                </div>

                <div>
                  <FieldLabel htmlFor="tenant2_dni">DNI / NIE <Opt /></FieldLabel>
                  <input
                    id="tenant2_dni" name="tenant2_dni"
                    placeholder="12345678A" maxLength={9}
                    value={form.tenant2_dni}
                    onChange={handleChange} onBlur={handleBlur}
                    className={ic('tenant2_dni', errors, touched)}
                  />
                  <FieldError error={errors.tenant2_dni} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="tenant2_email">Correo electrónico <Opt /></FieldLabel>
                  <input
                    id="tenant2_email" name="tenant2_email" type="email"
                    placeholder="inquilino2@email.com"
                    value={form.tenant2_email}
                    onChange={handleChange} onBlur={handleBlur}
                    className={ic('tenant2_email', errors, touched)}
                  />
                  <FieldError error={errors.tenant2_email} />
                </div>

                <div>
                  <FieldLabel htmlFor="tenant2_phone">Teléfono <Opt /></FieldLabel>
                  <input
                    id="tenant2_phone" name="tenant2_phone"
                    placeholder="600 000 000"
                    value={form.tenant2_phone}
                    onChange={handleChange} onBlur={handleBlur}
                    className={ic('tenant2_phone', errors, touched)}
                  />
                  <FieldError error={errors.tenant2_phone} />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3">
                Si introduces algún dato del segundo inquilino, el DNI/NIE debe ser válido.
              </p>
            </div>
          )}
        </SectionCard>

        {/* ── Footer card ───────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600
                       bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium
                        transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${ctaColor}`}
          >
            {isSubmitting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <CheckIcon className="w-3.5 h-3.5 stroke-white" />
                {isEditMode ? 'Guardar cambios' : 'Guardar Contrato'}
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  )
}