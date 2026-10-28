import { clearSession, getSession } from '../utils/session'

export const UNAUTHORIZED_EVENT = 'apollo:unauthorized'

const SESSION_EXPIRED_MESSAGE = 'Sessão expirada. Faça login novamente.'
const FORBIDDEN_MESSAGE = 'Sem permissão para realizar esta ação.'
const CREDENTIAL_PATHS = ['/auth/login', '/auth/password', '/mobile/auth/']

const BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
).replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function isCredentialPath(path: string): boolean {
  return CREDENTIAL_PATHS.some((prefix) => path.startsWith(prefix))
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

export async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const session = getSession()

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(session
        ? { Authorization: `${session.tokenType} ${session.token}` }
        : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const expiredSession = response.status === 401 && !isCredentialPath(path)

    if (expiredSession) {
      clearSession()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    const message = await extractErrorMessage(response, expiredSession)
    throw new ApiError(message, response.status)
  }

  const text = await response.text()
  if (!text) return undefined as TResponse

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      'A API retornou uma resposta inválida. Confirme se o Spring está rodando na porta 8080.',
    )
  }

  try {
    return JSON.parse(text) as TResponse
  } catch {
    throw new Error('A API retornou um JSON inválido.')
  }
}

async function extractErrorMessage(
  response: Response,
  expiredSession: boolean,
): Promise<string> {
  if (expiredSession) return SESSION_EXPIRED_MESSAGE
  if (response.status === 403) return FORBIDDEN_MESSAGE

  try {
    const body = await response.json()
    if (body?.message) return body.message
  } catch {
    return `Erro ${response.status}: ${response.statusText}`
  }
  return `Erro ${response.status}: ${response.statusText}`
}
