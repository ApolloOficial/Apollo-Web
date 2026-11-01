import type { IconProps } from '../../../types/ui.types'

export function EyeOffIcon({ className }: IconProps) {
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
      <path d="M3.5 9c2.5 6 14.5 6 17 0" />
      <path d="M6.3 13.2 4.9 14.7" />
      <path d="M9.2 14.9 8.5 16.7" />
      <path d="M12 15.4v2" />
      <path d="M14.8 14.9l.7 1.8" />
      <path d="M17.7 13.2l1.4 1.5" />
    </svg>
  )
}
