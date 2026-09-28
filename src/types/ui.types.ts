import type { ReactNode } from 'react'

export interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
}

export interface ButtonLinkProps {
  children: ReactNode
  to: string
  fullWidth?: boolean
}
