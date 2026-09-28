import type { SimpleInputProps } from '../../../types/ui.types'
import './index.css'

export function SimpleInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  icon,
  endAdornment,
  error,
}: SimpleInputProps) {
  const errorId = `${id}-error`

  return (
    <div className="simple-input">
      <label className="simple-input__label" htmlFor={id}>
        {label}
      </label>
      <div className="simple-input__field" data-invalid={error ? 'true' : undefined}>
        {icon && <span className="simple-input__icon">{icon}</span>}
        <input
          id={id}
          className="simple-input__control"
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {endAdornment}
      </div>
      {error && (
        <p id={errorId} className="simple-input__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
