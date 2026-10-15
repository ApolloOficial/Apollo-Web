import { useEffect, useState } from 'react'

interface ApiResourceState<T> {
  data: T | null
  loading: boolean
  error: string
}

export function useApiResource<T>(
  fetcher: (() => Promise<T>) | null,
  errorMessage: string,
): ApiResourceState<T> {
  const [state, setState] = useState<ApiResourceState<T>>({
    data: null,
    loading: true,
    error: '',
  })

  useEffect(() => {
    if (!fetcher) return

    let active = true

    void (async () => {
      await Promise.resolve()
      if (!active) return

      setState((current) => ({ ...current, loading: true, error: '' }))

      try {
        const data = await fetcher()

        if (active) setState({ data, loading: false, error: '' })
      } catch (cause) {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: cause instanceof Error ? cause.message : errorMessage,
          })
        }
      }
    })()

    return () => {
      active = false
    }
  }, [fetcher, errorMessage])

  return state
}
