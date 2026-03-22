import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { getContract, updateContract } from '@/services/contractService'
import { getProperties } from '@/services/propertyService'
import ContractForm from '@/components/forms/ContractForm'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import { InfoIcon } from '@/components/icons'

export default function ContractEdit() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [contract, setContract] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([getContract(uuid), getProperties()])
      .then(([contractData, propertiesData]) => {
        setContract(contractData)
        setProperties(Array.isArray(propertiesData) ? propertiesData : [])
      })
      .catch(setLoadError)
      .finally(() => setLoading(false))
  }, [uuid])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)
    try {
      await updateContract(uuid, payload)
      toast.success('Contrato actualizado correctamente')
      navigate(`/contracts/${uuid}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (loadError) {
    const msg =
      loadError?.status === 403 ? 'No tienes permiso para editar este contrato.' :
      loadError?.status === 404 ? 'Contrato no encontrado.' :
      loadError?.status === 0   ? 'No se pudo conectar con el servidor.' :
      loadError?.message ?? 'Ha ocurrido un error inesperado.'

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
        <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">{msg}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-medium text-slate-900">Editar Contrato</h1>
        <p className="text-sm text-slate-500 mt-1">
          Modifica los campos que necesites. Todos los campos requeridos deben estar completos.
        </p>
      </div>

      <ContractForm
        initialValues={contract}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        properties={properties}
        lockedPropertyId={null}
        isAdmin={isAdmin()}
      />
    </div>
  )
}