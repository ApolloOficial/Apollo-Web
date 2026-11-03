const RECOVERED_KEY = 'apollo:recovered-passwords'
const RECOVERED_VERSION = 1

interface StoredRecovered {
  _versao: number
  emails: string[]
}

function normalize(email: string): string {
  return email.trim().toLowerCase()
}

function read(): string[] {
  try {
    const raw = localStorage.getItem(RECOVERED_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as StoredRecovered
    if (parsed._versao !== RECOVERED_VERSION || !Array.isArray(parsed.emails)) {
      localStorage.removeItem(RECOVERED_KEY)
      return []
    }

    return parsed.emails
  } catch {
    return []
  }
}

export function markPasswordRecovered(email: string): void {
  const normalized = normalize(email)
  if (normalized === '') return

  const emails = read()
  if (emails.includes(normalized)) return

  const payload: StoredRecovered = {
    _versao: RECOVERED_VERSION,
    emails: [...emails, normalized],
  }

  try {
    localStorage.setItem(RECOVERED_KEY, JSON.stringify(payload))
  } catch {
    return
  }
}

export function wasPasswordRecovered(email: string): boolean {
  const normalized = normalize(email)
  return normalized !== '' && read().includes(normalized)
}
