//ErrorMessage — two display modes:
// 1. Banner mode (default): Pass an `error` object from the Axios interceptor and optional fallback strings.
// 2. Field mode: Pass a plain `message` string instead of `error`.

export default function ErrorMessage({
  // Banner mode props
  error,
  fallback403 = 'No tienes permiso para realizar esta acción.',
  fallback404 = 'El recurso solicitado no existe.',
  fallbackNetwork = 'No se pudo conectar con el servidor.',
  fallbackDefault = 'Ha ocurrido un error inesperado.',

  // Field mode prop
  message,
}) {
  // Field mode
  if (message) {
    return (
      <p className="flex items-center gap-1 mt-0.5 text-xs text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[11px] h-[11px] flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
          />
        </svg>
        {message}
      </p>
    )
  }

  // Banner mode
  if (!error) return null

  let displayMessage = fallbackDefault
  if (error?.status === 403) displayMessage = fallback403
  else if (error?.status === 404) displayMessage = fallback404
  else if (!error?.status) displayMessage = fallbackNetwork
  else if (error?.message) displayMessage = error.message

  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
      <p className="text-sm text-red-800 leading-relaxed">{displayMessage}</p>
    </div>
  )
}