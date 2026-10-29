export const ROLE = {
  MANAGER: 'GERENTE',
  OPERATOR: 'OPERADOR',
  ANALYST: 'ANALISTA',
  TECHNICIAN: 'TECNICO',
} as const

const ROLE_ALIASES: Record<string, string> = {
  MANAGER: 'GERENTE',
  OPERATOR: 'OPERADOR',
  ANALYST: 'ANALISTA',
  TECHNICIAN: 'TECNICO',
}

const ROLE_LABELS: Record<string, string> = {
  GERENTE: 'Gerente',
  OPERADOR: 'Operador',
  ANALISTA: 'Analista',
  TECNICO: 'Técnico',
}

export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

export function normalizeRole(role: string): string {
  const normalized = role
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, '')
  return ROLE_ALIASES[normalized] ?? normalized
}

export function formatRole(role: string): string {
  const normalized = normalizeRole(role)
  const label = ROLE_LABELS[normalized]
  if (label) return label
  const text = normalized.replace(/_/g, ' ').toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function isManager(role: string | null | undefined): boolean {
  return role != null && normalizeRole(role) === ROLE.MANAGER
}

export function isTechnician(role: string | null | undefined): boolean {
  return role != null && normalizeRole(role) === ROLE.TECHNICIAN
}

export function isOperator(role: string | null | undefined): boolean {
  return role != null && normalizeRole(role) === ROLE.OPERATOR
}
