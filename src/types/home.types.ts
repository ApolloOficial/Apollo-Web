import type { ComponentType } from 'react'
import type { IconProps } from './ui.types'

export interface HomeCardItem {
  title: string
  description: string
  to: string
  icon: ComponentType<IconProps>
}
