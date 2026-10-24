export function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, '')

  if (digits.length !== 14) return value

  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  )
}

function formatNumber(value: number) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
}

export function formatKwp(value: number | null | undefined) {
  if (value === null || value === undefined) return '-'

  return `${formatNumber(value)} kWp`
}

export function formatKw(value: number | null | undefined) {
  if (value === null || value === undefined) return '-'

  return `${formatNumber(value)} kW`
}

export function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) return '-'

  return `${Math.round(value)}%`
}

export function padNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return '-'

  return String(value).padStart(2, '0')
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '-'

  const [year, month, day] = value.slice(0, 10).split('-')

  if (!year || !month || !day) return value

  return `${day}/${month}/${year}`
}

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime()
}

export function formatLastReading(value: string | null | undefined) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  )

  if (days === 0) return `hoje, às ${time}`
  if (days === 1) return `ontem, às ${time}`

  return `${formatDate(value)}, às ${time}`
}

export function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${now.getFullYear()}-${month}-${day}`
}
