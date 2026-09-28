import type { IconProps } from '../../../types/ui.types'

export function MailIcon({ className }: IconProps) {
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
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3.5 6.5 12 12.5 20.5 6.5" />
    </svg>
  )
}
