import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@/components/icons'

// SectionTitleLink — clickable section heading with count and a chevron
// that appears on hover. Used for "Propiedades (n)" and "Contratos (n)"
// section headings in Profile, PropertiesList, PropertyDetail.
export default function SectionTitleLink({ title, count, to, size = 'sm' }) {
  const navigate = useNavigate()

  const titleClass = size === 'base'
    ? 'text-base font-medium text-slate-900'
    : 'text-sm font-medium text-slate-900'

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group inline-flex items-center gap-1.5 cursor-pointer
                 rounded-md px-1 py-0.5 hover:bg-blue-50 transition-colors"
    >
      <span className={titleClass}>{title}</span>
      {count !== null && count !== undefined && (
        <span className="text-xs text-slate-400 font-normal">({count})</span>
      )}
      <ChevronRightIcon
        className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </button>
  )
}
