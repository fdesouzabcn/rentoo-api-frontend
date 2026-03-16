import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { register as registerService } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [bannerError, setBannerError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear the field error as the user types
    setFieldErrors((prev) => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    setBannerError(null)
    setLoading(true)

    try {
      const result = await registerService(formData)
      // result = { data: { id, name, email }, token: "..." }
      // Store token and fetch full user (same pattern as login in AuthContext)
      sessionStorage.setItem('rentoo_token', result.token)

      // Re-use login to complete the auth flow properly
      // (sets token, fetches full user with roles, updates context)
      await login(formData.email, formData.password)
      navigate('/', { replace: true })
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setFieldErrors(err.errors)
      } else {
        setBannerError(err.message ?? 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (name) => fieldErrors[name]?.[0] ?? null

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Rentoo</CardTitle>
          <p className="text-sm text-muted-foreground text-center">Create your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {bannerError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {bannerError}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name" name="name" value={formData.name}
                onChange={handleChange} placeholder="Joan Puig"
              />
              {getFieldError('name') && (
                <p className="text-xs text-destructive">{getFieldError('name')}</p>
              )}
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <Label htmlFor="dni">DNI / NIE</Label>
              <Input
                id="dni" name="dni" value={formData.dni}
                onChange={handleChange} placeholder="12345678A"
              />
              {getFieldError('dni') && (
                <p className="text-xs text-destructive">{getFieldError('dni')}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" name="email" type="email" value={formData.email}
                onChange={handleChange} placeholder="joan@example.com"
              />
              {getFieldError('email') && (
                <p className="text-xs text-destructive">{getFieldError('email')}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="600111222"
              />
              {getFieldError('phone') && (
                <p className="text-xs text-destructive">{getFieldError('phone')}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Street address</Label>
              <Input
                id="address" name="address" value={formData.address}
                onChange={handleChange} placeholder="Carrer de Balmes, 10"
              />
              {getFieldError('address') && (
                <p className="text-xs text-destructive">{getFieldError('address')}</p>
              )}
            </div>

            {/* City + Postal code on same row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city" name="city" value={formData.city}
                  onChange={handleChange} placeholder="Barcelona"
                />
                {getFieldError('city') && (
                  <p className="text-xs text-destructive">{getFieldError('city')}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal code</Label>
                <Input
                  id="postal_code" name="postal_code" value={formData.postal_code}
                  onChange={handleChange} placeholder="08007"
                />
                {getFieldError('postal_code') && (
                  <p className="text-xs text-destructive">{getFieldError('postal_code')}</p>
                )}
              </div>
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province" name="province" value={formData.province}
                onChange={handleChange} placeholder="Barcelona"
              />
              {getFieldError('province') && (
                <p className="text-xs text-destructive">{getFieldError('province')}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" name="password" type="password" value={formData.password}
                onChange={handleChange} placeholder="Min. 8 characters"
              />
              {getFieldError('password') && (
                <p className="text-xs text-destructive">{getFieldError('password')}</p>
              )}
            </div>

            {/* Password confirmation */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm password</Label>
              <Input
                id="password_confirmation" name="password_confirmation"
                type="password" value={formData.password_confirmation}
                onChange={handleChange} placeholder="Repeat password"
              />
              {getFieldError('password_confirmation') && (
                <p className="text-xs text-destructive">{getFieldError('password_confirmation')}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}