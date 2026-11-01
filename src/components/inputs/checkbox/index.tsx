import type { CheckboxProps } from '../../../types/ui.types'
import { CheckIcon } from '../../icons/check-icon'
import './Checkbox.css'

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        id={id}
        className="checkbox__input"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="checkbox__box" aria-hidden="true">
        {checked && <CheckIcon />}
      </span>
      <span className="checkbox__label">{label}</span>
    </label>
  )
}
