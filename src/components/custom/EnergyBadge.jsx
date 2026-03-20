// EnergyBadge — displays energy certificate rating A–G.
// Colour ramp: A (green) → G (red)

const RATING_CONFIG = {
  A: 'bg-green-100 text-green-900',
  B: 'bg-emerald-100 text-emerald-900',
  C: 'bg-lime-100 text-lime-900',
  D: 'bg-yellow-100 text-yellow-900',
  E: 'bg-amber-100 text-amber-900',
  F: 'bg-orange-100 text-orange-900',
  G: 'bg-red-100 text-red-900',
}

export default function EnergyBadge({ rating }) {
  if (!rating) return null

  const upper = rating.toUpperCase()
  const colourClass = RATING_CONFIG[upper] ?? 'bg-slate-100 text-slate-700'

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md text-xs font-semibold
                  px-2.5 py-0.5 min-w-[24px] ${colourClass}`}
    >
      {upper}
    </span>
  )
}
