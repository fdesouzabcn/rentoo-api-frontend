import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { register as registerService } from '@/services/authService'

// Reusable SVG icons
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
function InfoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function EyeOpen({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
           -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function EyeClosed({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5m-3.023-3.023A3 3 0 0112 9
           a3 3 0 013 3m0 0a3 3 0 01-3 3M6.228 6.228A10.45 10.45 0 002.458 12
           C3.732 16.057 7.523 19 12 19c1.55 0 3.016-.32 4.342-.894
           m2.428-2.428A10.45 10.45 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7
           a10.45 10.45 0 00-4.886 1.207" />
    </svg>
  )
}
function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// Password strength checker
function getStrengthScore(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[0-9]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

function PasswordStrengthPanel({ password }) {
  const score = getStrengthScore(password)
  const checks = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Al menos un número', met: /[0-9]/.test(password) },
    { label: 'Al menos una mayúscula', met: /[A-Z]/.test(password) },
    { label: 'Al menos una minúscula', met: /[a-z]/.test(password) },
    { label: 'Al menos un carácter especial', met: /[^A-Za-z0-9]/.test(password) },
  ]

  const barColor = score <= 1
    ? '#fca5a5'
    : score === 2
      ? '#fbbf24'
      : '#1d4ed8'

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 mt-2">
      {/* Progress bar */}
      <div className="h-[3px] bg-slate-200 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${score * 20}%`, backgroundColor: barColor }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-1.5 mb-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <CheckIcon
              className={`w-3 h-3 transition-colors ${
                check.met ? 'text-blue-600' : 'text-slate-300'
              }`}
            />
            <span className={`text-xs transition-colors ${
              check.met ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>

      {/* Advisory */}
      <div className="border-t border-slate-100 pt-2 mt-1">
        <p className="text-xs text-slate-400 leading-relaxed">
          Evita usar contraseñas que hayas utilizado en otros sitios web
          o que se puedan adivinar fácilmente.
        </p>
      </div>
    </div>
  )
}

const INITIAL_FORM = {
  name: '',
  dni: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  province: '',
  password: '',
  password_confirmation: '',
}

// Validation rules per field
const VALIDATORS = {
  name: (v) => v.trim() ? null : 'El nombre es obligatorio.',
  dni: (v) => /^([0-9]{8}|[XYZ][0-9]{7})[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(v)
    ? null : 'Formato no válido.',
  email: (v) => /\S+@\S+\.\S+/.test(v) ? null : 'Introduce un correo válido.',
  phone: (v) => v.trim() ? null : 'El teléfono es obligatorio.',
  address: (v) => v.trim() ? null : 'La dirección es obligatoria.',
  city: (v) => v.trim() ? null : 'La ciudad es obligatoria.',
  postal_code: (v) => v.trim() ? null : 'Código postal obligatorio.',
  province: (v) => v.trim() ? null : 'La provincia es obligatoria.',
  password: (v) => v.length >= 8 ? null : 'Mínimo 8 caracteres.',
}

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [bannerError, setBannerError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState({})
  const [showStrength, setShowStrength] = useState(false)

  const handleChange = (e) => {
    let { name, value } = e.target
    // Auto-uppercase DNI
    if (name === 'dni') value = value.toUpperCase().slice(0, 9)
    // Block non-numeric for phone
    if (name === 'phone') value = value.replace(/[^0-9\s+\-()]/g, '').slice(0, 20)
    // Block numeric for name
    if (name === 'name') value = value.replace(/[0-9]/g, '')

    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: null }))

    if (name === 'password') setShowStrength(value.length > 0)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (name === 'password') setShowStrength(false)
    const validator = VALIDATORS[name]
    if (validator) {
      const error = validator(value)
      setFieldErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const validateAll = () => {
    const errors = {}
    Object.entries(VALIDATORS).forEach(([name, validator]) => {
      const error = validator(formData[name])
      if (error) errors[name] = error
    })
    if (formData.password_confirmation !== formData.password) {
      errors.password_confirmation = 'Las contraseñas no coinciden.'
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    setBannerError(null)

    const clientErrors = validateAll()
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setLoading(true)
    try {
      await registerService(formData)
      // Reuse login() to complete two-step auth flow (sets token + fetches full user with roles)
      await login(formData.email, formData.password)
      navigate('/', { replace: true })
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setFieldErrors(err.errors)
      } else {
        setBannerError(err.message ?? 'Error al registrarse. Inténtalo de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Field styling helpers
  const getFieldState = (name) => {
    if (fieldErrors[name]) return 'error'
    if (touched[name] && formData[name]) return 'valid'
    return 'rest'
  }

  const inputBase = 'w-full px-3 py-2 rounded-md text-sm text-slate-900 outline-none transition-all duration-150'
  const stateClasses = {
    rest: `${inputBase} border  border-slate-300 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.08)]`,
    error: `${inputBase} border border-[#fca5a5] bg-[#fff8f8] focus:border-[#fca5a5] focus:shadow-[0_0_0_3px_rgba(252,165,165,0.15)]`,
    valid: `${inputBase} border border-[#cbd5e1] bg-transparent focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.08)]`,
  }
  const ic = (name) => stateClasses[getFieldState(name)]

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <div className="flex items-center gap-1 mt-1.5">
        <InfoIcon className="w-3 h-3 text-red-600 flex-shrink-0" />
        <p className="text-xs text-red-600">
          {Array.isArray(fieldErrors[name]) ? fieldErrors[name][0] : fieldErrors[name]}
        </p>
      </div>
    ) : null

  const FieldLabel = ({ htmlFor, children }) => (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5"
    >
      {children}
    </label>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-[400px]">

          {/* Brand mark */}
          <div className="flex flex-col items-center gap-2.5 mb-8">
            <Link to="/" className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center
                                    hover:bg-blue-700 transition-colors">
              <HouseIcon className="w-6 h-6 text-white" />
            </Link>
            <span className="text-2xl font-bold text-slate-900">Rentoo</span>
            <span className="text-sm text-slate-500">Crea tu cuenta de propietario</span>
          </div>

          {/* LAU info block */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 flex gap-2.5 items-start">
            <InfoIcon className="w-[15px] h-[15px] text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>¿Por qué pedimos estos datos?</strong>{' '}
              La LAU exige que los contratos incluyan los datos completos del propietario.
              Esta información se usará directamente en la generación de tus contratos.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Banner error */}
            {bannerError && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3
                              flex items-start gap-2.5">
                <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{bannerError}</span>
              </div>
            )}

            {/* SECTION 1 — Personal info */}
            <div className="mb-4">
              <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
              <input id="name" name="name" value={formData.name}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Joan Puig" className={ic('name')} />
              <FieldError name="name" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <FieldLabel htmlFor="dni">DNI / NIE / TIE</FieldLabel>
                <input id="dni" name="dni" value={formData.dni}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="12345678A" maxLength={9} className={ic('dni')} />
                <FieldError name="dni" />
              </div>
              <div>
                <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                <input id="phone" name="phone" value={formData.phone}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="600111222" maxLength={20} className={ic('phone')} />
                <FieldError name="phone" />
              </div>
            </div>

            <div className="mb-4">
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <input id="email" name="email" type="email" value={formData.email}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="joan@ejemplo.com" className={ic('email')} />
              <FieldError name="email" />
            </div>

            <hr className="border-slate-200 opacity-60 my-5" />

            {/* SECTION 2 — Address */}
            <div className="mb-4">
              <FieldLabel htmlFor="address">Calle y número</FieldLabel>
              <input id="address" name="address" value={formData.address}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Carrer de Balmes, 10" className={ic('address')} />
              <FieldError name="address" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <FieldLabel htmlFor="city">Ciudad</FieldLabel>
                <input id="city" name="city" value={formData.city}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Barcelona" className={ic('city')} />
                <FieldError name="city" />
              </div>
              <div>
                <FieldLabel htmlFor="postal_code">Código postal</FieldLabel>
                <input id="postal_code" name="postal_code" value={formData.postal_code}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="08007" maxLength={10} className={ic('postal_code')} />
                <FieldError name="postal_code" />
              </div>
            </div>

            <div className="mb-4">
              <FieldLabel htmlFor="province">Provincia</FieldLabel>
              <input id="province" name="province" value={formData.province}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Barcelona" className={ic('province')} />
              <FieldError name="province" />
            </div>

            <hr className="border-slate-200 opacity-60 my-5" />

            {/* SECTION 3 — Password */}
            <div className="mb-4">
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Mín. 8 caracteres"
                  className={`${ic('password')} pr-10`}
                />
                <span
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-[11px] top-1/2 -translate-y-1/2 w-5 h-5
                              flex items-center justify-center cursor-pointer transition-colors
                              ${showPassword ? 'text-blue-600' : 'text-slate-300 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOpen className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
                </span>
              </div>
              <FieldError name="password" />
              {showStrength && <PasswordStrengthPanel password={formData.password} />}
            </div>

            <div className="mb-5">
              <FieldLabel htmlFor="password_confirmation">Confirmar contraseña</FieldLabel>
              <div className="relative">
                <input
                  id="password_confirmation" name="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="Repite la contraseña"
                  className={`${ic('password_confirmation')} pr-10`}
                />
                <span
                  onClick={() => setShowConfirm((v) => !v)}
                  className={`absolute right-[11px] top-1/2 -translate-y-1/2 w-5 h-5
                              flex items-center justify-center cursor-pointer transition-colors
                              ${showConfirm ? 'text-blue-600' : 'text-slate-300 hover:text-slate-600'}`}
                >
                  {showConfirm ? <EyeOpen className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
                </span>
              </div>
              <FieldError name="password_confirmation" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium
                         rounded-lg hover:bg-blue-700 transition-colors duration-150
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>

            <p className="text-sm text-center text-slate-500 mt-5">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="text-center text-sm text-slate-600 space-y-1">
          <p>© 2026 Rentoo - Sistema de Gestión de Contratos de Alquileres</p>
          <p>Desarrollado por Flavio De Souza</p>
        </div>
      </footer>
    </div>
  )
}
