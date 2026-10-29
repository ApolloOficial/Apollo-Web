import type { RadioCardGroupProps } from '../../../types/ui.types'
import './RadioCardGroup.css'

export function RadioCardGroup({
  name,
  label,
  value,
  options,
  disabled = false,
  onChange,
}: RadioCardGroupProps) {
  return (
    <div className="radio-card-group" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <label
          key={option.value}
          className={
            value === option.value
              ? 'radio-card radio-card--selected'
              : 'radio-card'
          }
        >
          <input
            className="radio-card__input"
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled}
            onChange={() => onChange(option.value)}
          />
          <strong className="radio-card__title">{option.title}</strong>
          <span className="radio-card__description">{option.description}</span>
        </label>
      ))}
    </div>
  )
}
