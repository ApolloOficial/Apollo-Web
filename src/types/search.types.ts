export interface SearchResultDto {
  id: string
  title: string
  subtitle: string
}

export interface SearchSuggestionsDto {
  employees?: SearchResultDto[]
  companyUnits?: SearchResultDto[]
  inverters?: SearchResultDto[]
  panels?: SearchResultDto[]
  relocations?: SearchResultDto[]
}

export type SearchCategory = keyof SearchSuggestionsDto
