import type { ComponentType } from 'react'
import type { IconProps } from './ui.types'

export interface NavigationChild {
  label: string
  to: string
}

export interface NavigationItem {
  label: string
  to: string
  icon: ComponentType<IconProps>
  roles?: string[]
  children?: NavigationChild[]
}
