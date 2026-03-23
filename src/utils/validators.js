export function validateRequired(value) {
  if (value === null || value === undefined) return 'Este campo es obligatorio.'
  if (typeof value === 'string' && value.trim() === '') return 'Este campo es obligatorio.'
  return null
}

export function validateEmail(value) {
  if (!value || value.trim() === '') return 'El correo electrónico es obligatorio.'
  if (!/\S+@\S+\.\S+/.test(value)) return 'Introduce un correo electrónico válido.'
  return null
}

export function validateDni(value) {
  if (!value || value.trim() === '') return 'El DNI/NIE es obligatorio.'
  if (!/^([0-9]{8}|[XYZ][0-9]{7})[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(value.trim())) {
    return 'Formato no válido. Ejemplo: 12345678A o X1234567A'
  }
  return null
}

export function validateCadastralReference(value) {
  if (!value || value.trim() === '') return 'La referencia catastral es obligatoria.'
  if (!/^[A-Z0-9]{20}$/i.test(value.trim())) {
    return 'Debe tener exactamente 20 caracteres alfanuméricos.'
  }
  return null
}

export function validateFutureDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Introduce una fecha válida.'
  // Compare against start of today (midnight local time)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date <= today) return 'La fecha de vencimiento debe ser posterior a hoy.'
  return null
}

export function validateDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Introduce una fecha válida.'
  return null
}

export function validateNumeric(value, { min, max, label = 'El valor' } = {}) {
  if (value === '' || value === null || value === undefined) return null // let validateRequired handle empty
  const num = parseFloat(value)
  if (isNaN(num)) return `${label} debe ser un número.`
  if (min !== undefined && num < min) return `${label} mínimo permitido es ${min}.`
  if (max !== undefined && num > max) return `${label} máximo permitido es ${max}.`
  return null
}

export function validateInteger(value, { min, max, label = 'El valor' } = {}) {
  if (value === '' || value === null || value === undefined) return null
  const num = parseInt(value, 10)
  if (isNaN(num) || String(num) !== String(parseInt(value, 10))) {
    return `${label} debe ser un número entero.`
  }
  if (min !== undefined && num < min) return `El valor mínimo es ${min}.`
  if (max !== undefined && num > max) return `El valor máximo es ${max}.`
  return null
}

export function validateCertificateNumber(value) {
  if (!value || value.trim() === '') return 'El número de certificado es obligatorio.'
  if (!/^[A-Z0-9]+$/i.test(value.trim())) {
    return 'Solo se permiten letras y números.'
  }
  return null
}

export function validateFutureOrToday(value) {
  if (!value) return 'Este campo es obligatorio.'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Introduce una fecha válida.'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return 'La fecha de inicio debe ser hoy o posterior.'
  return null
}

export function validateDateAfter(value, afterValue) {
  if (!value) return null       // end_date is optional
  if (!afterValue) return null  // can't validate without a reference
  const end = new Date(value)
  const start = new Date(afterValue)
  if (isNaN(end.getTime())) return 'Introduce una fecha válida.'
  if (end <= start) return 'La fecha de fin debe ser posterior a la fecha de inicio.'
  return null
}