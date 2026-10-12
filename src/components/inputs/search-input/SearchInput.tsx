import type { SearchInputProps } from '../../../types/ui.types'
import { SearchIcon } from '../../icons/search-icon'
import './SearchInput.css'

export function SearchInput({ value, onChange, placeholder = 'Buscar' }: SearchInputProps) {
  return (
    <label className="search-input">
      <SearchIcon className="search-input__icon" />
      <input
        className="search-input__field"
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
