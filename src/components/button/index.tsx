import { Link } from 'react-router-dom'
import type { ButtonLinkProps, ButtonProps } from '../../types/ui.types'
import './index.css'

function buildClassName(fullWidth: boolean) {
  return fullWidth ? 'button button--full' : 'button'
}

export function Button({
  children,
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buildClassName(fullWidth)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function ButtonLink({ children, to, fullWidth = false }: ButtonLinkProps) {
  return (
    <Link to={to} className={buildClassName(fullWidth)}>
      {children}
    </Link>
  )
}
