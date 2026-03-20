import { useNavigate } from 'react-router-dom'
import StatusBadge from '@/components/custom/StatusBadge'
import FieldValue from '@/components/custom/FieldValue'
import {
  ChevronRightIcon,
  MapPinIcon,
  UserIcon,
} from '@/components/icons'
import { formatCurrency, formatDate } from '@/utils/formatters'

// Shared component for rendering a contract.
// variant='full'    → Card used in PropertiesList and Profile
//                     (full card with header, meta grid, footer)
// variant='compact' → Row used in PropertyDetail
//                     (single horizontal row)
// variant='inline'  → Borderless row that sits inside a parent card.
//                     Full meta grid like 'full' but no outer border —
//                     rows separated by a top border divider instead.
//                     Used in PropertyDetail contracts card.

export default function ContractCard({ contract, property, variant = 'full' }) {
  const navigate = useNavigate()
  const isFinalized = contract.status === 'finalized'
 
  const tenantNames = [contract.tenant1_name, contract.tenant2_name]
    .filter(Boolean)
    .join(' + ')
 
  // ── inline variant ────────────────────────────────────────────────────────
  // No outer border — sits cleanly inside PropertyDetail's contracts card.
  // Full meta grid for readability. Divider comes from border-t on the row.
 
  if (variant === 'inline') {
    return (
      <div
        className={`px-5 py-4 border-t border-slate-100 flex flex-col gap-3 ${
          isFinalized ? 'opacity-[0.72]' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-slate-900 truncate">{tenantNames}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end flex-shrink-0">
            {contract.is_tensioned_area && (
              <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700
                               border border-purple-200 text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                <MapPinIcon className="w-[9px] h-[9px]" />
                Zona tensionada
              </span>
            )}
            <StatusBadge status={contract.status} />
          </div>
        </div>
 
        {/* Meta grid — same 4-column layout as full variant */}
        <div className="grid grid-cols-4 gap-2.5">
          <FieldValue label="Inicio"        value={formatDate(contract.start_date)} />
          <FieldValue label="Fin"           value={contract.end_date ? formatDate(contract.end_date) : null} />
          <FieldValue label="Renta mensual" value={formatCurrency(contract.monthly_rent)} />
          <FieldValue label="Fianza legal"  value={formatCurrency(contract.legal_deposit)} />
        </div>
 
        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1.5 flex-wrap">
            {[contract.tenant1_name, contract.tenant2_name].filter(Boolean).map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 bg-slate-100 rounded-md
                           text-[11px] text-slate-500 px-1.5 py-0.5"
              >
                <UserIcon className="w-[11px] h-[11px]" />
                {name}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5
                        rounded-md transition-colors ${
              isFinalized
                ? 'bg-slate-400 text-white hover:bg-slate-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Ver Contrato
            <ChevronRightIcon className="w-[11px] h-[11px]" />
          </button>
        </div>
      </div>
    )
  }
 
  // ── compact variant ───────────────────────────────────────────────────────
  // Single horizontal row. Financial info in one subtitle line.
 
  if (variant === 'compact') {
    return (
      <div
        className={`px-5 py-3 border-b border-slate-100 flex items-center gap-3 ${
          isFinalized ? 'opacity-[0.72]' : ''
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-slate-900 truncate">{tenantNames}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {formatDate(contract.start_date)}
            {' · '}
            {contract.end_date ? formatDate(contract.end_date) : 'Indefinido'}
            {' · '}
            {formatCurrency(contract.monthly_rent)}/mes
            {' · '}
            Fianza: {formatCurrency(contract.legal_deposit)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end flex-shrink-0">
          {contract.is_tensioned_area && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700
                             border border-purple-200 text-[10px] font-medium px-1.5 py-0.5 rounded-md">
              <MapPinIcon className="w-[9px] h-[9px]" />
              Zona tensionada
            </span>
          )}
          <StatusBadge status={contract.status} />
          <button
            type="button"
            onClick={() => navigate(`/contracts/${contract.id}`)}
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5
                        rounded-md transition-colors ${
              isFinalized
                ? 'bg-slate-400 text-white hover:bg-slate-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Ver Contrato
            <ChevronRightIcon className="w-[11px] h-[11px]" />
          </button>
        </div>
      </div>
    )
  }
 
  // full variant (default) ────────────────────────────────────────────────
  // Bordered card. Used in PropertiesList and Profile.
 
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl px-4 py-4 flex flex-col gap-3 ${
        isFinalized ? 'opacity-[0.72]' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{tenantNames}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {property?.address} · {property?.city}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end flex-shrink-0">
          {contract.is_tensioned_area && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700
                             border border-purple-200 text-[11px] font-medium px-2 py-0.5 rounded-md">
              <MapPinIcon className="w-[10px] h-[10px]" />
              Zona tensionada
            </span>
          )}
          <StatusBadge status={contract.status} />
        </div>
      </div>
 
      {/* Meta grid */}
      <div className="grid grid-cols-4 gap-2.5">
        <FieldValue label="Inicio"        value={formatDate(contract.start_date)} />
        <FieldValue label="Fin"           value={contract.end_date ? formatDate(contract.end_date) : null} />
        <FieldValue label="Renta mensual" value={formatCurrency(contract.monthly_rent)} />
        <FieldValue label="Fianza legal"  value={formatCurrency(contract.legal_deposit)} />
      </div>
 
      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
        <div className="flex gap-1.5 flex-wrap">
          {[contract.tenant1_name, contract.tenant2_name].filter(Boolean).map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 bg-slate-100 rounded-md
                         text-[11px] text-slate-500 px-1.5 py-0.5"
            >
              <UserIcon className="w-[11px] h-[11px]" />
              {name}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate(`/contracts/${contract.id}`)}
          className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5
                      rounded-[7px] transition-colors ${
            isFinalized
              ? 'bg-slate-400 text-white hover:bg-slate-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Ver Contrato
          <ChevronRightIcon className="w-[11px] h-[11px]" />
        </button>
      </div>
    </div>
  )
}