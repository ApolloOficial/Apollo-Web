import { getSession } from '../utils/session'

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '')

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

export async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const session = getSession()

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `${session.tokenType} ${session.token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const message = await extractErrorMessage(response)
    throw new Error(message)
  }

  const text = await response.text()
  if (!text) return undefined as TResponse

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error('A API retornou uma resposta inválida. Confirme se o Spring está rodando na porta 8080.')
  }

  try {
    return JSON.parse(text) as TResponse
  } catch {
    throw new Error('A API retornou um JSON inválido.')
  }
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json()
    if (body?.message) return body.message
  } catch {
    return `Erro ${response.status}: ${response.statusText}`
  }
  return `Erro ${response.status}: ${response.statusText}`
}
