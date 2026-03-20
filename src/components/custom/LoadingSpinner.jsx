// Centred animated spinner for page-level loading states.
// Usage: <LoadingSpinner /> inside a flex-centred wrapper.

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="w-8 h-8 rounded-full border-2 border-slate-200 animate-spin"
        style={{ borderTopColor: '#1d4ed8' }}
      />
    </div>
  )
}