import type { IconProps } from '../../../types/ui.types'

export function ServiceOrderIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 10.9375L9.625 13.5625L14 8.3125" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 19.25C15.3325 19.25 19.25 15.3325 19.25 10.5C19.25 5.66751 15.3325 1.75 10.5 1.75C5.66751 1.75 1.75 5.66751 1.75 10.5C1.75 15.3325 5.66751 19.25 10.5 19.25Z" stroke="currentColor" strokeWidth="1.75"/>
    </svg>
  )
}
