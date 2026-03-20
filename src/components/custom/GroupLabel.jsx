// GroupLabel — uppercase divider used to separate contract groups by property.
// Renders: LABEL TEXT ─────────────────
export default function GroupLabel({ text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.08em] text-slate-400 font-medium whitespace-nowrap">
        {text}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  )
}
