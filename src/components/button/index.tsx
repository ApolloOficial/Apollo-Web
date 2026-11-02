import { Link } from 'react-router-dom'
import type {
  ButtonLinkProps,
  ButtonProps,
  ButtonVariant,
} from '../../types/ui.types'
import { Spinner } from '../spinner'
import './Button.css'

function buildClassName(
  variant: ButtonVariant,
  fullWidth: boolean,
  loading = false,
) {
  const classes = ['button', `button--${variant}`]
  if (fullWidth) classes.push('button--full')
  if (loading) classes.push('button--loading')
  return classes.join(' ')
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buildClassName(variant, fullWidth, loading)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {loading && <Spinner />}
      <span className="button__label">{children}</span>
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
