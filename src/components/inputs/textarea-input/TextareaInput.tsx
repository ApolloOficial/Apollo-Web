import type { TextareaInputProps } from '../../../types/ui.types'
import './TextareaInput.css'

export function TextareaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  readOnly,
  maxLength,
}: TextareaInputProps) {
  return (
    <div className="textarea-input">
      <label className="textarea-input__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="textarea-input__control"
        data-readonly={readOnly ? 'true' : undefined}
        value={value}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        maxLength={maxLength}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </div>
  )
}
