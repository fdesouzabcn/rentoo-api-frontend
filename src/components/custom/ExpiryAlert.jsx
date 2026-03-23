import { formatDate } from '@/utils/formatters'
import { WarningTriangleIcon } from '@/components/icons'

export default function ExpiryAlert({ properties }) {
  if (!properties || properties.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-lg px-3.5 py-3 flex gap-2.5 items-start mb-5">
      <WarningTriangleIcon className="w-4 h-4 stroke-amber-600 flex-shrink-0 mt-0.5" />

      <div className="flex-1">
        <p className="text-xs font-semibold text-amber-900 mb-2">
          Contratos por vencer
        </p>

        {properties.map((item, index) => (
          <div
            key={item.property_id}
            className={`flex items-center justify-between gap-8 py-1 ${
              index > 0 ? 'border-t border-amber-200' : ''
            }`}
          >
            <span className="text-xs text-amber-800">
              {item.property_address} — vence el {formatDate(item.contract_end_date)}
            </span>

            <span className="bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0">
              {item.days_until_expiry} días
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}