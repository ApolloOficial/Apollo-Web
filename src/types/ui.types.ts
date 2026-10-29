import type { ReactNode } from 'react'
import type { CurrentUserDto } from './auth.types'
import type { NavigationItem } from './navigation.types'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
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
  required?: boolean
  disabled?: boolean
  maxLength?: number
  minLength?: number
  readOnly?: boolean
  inputMode?: 'text' | 'numeric' | 'decimal'
}

export interface TextareaInputProps {
  id: string
  label: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  readOnly?: boolean
  maxLength?: number
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

export interface SidebarProps {
  items: NavigationItem[]
  role?: string
}

export interface HeaderProps {
  user: CurrentUserDto | null
  loading?: boolean
  onLogout: () => void
}

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export interface LayoutContext {
  user: CurrentUserDto | null
  loading: boolean
}

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export interface FormLayoutProps {
  breadcrumb: BreadcrumbItem[]
  title: string
  description?: ReactNode
  children: ReactNode
}

export interface FormActionsProps {
  children: ReactNode
}

export interface InfoNoteProps {
  title: string
  children: ReactNode
}

export type StepStatus = 'pending' | 'active' | 'done'

export interface StepperProps {
  children: ReactNode
}

export interface StepProps {
  number: number
  title: string
  status: StepStatus
  onEdit?: () => void
  children?: ReactNode
}

export interface RadioCardOption {
  value: string
  title: string
  description: string
}

export interface RadioCardGroupProps {
  name: string
  label: string
  value: string
  options: RadioCardOption[]
  disabled?: boolean
  onChange: (value: string) => void
}
