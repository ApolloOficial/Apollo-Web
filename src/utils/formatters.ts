const SAO_PAULO_TIME_ZONE = 'America/Sao_Paulo'
const OFFSET_PATTERN = /(?:Z|[+-]\d{2}:?\d{2})$/i
const LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/

interface CalendarMoment {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

function getSaoPauloMoment(date: Date): CalendarMoment {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  function read(type: Intl.DateTimeFormatPartTypes) {
    return Number(parts.find((part) => part.type === type)?.value)
  }

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
  }
}

function parseSaoPauloMoment(value: string): CalendarMoment | null {
  if (OFFSET_PATTERN.test(value)) {
    const date = new Date(value)

    return Number.isNaN(date.getTime()) ? null : getSaoPauloMoment(date)
  }

  const match = LOCAL_DATE_TIME_PATTERN.exec(value)

  if (!match) return null

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
  }
}

function toDayNumber({ year, month, day }: CalendarMoment) {
  return Date.UTC(year, month - 1, day) / 86_400_000
}

function formatTime({ hour, minute }: CalendarMoment) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

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

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '-'

  const moment = parseSaoPauloMoment(value)

  if (!moment) return value

  const day = String(moment.day).padStart(2, '0')
  const month = String(moment.month).padStart(2, '0')

  return `${day}/${month}/${moment.year} ${formatTime(moment)}`
}

export function formatLastReading(value: string | null | undefined) {
  if (!value) return '-'

  const moment = parseSaoPauloMoment(value)

  if (!moment) return '-'

  const time = formatTime(moment)
  const days = toDayNumber(getSaoPauloMoment(new Date())) - toDayNumber(moment)

  if (days === 0) return `hoje, às ${time}`
  if (days === 1) return `ontem, às ${time}`

  return `${formatDate(value)}, às ${time}`
}

export function todayIso() {
  const { year, month, day } = getSaoPauloMoment(new Date())

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
