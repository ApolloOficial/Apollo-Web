import { Link } from 'react-router-dom'
import type { ButtonLinkProps, ButtonProps, ButtonVariant } from '../../types/ui.types'
import './Button.css'

function buildClassName(variant: ButtonVariant, fullWidth: boolean) {
  const classes = ['button', `button--${variant}`]
  if (fullWidth) classes.push('button--full')
  return classes.join(' ')
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buildClassName(variant, fullWidth)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  to,
  variant = 'primary',
  fullWidth = false,
}: ButtonLinkProps) {
  return (
    <Link to={to} className={buildClassName(variant, fullWidth)}>
      {children}
    </Link>
  )
}
