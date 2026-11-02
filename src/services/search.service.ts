import { request, toApiError } from './http'
import type { SearchSuggestionsDto } from '../types/search.types'

export async function getSearchSuggestions(
  term: string,
): Promise<SearchSuggestionsDto> {
  try {
    const query = new URLSearchParams({ q: term })

    return await request<SearchSuggestionsDto>(`/search/suggestions?${query}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}
