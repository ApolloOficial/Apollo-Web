import type { ApiErrorDto } from '../types/auth.types'
import { translateApiMessage } from '../utils/api-messages'
import { clearSession, getSession } from '../utils/session'

import { UNAUTHORIZED_EVENT } from '../utils/events'

export { UNAUTHORIZED_EVENT }

const SESSION_EXPIRED_MESSAGE = 'Sessão expirada. Faça login novamente.'
const FORBIDDEN_MESSAGE = 'Sem permissão para realizar esta ação.'
const NETWORK_ERROR_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
const INVALID_RESPONSE_MESSAGE =
  'O servidor retornou uma resposta inesperada. Tente novamente em instantes.'
const CREDENTIAL_PATHS = ['/auth/login', '/auth/password', '/mobile/auth/']

const BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
).replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number
  readonly code: string | null
  readonly traceId: string | null

  constructor(
    message: string,
    status: number,
    code: string | null = null,
    traceId: string | null = null,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.traceId = traceId
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

  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
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
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE, 0)
  }

  if (!response.ok) {
    const expiredSession = response.status === 401 && !isCredentialPath(path)

    if (expiredSession) {
      clearSession()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    const { message, code, traceId } = await extractError(
      response,
      expiredSession,
    )
    throw new ApiError(message, response.status, code, traceId)
  }

  const text = await response.text()
  if (!text) return undefined as TResponse

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new ApiError(INVALID_RESPONSE_MESSAGE, response.status)
  }

  try {
    return JSON.parse(text) as TResponse
  } catch {
    throw new ApiError(INVALID_RESPONSE_MESSAGE, response.status)
  }
}

interface ExtractedError {
  message: string
  code: string | null
  traceId: string | null
}

async function extractError(
  response: Response,
  expiredSession: boolean,
): Promise<ExtractedError> {
  const fallback =
    response.status >= 500
      ? 'O servidor está indisponível no momento. Tente novamente em instantes.'
      : 'Não foi possível concluir a operação. Tente novamente.'

  if (expiredSession) {
    return { message: SESSION_EXPIRED_MESSAGE, code: null, traceId: null }
  }

  if (response.status === 403) {
    return { message: FORBIDDEN_MESSAGE, code: null, traceId: null }
  }

  try {
    const body = (await response.json()) as Partial<ApiErrorDto> | null
    const code = body?.code ?? null
    const traceId = body?.traceId ?? null

    if (body?.message) {
      return {
        message: translateApiMessage(body.message, code),
        code,
        traceId,
      }
    }

    return { message: fallback, code, traceId }
  } catch {
    return { message: fallback, code: null, traceId: null }
  }
}
