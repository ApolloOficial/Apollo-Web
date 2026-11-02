import type { SimpleInputProps } from '../../../types/ui.types'
import './SimpleInput.css'

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
  invalid,
  required,
  disabled,
  maxLength,
  minLength,
  readOnly,
  inputMode,
}: SimpleInputProps) {
  const errorId = `${id}-error`
  const isInvalid = Boolean(error || invalid)

  return (
    <div className="simple-input">
      <label className="simple-input__label" htmlFor={id}>
        {label}
      </label>
      <div
        className="simple-input__field"
        data-invalid={isInvalid ? 'true' : undefined}
        data-readonly={readOnly ? 'true' : undefined}
      >
        {icon && <span className="simple-input__icon">{icon}</span>}
        <input
          id={id}
          className="simple-input__control"
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          readOnly={readOnly}
          inputMode={inputMode}
          aria-invalid={isInvalid ? true : undefined}
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
