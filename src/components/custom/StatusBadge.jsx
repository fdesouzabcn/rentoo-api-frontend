// StatusBadge — raw Tailwind spans per Spec A
// draft=slate / active=green / finalized=blue

const STATUS_CONFIG = {
  draft: {
    label: 'Borrador',
    className: 'bg-slate-100 text-slate-600',
  },
  active: {
    label: 'Activo',
    className: 'bg-green-100 text-green-800',
  },
  finalized: {
    label: 'Finalizado',
    className: 'bg-blue-50 text-blue-800',
  },
}

/**
 * @param {{ status: 'draft' | 'active' | 'finalized' }} props
 */
export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium
                  ${config.className}`}
    >
      {config.label}
    </span>
  )
}
