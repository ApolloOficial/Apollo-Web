import { useId, useMemo, useState } from 'react'
import './Combobox.css'

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  label?: string
  placeholder: string
  value: string
  options: ComboboxOption[]
  required?: boolean
  onChange: (value: string) => void
}

export function Combobox({
  label,
  placeholder,
  value,
  options,
  required,
  onChange,
}: ComboboxProps) {
  const id = useId()
  const [open, setOpen] = useState(false)

  const visibleOptions = useMemo(() => {
    const search = value.trim().toLocaleLowerCase('pt-BR')
    if (!search) return options
    return options.filter((option) =>
      option.label.toLocaleLowerCase('pt-BR').includes(search),
    )
  }, [options, value])

  return (
    <div className="combobox">
      {label && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        required={required}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
        }}
      />

      {open && visibleOptions.length > 0 && (
        <ul id={`${id}-options`} className="combobox__options" role="listbox">
          {visibleOptions.map((option) => (
            <li key={option.value} role="option" aria-selected={option.label === value}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.label)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}