import { useEffect, useRef, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useCurrentUserContext } from '../../hooks/useCurrentUserContext'
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions'
import { paths } from '../../routes/paths'
import { getPanelById } from '../../services/panels.service'
import type { CurrentUserDto } from '../../types/auth.types'
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
  resolvePath: (
    item: SearchResultDto,
    user: CurrentUserDto | null,
  ) => string | Promise<string>
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

function withNameFilter(path: string, name: string) {
  return `${path}?${new URLSearchParams({ name })}`
}

const SEARCH_GROUPS: SearchGroup[] = [
  {
    key: 'employees',
    label: 'Funcionários',
    resolvePath: (item) => withNameFilter(paths.employees, item.title),
  },
  {
    key: 'companyUnits',
    label: 'Filiais',
    resolvePath: (item, user) =>
      item.id === user?.companyUnitId
        ? `${paths.branches}?tab=mine`
        : withNameFilter(paths.branches, item.title),
  },
  {
    key: 'inverters',
    label: 'Inversores',
    resolvePath: (item) =>
      generatePath(paths.branchInverterDetails, { id: item.id }),
  },
  {
    key: 'panels',
    label: 'Placas',
    resolvePath: async (item) => {
      const panel = await getPanelById(item.id)

      return generatePath(paths.branchStringDetails, { id: panel.stringId })
    },
  },
  {
    key: 'relocations',
    label: 'Realocações',
    resolvePath: (item, user) =>
      generatePath(
        isManager(user?.role)
          ? paths.relocationManagerDetails
          : paths.relocationDetails,
        {
          type: /^external/i.test(item.subtitle) ? 'external' : 'internal',
          id: item.id,
        },
      ),
  },
]

export function GlobalSearch({
  placeholder = 'Busque por projetos, equipes e muito mais.',
}: GlobalSearchProps) {
  const navigate = useNavigate()
  const { user } = useCurrentUserContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selectionError, setSelectionError] = useState('')
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
    setSelectionError('')
    setOpen(true)
  }

  async function handleSelect(group: SearchGroup, item: SearchResultDto) {
    setSelectionError('')

    try {
      const path = await group.resolvePath(item, user)

      setOpen(false)
      setQuery('')
      navigate(path)
    } catch (cause) {
      setSelectionError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível abrir o resultado.',
      )
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
        <div className="global-search__panel" aria-busy={loading}>
          {loading && (
            <p className="global-search__status">
              <Spinner />
            </p>
          )}

          {error && (
            <p className="global-search__status global-search__status--error">
              {error}
            </p>
          )}

          {selectionError && (
            <p className="global-search__status global-search__status--error">
              {selectionError}
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
                        onClick={() => void handleSelect(section, item)}
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
