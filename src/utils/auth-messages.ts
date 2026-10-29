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
  [/Invalid code/i, 'Código inválido. Confira e tente novamente.'],
  [/Code is required/i, 'Informe o código recebido por e-mail.'],
  [/Code expired/i, 'O código expirou. Solicite um novo código.'],
  [
    /Too many attempts/i,
    'Muitas tentativas incorretas. Solicite um novo código.',
  ],
  [
    /Too many (recovery requests|codes requested)/i,
    'Muitas solicitações. Aguarde alguns minutos e tente novamente.',
  ],
  [
    /Wait before requesting a new code/i,
    'Aguarde um instante antes de pedir um novo código.',
  ],
  [
    /Could not send the code/i,
    'Não foi possível enviar o código. Tente novamente em instantes.',
  ],
  [
    /Challenge not found/i,
    'A solicitação expirou. Informe seu e-mail novamente.',
  ],
  [
    /Reset not allowed/i,
    'Não foi possível redefinir a senha. Solicite um novo código.',
  ],
  [/Email is required/i, 'Informe o e-mail.'],
]

export function translateAuthMessage(message: string): string {
  const translation = MESSAGE_TRANSLATIONS.find(([pattern]) =>
    pattern.test(message),
  )

  return translation ? translation[1] : message
}
