import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    className: 'rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200',
  },
  active: {
    label: 'Active',
    className: 'rounded-full bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
  },
  finalized: {
    label: 'Finalized',
    className: 'rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200',
  },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'rounded-full bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200',
  }

  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}