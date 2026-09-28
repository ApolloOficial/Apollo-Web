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

export interface IconProps {
  className?: string
}

export interface SimpleInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  autoComplete?: string
  icon?: ReactNode
  endAdornment?: ReactNode
  error?: string
}

export type PasswordInputProps = Omit<SimpleInputProps, 'type' | 'icon' | 'endAdornment'>

export interface CheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export interface TextLinkProps {
  to: string
  children: ReactNode
}
