import './Tag.css'

export type TagTone =
  'success' | 'info' | 'caution' | 'alert' | 'error' | 'muted' | 'outline'

export type TagSize = 'sm' | 'md'

interface TagProps {
  label: string
  tone: TagTone
  size?: TagSize
}

export function Tag({ label, tone, size = 'md' }: TagProps) {
  return <span className={`tag tag--${tone} tag--${size}`}>{label}</span>
}
