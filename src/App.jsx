import StatusBadge from '@/components/custom/StatusBadge'

export default function App() {
  return (
    <div className="p-8 flex gap-4 items-center">
      <StatusBadge status="draft" />
      <StatusBadge status="active" />
      <StatusBadge status="finalized" />
      <StatusBadge status="unknown" />
    </div>
  )
}