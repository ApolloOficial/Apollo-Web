import type { ComponentType } from 'react'
import type { IconProps } from './ui.types'

export interface NavigationItem {
  label: string
  to: string
  icon: ComponentType<IconProps>
  roles?: string[]
}
