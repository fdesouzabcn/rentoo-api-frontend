import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Eye open SVG
function EyeOpen({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
           -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

// Eye closed SVG
function EyeClosed({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 3l18 18M10.477 10.477A3 3 0 0013.5 13.5m-3.023-3.023
           A3 3 0 0112 9a3 3 0 013 3m0 0a3 3 0 01-3 3
           M6.228 6.228A10.45 10.45 0 002.458 12C3.732 16.057 7.523 19 12 19
           c1.55 0 3.016-.32 4.342-.894m2.428-2.428
           A10.45 10.45 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7
           a10.45 10.45 0 00-4.886 1.207" />
    </svg>
  )
}

// Info circle SVG
function InfoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// House icon for logo
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

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [bannerError, setBannerError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [touched, setTouched] = useState({})

  const passwordRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: null }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (!value.trim()) {
      const messages = {
        email: 'Introduce un correo electrónico válido.',
        password: 'La contraseña es obligatoria.',
      }
      if (messages[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: messages[name] }))
      }
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Introduce un correo electrónico válido.' }))
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBannerError(null)

    // Validate all fields on submit
    const errors = {}
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Introduce un correo electrónico válido.'
    }
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria.'
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      await login(formData.email, formData.password)
      // rememberMe: move token to localStorage for persistence across tabs
      if (rememberMe) {
        const token = sessionStorage.getItem('rentoo_token')
        const user = sessionStorage.getItem('rentoo_user')
        if (token) localStorage.setItem('rentoo_token', token)
        if (user) localStorage.setItem('rentoo_user', user)
      }
      navigate('/', { replace: true })
    } catch (err) {
      setBannerError(err.message ?? 'Error al iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Field state for styling
  const getFieldState = (name) => {
    if (fieldErrors[name]) return 'error'
    if (touched[name] && formData[name]) return 'valid'
    return 'rest'
  }

  const inputBase =
    'w-full px-3 py-2 rounded-md text-sm text-slate-900 outline-none transition-all duration-150'

  const inputStyles = {
    rest: `${inputBase} border border-slate-300`,
    error: `${inputBase} border bg-[#fff8f8]`,
    valid: `${inputBase} border border-[#cbd5e1] bg-transparent`,
  }

  const focusStyles = {
    rest: 'focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.08)]',
    error: 'focus:border-[#fca5a5] focus:shadow-[0_0_0_3px_rgba(252,165,165,0.15)]',
    valid: 'focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.08)]',
  }

  const getInputClass = (name) => {
    const state = getFieldState(name)
    const base = inputStyles[state]
    const focus = focusStyles[state]
    const errorBorder = state === 'error' ? 'border-[#fca5a5]' : ''
    return `${base} ${focus} ${errorBorder}`
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[400px]">

          {/* Brand mark */}
          <div className="flex flex-col items-center gap-2.5 mb-8">
            <Link to="/" className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center
                                    hover:bg-blue-700 transition-colors">
              <HouseIcon className="w-6 h-6 text-white" />
            </Link>
            <span className="text-2xl font-bold text-slate-900">Rentoo</span>
            <span className="text-sm text-slate-500">Inicia sesión en tu cuenta</span>
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

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="propietario@ejemplo.com"
                className={getInputClass('email')}
              />
              {fieldErrors.email && (
                <div className="flex items-center gap-1 mt-1.5">
                  <InfoIcon className="w-3 h-3 text-red-600 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldErrors.email}</p>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  ref={passwordRef}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`${getInputClass('password')} pr-10`}
                />
                <span
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-[11px] top-1/2 -translate-y-1/2
                              w-5 h-5 flex items-center justify-center cursor-pointer
                              transition-colors duration-150
                              ${showPassword ? 'text-blue-600' : 'text-slate-300 hover:text-slate-600'}`}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword
                    ? <EyeOpen className="w-4 h-4" />
                    : <EyeClosed className="w-4 h-4" />
                  }
                </span>
              </div>
              {fieldErrors.password && (
                <div className="flex items-center gap-1 mt-1.5">
                  <InfoIcon className="w-3 h-3 text-red-600 flex-shrink-0" />
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                </div>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 mb-5">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
                Recordarme
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium
                         rounded-lg hover:bg-blue-700 transition-colors duration-150
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>

            {/* Footer link */}
            <p className="text-sm text-center text-slate-500 mt-5">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Regístrate ahora
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
