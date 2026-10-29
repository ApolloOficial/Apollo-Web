import { translateAuthMessage } from './auth-messages'

export const VALIDATION_FAILED_CODE = 'VALIDATION_FAILED'

const API_MESSAGE_TRANSLATIONS: Array<[RegExp, string]> = [
  [/^Invalid request$/i, 'Requisição inválida. Confira os dados informados.'],
  [/^Invalid sort field/i, 'Campo de ordenação inválido.'],
  [/^Route not found$/i, 'Recurso não encontrado.'],
  [/^HTTP method not allowed$/i, 'Operação não permitida.'],
  [/^Internal server error$/i, 'Erro interno do servidor. Tente novamente.'],
  [
    /^Operation violates a data integrity constraint$/i,
    'A operação conflita com dados já existentes.',
  ],
  [/^Business rule violated$/i, 'Uma regra de negócio impediu a operação.'],
  [/^Name is required$/i, 'Informe o nome.'],
  [
    /^Name must be at most (\d+) characters$/i,
    'O nome deve ter no máximo $1 caracteres.',
  ],
  [
    /^Email must be at most (\d+) characters$/i,
    'O e-mail deve ter no máximo $1 caracteres.',
  ],
  [/^Invalid email$/i, 'E-mail inválido.'],
  [/^Role is required$/i, 'Informe o cargo.'],
  [/^Role must be valid$/i, 'Cargo inválido.'],
  [/^Unit is required$/i, 'Informe a filial.'],
  [/^Status is required$/i, 'Informe o status.'],
  [/^Temporary password is required$/i, 'Informe a senha temporária.'],
  [
    /^Temporary password must be between (\d+) and (\d+) characters$/i,
    'A senha temporária deve ter de $1 a $2 caracteres.',
  ],
  [/^Inform at least one string$/i, 'Informe ao menos uma string.'],
]

function translateSingleMessage(message: string): string {
  const match = API_MESSAGE_TRANSLATIONS.find(([pattern]) =>
    pattern.test(message),
  )

  return match
    ? message.replace(match[0], match[1])
    : translateAuthMessage(message)
}

export function translateApiMessage(
  message: string,
  code?: string | null,
): string {
  if (code === VALIDATION_FAILED_CODE) {
    return message
      .split(';')
      .map((part) => {
        const separator = part.indexOf(':')
        const detail = separator >= 0 ? part.slice(separator + 1) : part

        return translateSingleMessage(detail.trim())
      })
      .filter(Boolean)
      .join(' ')
  }

  return translateSingleMessage(message)
}
