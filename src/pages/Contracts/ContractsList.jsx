import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getContracts } from '@/services/contractService'
import { getProperties } from '@/services/propertyService'
import { useAuth } from '@/hooks/useAuth'
import ContractCard from '@/components/custom/ContractCard'
import GroupLabel from '@/components/custom/GroupLabel'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import { InfoIcon, PlusIcon } from '@/components/icons'


const STATUS_ORDER = { active: 0, draft: 1, finalized: 2 }

function sortContracts(contracts) {
  return [...contracts].sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    if (statusDiff !== 0) return statusDiff
    return new Date(b.start_date ?? 0) - new Date(a.start_date ?? 0)
  })
}

export default function ContractsList() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const [contracts, setContracts] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getContracts(), getProperties()])
      .then(([contractsData, propertiesData]) => {
        setContracts(sortContracts(contractsData))
        setProperties(Array.isArray(propertiesData) ? propertiesData : [])
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  // Build a lookup map: property_id → property object
  const propertyMap = properties.reduce((acc, p) => {
    acc[p.id] = p
    return acc
  }, {})

  // Group sorted contracts by property_id, preserving API property order
  const contractsByProperty = contracts.reduce((acc, c) => {
    if (!acc[c.property_id]) acc[c.property_id] = []
    acc[c.property_id].push(c)
    return acc
  }, {})

  // Contracts whose property_id doesn't appear in the properties array
  const orphaned = contracts.filter((c) => !propertyMap[c.property_id])

  if (loading) return <LoadingSpinner />

  if (error) {
    const msg =
      error.status === 403 ? 'No tienes permiso para ver los contratos.' :
      error.status === 0   ? 'No se pudo conectar con el servidor.' :
                             (error.message ?? 'Ha ocurrido un error inesperado.')
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
        <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">{msg}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-medium text-slate-900">Mis contratos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {contracts.length} {contracts.length === 1 ? 'contrato registrado' : 'contratos registrados'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/contracts/new')}
          className={`inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2
                      rounded-lg text-white transition-colors ${
            isAdmin()
              ? 'bg-purple-700 hover:bg-purple-800'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Nuevo Contrato
        </button>
      </div>

      {/* Empty state */}
      {contracts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400">No hay contratos registrados.</p>
          <Link
            to={properties.length > 0 ? '/contracts/new' : '/properties/create'}
            className="text-sm text-blue-600 font-medium hover:underline mt-1 block"
          >
            {properties.length > 0
              ? 'Crear primer contrato →'
              : 'Añadir una propiedad primero →'}
          </Link>
        </div>
      )}

      {/* Grouped contract list */}
      {contracts.length > 0 && (
        <div className="flex flex-col">
          {/* Render one group per property, in API order */}
          {properties.map((property) => {
            const group = contractsByProperty[property.id] ?? []
            if (group.length === 0) return null
            return (
              <div key={property.id} className="mt-4 first:mt-0">
                <GroupLabel text={`${property.address} · ${property.city}`} />
                <div className="flex flex-col gap-2">
                  {group.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      property={property}
                      variant="full"
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Orphaned contracts — property not found in properties array */}
          {orphaned.length > 0 && (
            <div className="mt-4">
              {orphaned.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  property={null}
                  variant="full"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}