import { useEffect, useState } from 'react'
import { getSearchSuggestions } from '../services/search.service'
import type { SearchSuggestionsDto } from '../types/search.types'

const MIN_CHARACTERS = 2
const DEBOUNCE_MS = 300

interface SuggestionsState {
  term: string
  data: SearchSuggestionsDto | null
  error: string
}

export function useSearchSuggestions(query: string) {
  const term = query.trim()
  const enabled = term.length >= MIN_CHARACTERS
  const [state, setState] = useState<SuggestionsState>({
    term: '',
    data: null,
    error: '',
  })

  useEffect(() => {
    if (!enabled) return

    let active = true

    const timer = setTimeout(async () => {
      try {
        const data = await getSearchSuggestions(term)

        if (active) setState({ term, data, error: '' })
      } catch (cause) {
        if (active) {
          setState({
            term,
            data: null,
            error:
              cause instanceof Error
                ? cause.message
                : 'Não foi possível realizar a busca.',
          })
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [term, enabled])

  const settled = enabled && state.term === term

  return {
    enabled,
    loading: enabled && !settled,
    data: settled ? state.data : null,
    error: settled ? state.error : '',
  }
}
