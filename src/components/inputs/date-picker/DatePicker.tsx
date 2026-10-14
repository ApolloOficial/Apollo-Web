import { Icon } from '@iconify/react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './DatePicker.css'

interface Props {
  label: string
  value: string
  min?: string
  required?: boolean
  onChange: (value: string) => void
}

const months = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

const weekdays = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.']

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatValue(value: string) {
  if (!value) return ''

  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function DatePicker({ label, value, min, required, onChange }: Props) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedDate = value ? new Date(`${value}T12:00:00`) : new Date()

  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const days = useMemo(() => {
    const firstDay = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    )

    const firstVisibleDay = new Date(firstDay)
    firstVisibleDay.setDate(firstDay.getDate() - firstDay.getDay())

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstVisibleDay)
      date.setDate(firstVisibleDay.getDate() + index)
      return date
    })
  }, [visibleMonth])

  function changeMonth(amount: number) {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    )
  }

  return (
    <div ref={containerRef} className="date-picker">
      <label id={`${id}-label`} className="date-picker__label">
        {label}
      </label>

      <button
        id={id}
        className="date-picker__trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon icon="boxicons:calendar-event" aria-hidden="true" />
        <span className={value ? '' : 'date-picker__placeholder'}>
          {formatValue(value) || 'dd/mm/aaaa'}
        </span>
      </button>

      <input type="hidden" value={value} required={required} readOnly />

      {open && (
        <section
          className="date-picker__popover"
          role="dialog"
          aria-label={`Calendário de ${label}`}
        >
          <header className="date-picker__header">
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={() => changeMonth(-1)}
            >
              <Icon icon="lucide:circle-chevron-left" />
            </button>

            <strong>
              {months[visibleMonth.getMonth()]} de {visibleMonth.getFullYear()}
            </strong>

            <button
              className="date-picker__next"
              type="button"
              aria-label="Próximo mês"
              onClick={() => changeMonth(1)}
            >
              <Icon icon="lucide:circle-chevron-right" />
            </button>
          </header>

          <div className="date-picker__weekdays" aria-hidden="true">
            {weekdays.map((weekday) => (
              <strong key={weekday}>{weekday}</strong>
            ))}
          </div>

          <div className="date-picker__days">
            {days.map((date) => {
              const isoDate = toIsoDate(date)
              const outside = date.getMonth() !== visibleMonth.getMonth()
              const selected = isoDate === value
              const disabled = Boolean(min && isoDate < min)

              return (
                <button
                  type="button"
                  key={isoDate}
                  className={[
                    outside ? 'date-picker__day--outside' : '',
                    selected ? 'date-picker__day--selected' : '',
                  ].join(' ')}
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => {
                    onChange(isoDate)
                    setOpen(false)
                  }}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
