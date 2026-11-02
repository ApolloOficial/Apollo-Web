export type DashboardFilters = Record<string, string | null | undefined>

export function buildDashboardUrl(
  baseUrl: string,
  filters: DashboardFilters,
): string {
  if (!baseUrl) return ''

  const url = new URL(baseUrl)

  for (const [param, value] of Object.entries(filters)) {
    const text = value?.trim()

    if (text) url.searchParams.set(param, encodeURIComponent(text))
  }

  return url.toString()
}
