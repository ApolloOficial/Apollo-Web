import type { ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
}

export interface ButtonLinkProps {
  children: ReactNode
  to: string
  variant?: ButtonVariant
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
  invalid?: boolean
}

export type PasswordInputProps = Omit<SimpleInputProps, 'type' | 'endAdornment'>

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

export type StatusTone = 'success' | 'alert'

export interface StatusMessageProps {
  tone: StatusTone
  children: ReactNode
}

export interface AuthPageProps {
  title: ReactNode
  subtitle?: ReactNode
  illustration?: ReactNode
  align?: 'start' | 'center'
  focusTitle?: boolean
  children?: ReactNode
}
