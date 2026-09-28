import { useState } from 'react'
import type { PasswordInputProps } from '../../../types/ui.types'
import { EyeIcon } from '../../icons/eye-icon'
import { EyeOffIcon } from '../../icons/eye-off-icon'
import { LockIcon } from '../../icons/lock-icon'
import { SimpleInput } from '../simple-input'
import './index.css'

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <SimpleInput
      {...props}
      type={isVisible ? 'text' : 'password'}
      icon={<LockIcon />}
      endAdornment={
        <button
          type="button"
          className="password-input__toggle"
          aria-label="Mostrar senha"
          aria-pressed={isVisible}
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      }
    />
  )
}
