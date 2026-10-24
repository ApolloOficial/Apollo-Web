import { request } from './http'
import type { SearchSuggestionsDto } from '../types/search.types'

export function getSearchSuggestions(term: string) {
  const query = new URLSearchParams({ q: term })

  return request<SearchSuggestionsDto>(`/search/suggestions?${query}`)
}
