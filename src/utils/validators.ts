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
