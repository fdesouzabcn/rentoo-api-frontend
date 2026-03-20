export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  const num = parseFloat(value)
  if (isNaN(num)) return '—'
  return num.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export const formatDate = (isoString) => {
  if (!isoString) return '—'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formatSurface = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  const num = parseFloat(value)
  if (isNaN(num)) return '—'
  return `${num.toFixed(2)} m²`
}

export const formatDaysUntil = (days) => {
  if (days === null || days === undefined) return '—'
  if (days < 0) return 'Vencido'
  if (days === 0) return 'Hoy'
  return `${days} día${days !== 1 ? 's' : ''}`
}

export const isCertExpiringSoon = (expiryDateString, thresholdDays = 90) => {
  if (!expiryDateString) return false
  const expiry = new Date(expiryDateString)
  if (isNaN(expiry.getTime())) return false
  const daysUntil = (expiry - new Date()) / (1000 * 60 * 60 * 24)
  return daysUntil <= thresholdDays
}
