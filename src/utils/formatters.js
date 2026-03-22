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

export const getCertStatus = (expiryDateString, thresholdDays = 90) => {
  if (!expiryDateString) return null
  const expiry = new Date(expiryDateString)
  if (isNaN(expiry.getTime())) return null
  const now = new Date()
  if (expiry < now) return 'expired'
  const daysUntil = (expiry - now) / (1000 * 60 * 60 * 24)
  if (daysUntil <= thresholdDays) return 'warning'
  return 'ok'
}

// ── Session 7 additions ───────────────────────────────────────────────────────

// Used by ContractCard and ContractsList to detect expiring active contracts.
// Returns false for null end_date, non-active status, or expired contracts.
export const isContractExpiringSoon = (endDate, status, thresholdDays = 90) => {
  if (!endDate || status !== 'active') return false
  const expiry = new Date(endDate)
  if (isNaN(expiry.getTime())) return false
  const daysUntil = (expiry - new Date()) / (1000 * 60 * 60 * 24)
  return daysUntil >= 0 && daysUntil <= thresholdDays
}

// Used by ContractCard to render the inline warning message below the Fin value.
// Returns null when end_date is null or already expired.
export const formatContractExpiryMessage = (endDate) => {
  if (!endDate) return null
  const expiry = new Date(endDate)
  if (isNaN(expiry.getTime())) return null
  const daysUntil = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24))
  if (daysUntil < 0) return null
  if (daysUntil === 0) return 'vence hoy'
  if (daysUntil === 1) return 'vence en 1 día'
  return `vence en ${daysUntil} días`
}

// Used in ContractDetail document body.
// Returns "1 de septiembre de 2025" or null for missing/invalid input.
export const formatDateLong = (isoString) => {
  if (!isoString) return null
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Used in ContractDetail document prose for rent/deposit amounts.
// Returns "690,00 EUROS (690,00 €)" or "—" for missing/invalid input.
export const formatCurrencyLong = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  const num = parseFloat(value)
  if (isNaN(num)) return '—'
  const formatted = num.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${formatted} EUROS (${formatted} €)`
}