// FieldValue — Option A label/value pair (uppercase micro label).
// Used in property cards, contract cards, detail pages.
export default function FieldValue({ label, value, className = '' }) {
  const display = (value === null || value === undefined || value === '')
    ? <span className="text-slate-400 italic text-[11px]">—</span>
    : <span className="text-xs text-slate-900 font-medium">{value}</span>

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
        {label}
      </span>
      {display}
    </div>
  )
}
