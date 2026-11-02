import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '../services/http'

interface ApiResourceState<T> {
  data: T | null
  loading: boolean
  error: string
}

export interface ApiResource<T> extends ApiResourceState<T> {
  reload: () => void
}

export function useApiResource<T>(
  fetcher: ((signal: AbortSignal) => Promise<T>) | null,
  errorMessage: string,
): ApiResource<T> {
  const [state, setState] = useState<ApiResourceState<T>>({
    data: null,
    loading: true,
    error: '',
  })
  const [attempt, setAttempt] = useState(0)

  const reload = useCallback(() => setAttempt((current) => current + 1), [])

  useEffect(() => {
    if (!fetcher) return

    const controller = new AbortController()

    void (async () => {
      await Promise.resolve()
      if (controller.signal.aborted) return

      setState((current) => ({ ...current, loading: true, error: '' }))

      try {
        const data = await fetcher(controller.signal)

        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: '' })
        }
      } catch (cause) {
        if (isAbortError(cause) || controller.signal.aborted) return

        setState({
          data: null,
          loading: false,
          error: cause instanceof Error ? cause.message : errorMessage,
        })
      }
    })()

    return () => {
      controller.abort()
    }
  }, [fetcher, errorMessage, attempt])

  return { ...state, reload }
}
