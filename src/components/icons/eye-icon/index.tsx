import type { IconProps } from '../../../types/ui.types'

export function EyeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 12C4.6 8 8 6 12 6s7.4 2 9.5 6c-2.1 4-5.5 6-9.5 6S4.6 16 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}
