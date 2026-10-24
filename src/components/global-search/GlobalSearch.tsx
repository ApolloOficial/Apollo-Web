import { useEffect, useRef, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions'
import { paths } from '../../routes/paths'
import type { SearchCategory } from '../../types/search.types'
import { SearchInput } from '../inputs/search-input'
import './GlobalSearch.css'

interface GlobalSearchProps {
  placeholder?: string
}

interface SearchGroup {
  key: SearchCategory
  label: string
  getPath: (id: string) => string
}

const SEARCH_GROUPS: SearchGroup[] = [
  { key: 'employees', label: 'Funcionários', getPath: () => paths.employees },
  { key: 'companyUnits', label: 'Filiais', getPath: () => paths.branches },
  {
    key: 'inverters',
    label: 'Inversores',
    getPath: (id) => generatePath(paths.branchInverterDetails, { id }),
  },
  { key: 'panels', label: 'Placas', getPath: () => paths.branches },
  {
    key: 'relocations',
    label: 'Realocações',
    getPath: () => paths.relocations,
  },
]

export function GlobalSearch({
  placeholder = 'Busque por projetos, equipes e muito mais.',
}: GlobalSearchProps) {
  const navigate = useNavigate()
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

  const sections = SEARCH_GROUPS.map((group) => ({
    ...group,
    items: data?.[group.key] ?? [],
  })).filter((section) => section.items.length > 0)

  const showPanel = open && enabled
  const empty = !loading && !error && sections.length === 0

  function handleChange(value: string) {
    setQuery(value)
    setOpen(true)
  }

  function handleSelect(path: string) {
    setOpen(false)
    setQuery('')
    navigate(path)
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
        <div className="global-search__panel" aria-busy={loading}>
          {loading && <p className="global-search__status">Buscando...</p>}

          {error && (
            <p className="global-search__status global-search__status--error">
              {error}
            </p>
          )}

          {empty && (
            <p className="global-search__status">
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
                        onClick={() => handleSelect(section.getPath(item.id))}
                      >
                        <span className="global-search__item-title">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="global-search__item-subtitle">
                            {item.subtitle}
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
