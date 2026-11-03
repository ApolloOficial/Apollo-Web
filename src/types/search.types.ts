export interface SearchResultDto {
  id: string
  title: string
  subtitle: string
  context?: string | null
}

export interface SearchSuggestionsDto {
  employees?: SearchResultDto[]
  companyUnits?: SearchResultDto[]
  inverters?: SearchResultDto[]
  panels?: SearchResultDto[]
  relocations?: SearchResultDto[]
  strings?: SearchResultDto[]
  alerts?: SearchResultDto[]
  serviceOrders?: SearchResultDto[]
}

export type SearchCategory = keyof SearchSuggestionsDto
