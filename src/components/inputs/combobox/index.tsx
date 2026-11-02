import { useId, useMemo, useState, type KeyboardEvent } from 'react'
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
  const listboxId = `${id}-options`
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const visibleOptions = useMemo(() => {
    const search = value.trim().toLocaleLowerCase('pt-BR')
    if (!search) return options
    return options.filter((option) =>
      option.label.toLocaleLowerCase('pt-BR').includes(search),
    )
  }, [options, value])

  const expanded = open && visibleOptions.length > 0
  const activeOption = expanded ? visibleOptions[activeIndex] : undefined
  const optionId = (index: number) => `${id}-option-${index}`

  function openList(index: number) {
    setOpen(true)
    setActiveIndex(index)
  }

  function close() {
    setOpen(false)
    setActiveIndex(-1)
  }

  function select(option: ComboboxOption) {
    onChange(option.label)
    close()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const last = visibleOptions.length - 1

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!expanded) openList(0)
        else setActiveIndex((current) => (current >= last ? 0 : current + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!expanded) openList(last)
        else setActiveIndex((current) => (current <= 0 ? last : current - 1))
        break
      case 'Home':
        if (expanded) {
          event.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (expanded) {
          event.preventDefault()
          setActiveIndex(last)
        }
        break
      case 'Enter':
        if (activeOption) {
          event.preventDefault()
          select(activeOption)
        }
        break
      case 'Escape':
        if (expanded) {
          event.preventDefault()
          close()
        }
        break
      case 'Tab':
        close()
        break
    }
  }

  return (
    <div className="combobox">
      {label && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        value={value}
        placeholder={placeholder}
        aria-label={label ? undefined : placeholder}
        autoComplete="off"
        required={required}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listboxId}
        aria-activedescendant={activeOption ? optionId(activeIndex) : undefined}
        onFocus={() => setOpen(true)}
        onBlur={close}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          onChange(event.target.value)
          openList(-1)
        }}
      />

      {expanded && (
        <ul
          id={listboxId}
          className="combobox__options"
          role="listbox"
          aria-label={label ?? placeholder}
        >
          {visibleOptions.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={option.label === value}
              className={
                index === activeIndex
                  ? 'combobox__option combobox__option--active'
                  : 'combobox__option'
              }
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(option)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') select(option)
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
