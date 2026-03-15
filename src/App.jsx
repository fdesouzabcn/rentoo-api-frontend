// App.jsx — TEMPORARY Phase 1 throwaway — will be replaced in Phase 2

function StatusBadgeRaw({ status }) {
  let classes = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '

  if (status === 'draft') {
    classes += 'bg-slate-100 text-slate-700'
  } else if (status === 'active') {
    classes += 'bg-green-100 text-green-700'
  } else if (status === 'finalized') {
    classes += 'bg-blue-100 text-blue-700'
  }

  return <span className={classes}>{status}</span>
}

export default function App() {
  return (
    <div className="p-8 flex gap-4">
      <StatusBadgeRaw status="draft" />
      <StatusBadgeRaw status="active" />
      <StatusBadgeRaw status="finalized" />
    </div>
  )
}