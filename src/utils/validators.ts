const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

export const PASSWORD_RULES_MESSAGE =
  'A senha deve ter de 8 a 72 caracteres, com letra maiúscula, minúscula, número e caractere especial.'

export function isValidPassword(value: string) {
  return PASSWORD_PATTERN.test(value)
}

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/

export function isValidIpv4(value: string) {
  return IPV4_PATTERN.test(value.trim())
}

export function isValidPort(value: string) {
  const port = value.trim()

  if (!/^\d{1,5}$/.test(port)) return false

  return Number(port) >= 1 && Number(port) <= 65535
}
