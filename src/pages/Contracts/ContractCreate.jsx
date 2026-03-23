import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { getProperties } from '@/services/propertyService'
import { createContract } from '@/services/contractService'
import ContractForm from '@/components/forms/ContractForm'
import LoadingSpinner from '@/components/custom/LoadingSpinner'

export default function ContractCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuth()

  // Property pre-fill from PropertyDetail navigation
  const lockedPropertyId = location.state?.property_id ?? null

  const [properties, setProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .catch(setLoadError)
      .finally(() => setLoadingProperties(false))
  }, [])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)
    try {
      const newContract = await createContract(payload)
      toast.success('Contrato creado correctamente')
      navigate(`/contracts/${newContract.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingProperties) return <LoadingSpinner />

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
        <p className="text-sm text-red-800">
          {loadError?.message ?? 'No se pudo cargar la lista de propiedades.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-medium text-slate-900">Crear Nuevo Contrato</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete el formulario para registrar un nuevo contrato de arrendamiento.
        </p>
      </div>

      <ContractForm
        initialValues={null}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        properties={properties}
        lockedPropertyId={lockedPropertyId}
        isAdmin={isAdmin()}
      />
    </div>
  )
}