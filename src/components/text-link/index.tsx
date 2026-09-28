import { Link } from 'react-router-dom'
import type { TextLinkProps } from '../../types/ui.types'
import './index.css'

export function TextLink({ to, children }: TextLinkProps) {
  return (
    <Link className="text-link" to={to}>
      {children}
    </Link>
  )
}
