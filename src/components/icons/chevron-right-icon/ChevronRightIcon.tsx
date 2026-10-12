import type { IconProps } from '../../../types/ui.types'

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 7L14 12L9 16.5" stroke="currentColor" strokeLinecap="round"/>
    </svg>
  )
}
