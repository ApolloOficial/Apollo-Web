const SESSION_KEY = 'apollo:session'
const SESSION_VERSION = 1

export interface StoredSession {
  _versao: number
  token: string
  tokenType: string
}

export function saveSession(data: Omit<StoredSession, '_versao'>): void {
  const payload: StoredSession = { _versao: SESSION_VERSION, ...data }
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload))
}

export function getSession(): StoredSession | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as StoredSession
    if (parsed._versao !== SESSION_VERSION) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
