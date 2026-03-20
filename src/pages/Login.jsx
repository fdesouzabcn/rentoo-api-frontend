import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import PublicLayout from '@/components/layout/PublicLayout'
import { HouseIcon, EyeOpenIcon, EyeClosedIcon, InfoIcon } from '@/components/icons'

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
    <PublicLayout>
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
                  ? <EyeOpenIcon className="w-4 h-4" />
                  : <EyeClosedIcon className="w-4 h-4" />
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
    </PublicLayout>
  )
}
