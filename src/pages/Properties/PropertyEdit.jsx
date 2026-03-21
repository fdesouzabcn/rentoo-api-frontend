import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getProperty, updateProperty } from '@/services/propertyService'
import PropertyForm from '@/components/forms/PropertyForm'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import ErrorMessage from '@/components/custom/ErrorMessage'

export default function PropertyEdit() {
  const { uuid } = useParams()
  const navigate = useNavigate()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch existing property to pre-populate form
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const data = await getProperty(uuid)
        setProperty(data)
      } catch (err) {
        setFetchError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [uuid])

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      await updateProperty(uuid, formData)
      toast.success('Propiedad actualizada correctamente')
      navigate(`/properties/${uuid}`)
    } finally {
      setIsSubmitting(false)
    }
    // Errors propagate to PropertyForm's catch block for 422 / 403 handling
  }

  if (loading) return <LoadingSpinner />
  if (fetchError) {
    return (
      <ErrorMessage
        error={fetchError}
        fallback403="No tienes permiso para editar esta propiedad."
        fallback404="Propiedad no encontrada."
      />
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-medium text-slate-900">Editar Propiedad</h1>
        <p className="text-sm text-slate-500 mt-1">
          Modifica los campos que necesites. Todos los campos requeridos deben estar completos.
        </p>
      </div>

      <PropertyForm
        initialValues={property}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
