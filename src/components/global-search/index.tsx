import { useEffect, useRef, useState } from 'react'
import { useCurrentUserContext } from '../../hooks/useCurrentUserContext'
import { useGlobalSearchNavigation } from '../../hooks/useGlobalSearchNavigation'
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions'
import type { SearchCategory, SearchResultDto } from '../../types/search.types'
import { isManager } from '../../utils/user'
import { SearchInput } from '../inputs/search-input'
import { Spinner } from '../spinner'
import './GlobalSearch.css'

interface GlobalSearchProps {
  placeholder?: string
}

interface SearchGroup {
  key: SearchCategory
  label: string
}

const SUBTITLE_LABELS: Record<string, string> = {
  Employee: 'Funcionário',
  'Company Unit': 'Filial',
  Inverter: 'Inversor',
  Panel: 'Placa',
  'Internal Relocation': 'Realocação interna',
  'External Relocation': 'Realocação externa',
}

function getSubtitleLabel(subtitle: string) {
  return SUBTITLE_LABELS[subtitle] ?? subtitle
}

const SEARCH_GROUPS: SearchGroup[] = [
  { key: 'employees', label: 'Funcionários' },
  { key: 'companyUnits', label: 'Filiais' },
  { key: 'inverters', label: 'Inversores' },
  { key: 'panels', label: 'Placas' },
  { key: 'relocations', label: 'Realocações' },
]

export function GlobalSearch({
  placeholder = 'Busque por projetos, equipes e muito mais.',
}: GlobalSearchProps) {
  const { user } = useCurrentUserContext()
  const {
    navigateToResult,
    isResolving,
    error: selectionError,
    clearError,
  } = useGlobalSearchNavigation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { enabled, loading, data, error } = useSearchSuggestions(query)

  useEffect(() => {
    if (!open) return

    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const sections = SEARCH_GROUPS.filter(
    (group) => group.key !== 'employees' || isManager(user?.role),
  )
    .map((group) => ({
      ...group,
      items: data?.[group.key] ?? [],
    }))
    .filter((section) => section.items.length > 0)

  const showPanel = open && enabled
  const empty = !loading && !error && sections.length === 0

  function handleChange(value: string) {
    setQuery(value)
    clearError()
    setOpen(true)
  }

  async function handleSelect(category: SearchCategory, item: SearchResultDto) {
    const navigated = await navigateToResult(category, item)

    if (navigated) {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div
      ref={containerRef}
      className="global-search"
      onFocus={() => setOpen(true)}
    >
      <SearchInput
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {showPanel && (
        <div
          className="global-search__panel"
          aria-busy={loading || isResolving}
        >
          {(loading || isResolving) && (
            <p className="global-search__status" role="status">
              <Spinner />
              <span className="sr-only">
                {isResolving ? 'Abrindo resultado' : 'Carregando resultados'}
              </span>
            </p>
          )}

          {error && (
            <p
              className="global-search__status global-search__status--error"
              role="alert"
            >
              {error}
            </p>
          )}

          {selectionError && (
            <p
              className="global-search__status global-search__status--error"
              role="alert"
            >
              {selectionError}
            </p>
          )}

          {empty && (
            <p className="global-search__status" aria-live="polite">
              Nenhum resultado encontrado.
            </p>
          )}

          {!loading &&
            sections.map((section) => (
              <section key={section.key} className="global-search__group">
                <h2 className="global-search__group-title">{section.label}</h2>
                <ul className="global-search__list">
                  {section.items.map((item) => (
                    <li key={`${section.key}-${item.id}`}>
                      <button
                        className="global-search__item"
                        type="button"
                        disabled={isResolving}
                        onClick={() => void handleSelect(section.key, item)}
                      >
                        <span className="global-search__item-title">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="global-search__item-subtitle">
                            {getSubtitleLabel(item.subtitle)}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      )}
    </div>
  )
}
