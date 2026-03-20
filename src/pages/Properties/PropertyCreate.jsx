import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createProperty } from '@/services/propertyService'
import PropertyForm from '@/components/forms/PropertyForm'

export default function PropertyCreate() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      const newProperty = await createProperty(formData)
      toast.success('Propiedad creada correctamente')
      navigate(`/properties/${newProperty.id}`)
    } finally {
      setIsSubmitting(false)
    }
    // Errors are re-thrown by the service layer and caught in PropertyForm's
    // handleSubmit — no catch needed here.
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-medium text-slate-900">Crear Nueva Propiedad</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete el formulario para registrar una nueva propiedad.
        </p>
      </div>

      <PropertyForm
        initialValues={null}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
