import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MapPinIcon,
  GridIcon,
  LightningBoltIcon,
  ShieldCheckIcon,
  EuroCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InfoIcon,
  PencilIcon,
} from '@/components/icons'
import {
  validateRequired,
  validateCadastralReference,
  validateFutureDate,
  validateDate,
  validateNumeric,
  validateInteger,
  validateCertificateNumber,
} from '@/utils/validators'

// Sub-components

// Red asterisk for required fields
function Req() {
  return <span className="text-red-600 text-[12px] leading-none ml-0.5">*</span>
}

// "(opcional)" label suffix
function Opt() {
  return <span className="text-[10px] text-slate-400 font-normal ml-1">(opcional)</span>
}

// Field-level error message
function FieldError({ error }) {
  if (!error) return null
  return (
    <p className="flex items-center gap-1 mt-0.5 text-xs text-red-600">
      <InfoIcon className="w-[11px] h-[11px] flex-shrink-0" />
      {error}
    </p>
  )
}

// Hint text below a field (hidden when error is showing) 
function FieldHint({ hint, error }) {
  if (error || !hint) return null
  return <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>
}

// Controlled input with label, error, and optional hint.
// Passes through all other <input> props.
function FormField({
  id,
  label,
  required = false,
  optional = false,
  error,
  hint,
  className = '',
  children, // for custom input slot
  ...inputProps
}) {
  const hasError = Boolean(error)
  const inputClass = [
    'w-full rounded-md px-3 py-2 text-sm transition-colors',
    'border',
    hasError
      ? 'border-[#fca5a5] bg-[#fff8f8] focus:outline-none focus:border-red-400'
      : 'border-slate-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/[0.08]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-xs font-medium text-slate-700">
        {label}
        {required && <Req />}
        {optional && <Opt />}
      </Label>
      {children ? (
        children
      ) : (
        <input id={id} className={inputClass} {...inputProps} />
      )}
      <FieldError error={error} />
      <FieldHint hint={hint} error={error} />
    </div>
  )
}

// Section card wrapper
function SectionCard({ icon: Icon, title, optional = false, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
        <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 stroke-blue-600" />
        </div>
        <span className="text-[13px] font-medium text-slate-900">
          {title}
          {optional && <span className="text-[11px] text-slate-400 font-normal ml-2">(opcional)</span>}
        </span>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  )
}

const ENERGY_RATINGS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const BLANK_FORM = {
  address: '',
  city: '',
  postal_code: '',
  province: '',
  cadastral_reference: '',
  surface_area: '',
  bedrooms: '',
  bathrooms: '',
  description: '',
  energy_certificate_rating: '',
  energy_certificate_number: '',
  energy_certificate_expiry: '',
  habitability_certificate_number: '',
  habitability_certificate_expiry: '',
  last_rent_amount: '',
  ibi_annual_amount: '',
  community_fees_monthly: '',
  garbage_fees_annual: '',
}


// Main component - (PropertyForm — shared controlled form for create and edit)
export default function PropertyForm({ initialValues = null, onSubmit, isSubmitting = false }) {
  const navigate = useNavigate()
  const { isAdmin } = useAuthContext()
  const isEditMode = initialValues !== null


  // Form state
  const [form, setForm] = useState(() => {
    if (!initialValues) return BLANK_FORM
    return {
      address: initialValues.address ?? '',
      city: initialValues.city ?? '',
      postal_code: initialValues.postal_code ?? '',
      province: initialValues.province ?? '',
      cadastral_reference: initialValues.cadastral_reference ?? '',
      surface_area: initialValues.surface_area ?? '',
      bedrooms: initialValues.bedrooms ?? '',
      bathrooms: initialValues.bathrooms ?? '',
      description: initialValues.description ?? '',
      energy_certificate_rating: initialValues.energy_certificate_rating ?? '',
      energy_certificate_number: initialValues.energy_certificate_number ?? '',
      energy_certificate_expiry: initialValues.energy_certificate_expiry ?? '',
      habitability_certificate_number: initialValues.habitability_certificate_number ?? '',
      habitability_certificate_expiry: initialValues.habitability_certificate_expiry ?? '',
      last_rent_amount: initialValues.last_rent_amount ?? '',
      ibi_annual_amount: initialValues.ibi_annual_amount ?? '',
      community_fees_monthly: initialValues.community_fees_monthly ?? '',
      garbage_fees_annual: initialValues.garbage_fees_annual ?? '',
    }
  })

  // Re-populate if initialValues arrives after mount (async fetch in Edit)
  useEffect(() => {
    if (initialValues) {
      setForm({
        address: initialValues.address ?? '',
        city: initialValues.city ?? '',
        postal_code: initialValues.postal_code ?? '',
        province: initialValues.province ?? '',
        cadastral_reference: initialValues.cadastral_reference ?? '',
        surface_area: initialValues.surface_area ?? '',
        bedrooms: initialValues.bedrooms ?? '',
        bathrooms: initialValues.bathrooms ?? '',
        description: initialValues.description ?? '',
        energy_certificate_rating: initialValues.energy_certificate_rating ?? '',
        energy_certificate_number: initialValues.energy_certificate_number ?? '',
        energy_certificate_expiry: initialValues.energy_certificate_expiry ?? '',
        habitability_certificate_number: initialValues.habitability_certificate_number ?? '',
        habitability_certificate_expiry: initialValues.habitability_certificate_expiry ?? '',
        last_rent_amount: initialValues.last_rent_amount ?? '',
        ibi_annual_amount: initialValues.ibi_annual_amount ?? '',
        community_fees_monthly: initialValues.community_fees_monthly ?? '',
        garbage_fees_annual: initialValues.garbage_fees_annual ?? '',
      })
    }
  }, [initialValues])

  // Error state — keyed by field name
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)

  // Helpers
  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const setError = (name, message) =>
    setErrors((prev) => ({ ...prev, [name]: message }))

  const handleChange = (e) => {
    setField(e.target.name, e.target.value)
  }

  // onBlur validators — run per-field as user tabs away
  const handleBlur = (e) => {
    const { name, value } = e.target
    let err = null

    switch (name) {
      case 'address':
      case 'city':
      case 'postal_code':
      case 'province':
        err = validateRequired(value)
        break

      case 'cadastral_reference':
        err = validateCadastralReference(value)
        break

      case 'surface_area':
        err =
          validateRequired(value) ||
          validateNumeric(value, {
            min: 10,
            max: 9999.99,
            label: 'La superficie',
          })
        break

      case 'bedrooms':
        err =
          validateRequired(value) ||
          validateInteger(value, { min: 0, max: 255, label: 'El número de habitaciones' })
        break

      case 'bathrooms':
        err =
          validateRequired(value) ||
          validateInteger(value, { min: 0, max: 255, label: 'El número de baños' })
        break

      case 'energy_certificate_number':
      case 'habitability_certificate_number':
        err = validateCertificateNumber(value)
        break

      case 'energy_certificate_expiry':
      case 'habitability_certificate_expiry':
        if (isEditMode) {
          err = validateRequired(value) || validateDate(value)
        } else {
          err = validateRequired(value) || validateFutureDate(value)
        }
        break

      // Financial — optional numerics, validate only if provided
      case 'last_rent_amount':
      case 'ibi_annual_amount':
      case 'community_fees_monthly':
      case 'garbage_fees_annual':
        if (value !== '') {
          err = validateNumeric(value, { min: 0, max: 999999.99, label: 'El importe' })
        }
        break

      default:
        break
    }

    if (err) setError(name, err)
  }

  // Full form validation (runs on submit)
  const validateAll = () => {
    const newErrors = {}

    const required = [
      'address',
      'city',
      'postal_code',
      'province',
      'cadastral_reference',
      'surface_area',
      'bedrooms',
      'bathrooms',
      'energy_certificate_rating',
      'energy_certificate_number',
      'energy_certificate_expiry',
      'habitability_certificate_number',
      'habitability_certificate_expiry',
    ]

    required.forEach((field) => {
      const err = validateRequired(form[field])
      if (err) newErrors[field] = err
    })

    // Field-specific validations (only if not already required-errored)
    if (!newErrors.cadastral_reference) {
      const err = validateCadastralReference(form.cadastral_reference)
      if (err) newErrors.cadastral_reference = err
    }

    if (!newErrors.surface_area) {
      const err = validateNumeric(form.surface_area, {
        min: 10,
        max: 9999.99,
        label: 'La superficie',
      })
      if (err) newErrors.surface_area = err
    }

    if (!newErrors.bedrooms) {
      const err = validateInteger(form.bedrooms, { min: 0, max: 255 })
      if (err) newErrors.bedrooms = err
    }

    if (!newErrors.bathrooms) {
      const err = validateInteger(form.bathrooms, { min: 0, max: 255 })
      if (err) newErrors.bathrooms = err
    }

    if (!newErrors.energy_certificate_number) {
      const err = validateCertificateNumber(form.energy_certificate_number)
      if (err) newErrors.energy_certificate_number = err
    }

    if (!newErrors.habitability_certificate_number) {
      const err = validateCertificateNumber(form.habitability_certificate_number)
      if (err) newErrors.habitability_certificate_number = err
    }

    if (!newErrors.energy_certificate_expiry && !isEditMode) {
      const err = validateFutureDate(form.energy_certificate_expiry)
      if (err) newErrors.energy_certificate_expiry = err
    }

    if (!newErrors.habitability_certificate_expiry && !isEditMode) {
      const err = validateFutureDate(form.habitability_certificate_expiry)
      if (err) newErrors.habitability_certificate_expiry = err
    }

    // Optional financial fields
    const financialFields = [
      'last_rent_amount',
      'ibi_annual_amount',
      'community_fees_monthly',
      'garbage_fees_annual',
    ]
    financialFields.forEach((field) => {
      if (form[field] !== '') {
        const err = validateNumeric(form[field], { min: 0, max: 999999.99, label: 'El importe' })
        if (err) newErrors[field] = err
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateAll()) {
      setSubmitError('Hay errores en el formulario. Por favor revisa los campos marcados en rojo antes de continuar.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Build payload — null out empty optional strings so backend receives null not ""
    const payload = { ...form }
    const optionalFields = [
      'description',
      'last_rent_amount',
      'ibi_annual_amount',
      'community_fees_monthly',
      'garbage_fees_annual',
    ]
    optionalFields.forEach((field) => {
      if (payload[field] === '') payload[field] = null
    })

    try {
      await onSubmit(payload)
    } catch (err) {
      // Handle 422 field-level errors from API
      if (err?.status === 422 && err?.errors) {
        setErrors(err.errors)
        setSubmitError('Hay errores en el formulario. Por favor revisa los campos marcados en rojo antes de continuar.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (err?.status === 403) {
        setSubmitError('No tienes permiso para realizar esta acción.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSubmitError(err?.message ?? 'Error al guardar la propiedad. Por favor inténtalo de nuevo.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Cadastral reference counter
  const cadastralLength = (form.cadastral_reference ?? '').length

  // Colour for submit button based on role
  const submitBtnClass = isAdmin()
    ? 'bg-purple-700 hover:bg-purple-800 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white'

  // Render
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Submit error banner */}
      {submitError && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 mb-4">
          <ExclamationTriangleIcon className="w-3.5 h-3.5 stroke-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 font-medium leading-relaxed">{submitError}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
  
        {/* EDIT mode info banner */}
        {isEditMode && (
          <div className="flex items-start gap-2.5 bg-purple-50 border border-purple-200 rounded-lg px-3.5 py-2.5">
            <PencilIcon className="w-3.5 h-3.5 stroke-purple-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-purple-800 leading-relaxed">
              Editando propiedad. Las fechas de vencimiento de certificados no requieren fecha futura al editar — sólo al crear una propiedad nueva.
            </p>
          </div>
        )}

        {/* ================================================================ */}
        {/* SECTION 1 — Ubicación                                            */}
        {/* ================================================================ */}
        <SectionCard icon={MapPinIcon} title="Ubicación">
          <div className="flex flex-col gap-3.5">
            {/* Dirección */}
            <FormField
              id="address"
              name="address"
              label="Dirección completa"
              required
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address}
              placeholder="Carrer de Balmes, 10, 3r 2a"
            />

            {/* Ciudad / CP / Provincia */}
            <div className="grid grid-cols-3 gap-3">
              <FormField
                id="city"
                name="city"
                label="Ciudad"
                required
                value={form.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city}
                placeholder="Barcelona"
              />
              <FormField
                id="postal_code"
                name="postal_code"
                label="Código postal"
                required
                value={form.postal_code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.postal_code}
                placeholder="08007"
                maxLength={10}
              />
              <FormField
                id="province"
                name="province"
                label="Provincia"
                required
                value={form.province}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.province}
                placeholder="Barcelona"
              />
            </div>

            {/* Referencia catastral */}
            <FormField
              id="cadastral_reference"
              name="cadastral_reference"
              label="Referencia catastral"
              required
              value={form.cadastral_reference}
              onChange={(e) => {
                // Auto-uppercase
                setField('cadastral_reference', e.target.value.toUpperCase())
              }}
              onBlur={handleBlur}
              error={errors.cadastral_reference}
              maxLength={20}
              placeholder="XXXXXXXXXXXXXXXX0001"
              hint={`Exactamente 20 caracteres alfanuméricos · ${cadastralLength}/20`}
            />
          </div>
        </SectionCard>

        {/* ================================================================ */}
        {/* SECTION 2 — Características                                      */}
        {/* ================================================================ */}
        <SectionCard icon={GridIcon} title="Características de la propiedad">
          <div className="flex flex-col gap-3.5">
            {/* Superficie / Hab / Baños */}
            <div className="grid grid-cols-3 gap-3">
              <FormField
                id="surface_area"
                name="surface_area"
                label="Superficie (m²)"
                required
                type="number"
                step="0.01"
                min="10"
                max="9999.99"
                value={form.surface_area}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.surface_area}
                placeholder="85.00"
                hint="Mínimo 10 m²"
              />
              <FormField
                id="bedrooms"
                name="bedrooms"
                label="Habitaciones"
                required
                type="number"
                step="1"
                min="0"
                max="255"
                value={form.bedrooms}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.bedrooms}
                placeholder="3"
              />
              <FormField
                id="bathrooms"
                name="bathrooms"
                label="Baños"
                required
                type="number"
                step="1"
                min="0"
                max="255"
                value={form.bathrooms}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.bathrooms}
                placeholder="1"
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="description" className="text-xs font-medium text-slate-700">
                Descripción <Opt />
              </Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción adicional de la propiedad..."
                rows={3}
                className="w-full rounded-md px-3 py-2 text-sm border border-slate-300 bg-white resize-y focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/[0.08] transition-colors"
                style={{ minHeight: '72px' }}
              />
            </div>
          </div>
        </SectionCard>

        {/* ================================================================ */}
        {/* SECTION 3 — Certificado energético                               */}
        {/* ================================================================ */}
        <SectionCard icon={LightningBoltIcon} title="Certificado de eficiencia energética">
          <div className="grid grid-cols-3 gap-3">
            {/* Calificación — shadcn/ui Select */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="energy_certificate_rating" className="text-xs font-medium text-slate-700">
                Calificación energética <Req />
              </Label>
              <Select
                value={form.energy_certificate_rating}
                onValueChange={(val) => {
                  setField('energy_certificate_rating', val)
                }}
              >
                <SelectTrigger
                  id="energy_certificate_rating"
                  className={[
                    'text-sm',
                    errors.energy_certificate_rating
                      ? 'border-[#fca5a5] bg-[#fff8f8]'
                      : 'border-slate-300',
                  ].join(' ')}
                >
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {ENERGY_RATINGS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={errors.energy_certificate_rating} />
            </div>

            {/* Número */}
            <FormField
              id="energy_certificate_number"
              name="energy_certificate_number"
              label="Número de certificado"
              required
              value={form.energy_certificate_number}
              onChange={(e) => setField('energy_certificate_number', e.target.value.toUpperCase())}
              onBlur={handleBlur}
              error={errors.energy_certificate_number}
              placeholder="CE2024ABC01"
            />

            {/* Fecha vencimiento */}
            <FormField
              id="energy_certificate_expiry"
              name="energy_certificate_expiry"
              label="Fecha de vencimiento"
              required
              type="date"
              value={form.energy_certificate_expiry}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.energy_certificate_expiry}
              hint={!isEditMode ? 'Debe ser una fecha futura' : undefined}
            />
          </div>
        </SectionCard>

        {/* ================================================================ */}
        {/* SECTION 4 — Cédula de habitabilidad                              */}
        {/* ================================================================ */}
        <SectionCard icon={ShieldCheckIcon} title="Cédula de habitabilidad">
          <div className="grid grid-cols-2 gap-3">
            {/* Número */}
            <FormField
              id="habitability_certificate_number"
              name="habitability_certificate_number"
              label="Número de cédula"
              required
              value={form.habitability_certificate_number}
              onChange={(e) =>
                setField('habitability_certificate_number', e.target.value.toUpperCase())
              }
              onBlur={handleBlur}
              error={errors.habitability_certificate_number}
              placeholder="CH2024XYZ02"
            />

            {/* Fecha vencimiento */}
            <FormField
              id="habitability_certificate_expiry"
              name="habitability_certificate_expiry"
              label="Fecha de vencimiento"
              required
              type="date"
              value={form.habitability_certificate_expiry}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.habitability_certificate_expiry}
              hint={!isEditMode ? 'Debe ser una fecha futura' : undefined}
            />
          </div>
        </SectionCard>

        {/* ================================================================ */}
        {/* SECTION 5 — Información financiera (optional)                    */}
        {/* ================================================================ */}
        <SectionCard icon={EuroCircleIcon} title="Información financiera" optional>
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="last_rent_amount"
                name="last_rent_amount"
                label="Último alquiler (€)"
                optional
                type="number"
                step="0.01"
                min="0"
                value={form.last_rent_amount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.last_rent_amount}
                placeholder="1200.00"
              />
              <FormField
                id="ibi_annual_amount"
                name="ibi_annual_amount"
                label="IBI anual (€)"
                optional
                type="number"
                step="0.01"
                min="0"
                value={form.ibi_annual_amount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.ibi_annual_amount}
                placeholder="450.00"
              />
              <FormField
                id="community_fees_monthly"
                name="community_fees_monthly"
                label="Gastos de comunidad (€/mes)"
                optional
                type="number"
                step="0.01"
                min="0"
                value={form.community_fees_monthly}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.community_fees_monthly}
                placeholder="75.00"
              />
              <FormField
                id="garbage_fees_annual"
                name="garbage_fees_annual"
                label="Tasa de basura (€/año)"
                optional
                type="number"
                step="0.01"
                min="0"
                value={form.garbage_fees_annual}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.garbage_fees_annual}
                placeholder="120.00"
              />
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2.5">
              <InfoIcon className="w-3.5 h-3.5 stroke-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Campos opcionales. Esta información aparecerá en el resumen financiero y ayuda a calcular la rentabilidad del arrendamiento.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ================================================================ */}
        {/* FOOTER card                                                       */}
        {/* ================================================================ */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${submitBtnClass}`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <CheckIcon className="w-3.5 h-3.5 stroke-white" />
                {isEditMode ? 'Guardar cambios' : 'Guardar Propiedad'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
