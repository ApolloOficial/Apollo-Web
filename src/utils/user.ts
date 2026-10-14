export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

export function formatRole(role: string): string {
  const text = role.replace(/_/g, ' ').toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function normalizeRole(role: string): string {
  return role
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, '')
}
