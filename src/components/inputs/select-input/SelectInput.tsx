import { Icon } from '@iconify/react'
import { useEffect, useId, useRef, useState } from 'react'
import './SelectInput.css'

export interface SelectOption {
  value: string
  label: string
}

interface SelectInputProps {
  label?: string
  placeholder: string
  value: string
  options: SelectOption[]
  disabled?: boolean
  onChange: (value: string) => void
}

export function SelectInput({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onChange,
}: SelectInputProps) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen((current) => !current)
    }
  }

  return (
    <div ref={containerRef} className="select-input">
      {label && (
        <label id={`${id}-label`} className="select-input__label">
          {label}
        </label>
      )}

      <button
        id={id}
        className="select-input__trigger"
        type="button"
        role="combobox"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-controls={`${id}-options`}
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span
          className={
            selectedOption
              ? 'select-input__value'
              : 'select-input__placeholder'
          }
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <Icon
          className={`select-input__icon ${
            open ? 'select-input__icon--open' : ''
          }`}
          icon="lucide:chevron-up"
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          id={`${id}-options`}
          className="select-input__options"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
            >
              <button
                className="select-input__option"
                type="button"
                onClick={() => {
                  onChange(option.value)
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