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
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedOption = value
    ? options.find((option) => option.value === value)
    : undefined

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

  const selectedIndex = options.findIndex((option) => option.value === value)
  const activeOption = open ? options[activeIndex] : undefined
  const optionId = (index: number) => `${id}-option-${index}`

  function openList(index: number) {
    setOpen(true)
    setActiveIndex(index)
  }

  function close() {
    setOpen(false)
    setActiveIndex(-1)
  }

  function select(option: SelectOption) {
    onChange(option.value)
    close()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) openList(selectedIndex >= 0 ? selectedIndex : 0)
        else setActiveIndex((current) => (current >= last ? 0 : current + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) openList(selectedIndex >= 0 ? selectedIndex : last)
        else setActiveIndex((current) => (current <= 0 ? last : current - 1))
        break
      case 'Home':
        if (open) {
          event.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (open) {
          event.preventDefault()
          setActiveIndex(last)
        }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeOption) select(activeOption)
        else openList(selectedIndex >= 0 ? selectedIndex : 0)
        break
      case 'Escape':
        if (open) {
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
    <div ref={containerRef} className="select-input">
      <span
        id={`${id}-label`}
        className={label ? 'select-input__label' : 'sr-only'}
      >
        {label ?? placeholder}
      </span>

      <button
        id={id}
        className="select-input__trigger"
        type="button"
        role="combobox"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-controls={`${id}-options`}
        aria-activedescendant={activeOption ? optionId(activeIndex) : undefined}
        aria-expanded={open}
        disabled={disabled}
        onClick={() =>
          open ? close() : openList(selectedIndex >= 0 ? selectedIndex : 0)
        }
        onKeyDown={handleKeyDown}
      >
        <span
          id={`${id}-value`}
          className={
            selectedOption ? 'select-input__value' : 'select-input__placeholder'
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
          aria-labelledby={`${id}-label`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={option.value === value}
              className={
                index === activeIndex
                  ? 'select-input__option select-input__option--active'
                  : 'select-input__option'
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
