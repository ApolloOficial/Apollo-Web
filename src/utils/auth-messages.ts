import { PASSWORD_RULES_MESSAGE } from './validators'

const MESSAGE_TRANSLATIONS: Array<[RegExp, string]> = [
  [/Password must have/i, PASSWORD_RULES_MESSAGE],
  [/Current password is incorrect/i, 'A senha atual está incorreta.'],
  [
    /must be different from the current password/i,
    'A nova senha deve ser diferente da senha atual.',
  ],
  [/Current password is required/i, 'Informe a senha atual.'],
  [/New password is required/i, 'Informe a nova senha.'],
]

export function translateAuthMessage(message: string): string {
  const translation = MESSAGE_TRANSLATIONS.find(([pattern]) =>
    pattern.test(message),
  )

  return translation ? translation[1] : message
}
