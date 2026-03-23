import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getFinancialSummary } from '@/services/financialService'
import { getUsers } from '@/services/userService'
import LoadingSpinner from '@/components/custom/LoadingSpinner'
import ExpiryAlert from '@/components/custom/ExpiryAlert'
import StatusBadge from '@/components/custom/StatusBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { InfoIcon, HouseIcon, WarningTriangleIcon } from '@/components/icons'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Summary state
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Admin owner selector state
  const [selectedUuid, setSelectedUuid] = useState(isAdmin() ? null : user?.id)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  // Fetch user list for admin selector
  useEffect(() => {
    if (!isAdmin()) return
    setUsersLoading(true)
    getUsers()
      .then((data) => {
        setUsers(data)
        // Default selection: the logged-in admin, falling back to first user
        const defaultUser = data.find((u) => u.id === user?.id) ?? data[0]
        if (defaultUser) setSelectedUuid(defaultUser.id)
      })
      .catch(() => {
        // Selector failed — fall back to admin's
        setSelectedUuid(user?.id)
      })
      .finally(() => setUsersLoading(false))
  }, [])

  // Fetch summary whenever selectedUuid changes
  useEffect(() => {
    if (!selectedUuid) return
    setLoading(true)
    setError(null)
    setSummary(null)
    getFinancialSummary(selectedUuid)
      .then(setSummary)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [selectedUuid])

  // Error state

  if (error) {
    const msg =
      error.status === 403 ? 'No tienes permiso para ver este panel.' :
      error.status === 0   ? 'No se pudo conectar con el servidor.' :
      error.message ?? 'Ha ocurrido un error inesperado.'
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2.5 items-start">
        <InfoIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800">{msg}</p>
      </div>
    )
  }

  // Page header

  const pageHeader = (
    <div className="flex justify-between items-center mb-5">
      <div>
        <h1 className="text-xl font-medium text-slate-900">Panel financiero</h1>
        <p className="text-sm text-slate-500 mt-0.5">Resumen de ingresos y contratos</p>
      </div>

      {/* Admin owner selector — only shown once user list has loaded */}
      {isAdmin() && !usersLoading && users.length > 0 && (() => {
        const selectedName = users.find((u) => u.id === selectedUuid)?.name ?? '...'
        return (
          <Select value={selectedUuid} onValueChange={setSelectedUuid}>
            <SelectTrigger className="w-[220px]">
              {/* SelectValue cannot read labels when SelectContent is unmounted.
                  Render the name directly so the trigger never shows a raw UUID. */}
              <span className="truncate text-sm">{selectedName}</span>
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      })()}
    </div>
  )

  // Show header + spinner while summary is loading
  if (loading) {
    return (
      <div>
        {pageHeader}
        <LoadingSpinner />
      </div>
    )
  }

  // Empty state

  const isEmpty =
    !summary ||
    !summary.total_properties ||
    summary.total_properties === 0 ||
    !summary.properties?.length

  if (isEmpty) {
    return (
      <div>
        {pageHeader}
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <HouseIcon className="w-12 h-12 stroke-slate-300" />
          <p className="text-lg font-medium text-slate-900">Tu panel está vacío</p>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Añade una propiedad y crea tu primer contrato para ver aquí el resumen financiero.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => navigate('/properties/create')}
              className={`text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isAdmin() ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Añadir propiedad
            </button>
            <button
              onClick={() => navigate('/properties')}
              className="bg-white border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Ver propiedades
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Full dashboard

  const expiringProperties = summary.properties.filter((p) => p.expiring === true)

  return (
    <div>
      {pageHeader}

      {/* Aggregate cards — 5 cards */}
      <div className="grid grid-cols-5 gap-[10px] mb-5">
        <div className="bg-slate-100 rounded-lg px-4 py-[14px]">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1.5">Propiedades</p>
          <p className="text-xl font-semibold text-slate-900">{summary.total_properties}</p>
        </div>
        <div className="bg-slate-100 rounded-lg px-4 py-[14px]">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1.5">Ingresos / Mes</p>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(summary.total_monthly_income)}</p>
        </div>
        <div className="bg-slate-100 rounded-lg px-4 py-[14px]">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1.5">Ingresos Anuales</p>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(summary.total_expected_annual_income)}</p>
        </div>
        <div className="bg-slate-100 rounded-lg px-4 py-[14px]">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1.5">Fianzas Retenidas</p>
          <p className="text-xl font-semibold text-slate-900">{formatCurrency(summary.total_deposits_held)}</p>
        </div>
        <div className="bg-slate-100 rounded-lg px-4 py-[14px]">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-1.5">Por Vencer</p>
          <p className={`text-xl font-semibold ${
            summary.contracts_expiring > 0 ? 'text-amber-600' : 'text-slate-900'
          }`}>
            {summary.contracts_expiring}
          </p>
        </div>
      </div>

      {/* ExpiryAlert */}
      {expiringProperties.length > 0 && (
        <ExpiryAlert properties={expiringProperties} />
      )}

      {/* Per-property section label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
          Por propiedad
        </span>
      </div>

      {/* Per-property cards */}
      <div className="flex flex-col gap-[10px]">
        {summary.properties.map((item) => (
          <PropertyCard
            key={item.property_id}
            item={item}
            isAdmin={isAdmin}
            onNavigate={navigate}
          />
        ))}
      </div>
    </div>
  )
}

// Per-property card

function PropertyCard({ item, isAdmin, onNavigate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

      {/* Card header */}
      <div className="flex items-center justify-between gap-3 px-4 py-[14px] border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <HouseIcon className="w-3.5 h-3.5 stroke-blue-600" />
          </div>
          <span className="text-[13px] font-medium text-slate-900">{item.property_address}</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={item.contract_status} />
          <button
            onClick={() => onNavigate(`/properties/${item.property_id}`)}
            className={`text-[11px] font-medium ${
              isAdmin() ? 'text-purple-700' : 'text-blue-600'
            }`}
          >
            Ver propiedad ›
          </button>
        </div>
      </div>

      {/* Primary row — 4 columns */}
      <div className="grid grid-cols-4 gap-0 border-b border-slate-100">
        <div className="px-4 py-3 border-r border-slate-100">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Renta mensual</p>
          <p className="text-[13px] font-medium text-slate-900">{formatCurrency(item.monthly_rent)}</p>
        </div>
        <div className="px-4 py-3 border-r border-slate-100">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Ingresos anuales</p>
          <p className="text-[13px] font-medium text-slate-900">{formatCurrency(item.expected_annual_income)}</p>
        </div>
        <div className="px-4 py-3 border-r border-slate-100">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Acumulados</p>
          <p className="text-[13px] font-medium text-slate-900">{formatCurrency(item.total_income_to_date)}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Beneficio</p>
          <p className="text-[13px] font-medium text-slate-900">{formatCurrency(item.profit_to_date)}</p>
        </div>
      </div>

      {/* Secondary row — 3 columns */}
      <div className="grid grid-cols-3 gap-0 bg-slate-50">
        <div className="px-4 py-[10px] border-r border-slate-100">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Costes anuales</p>
          <p className="text-[13px] font-medium text-slate-900">
            {item.total_annual_costs === '0.00' ? '—' : formatCurrency(item.total_annual_costs)}
          </p>
        </div>
        <div className="px-4 py-[10px] border-r border-slate-100">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Fianza retenida</p>
          <p className="text-[13px] font-medium text-slate-900">{formatCurrency(item.total_deposits_held)}</p>
        </div>
        <div className="px-4 py-[10px]">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Fin de contrato</p>
          {item.contract_end_date ? (
            <>
              <p className="text-[13px] font-medium text-slate-900">{formatDate(item.contract_end_date)}</p>
              {item.expiring && (
                <div className="inline-flex items-center gap-[3px] mt-[2px]">
                  <WarningTriangleIcon className="w-[11px] h-[11px] stroke-amber-700" />
                  <span className="text-[11px] text-amber-700">{item.days_until_expiry} días</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-[13px] text-slate-400 italic">Indefinido</p>
          )}
        </div>
      </div>

    </div>
  )
}