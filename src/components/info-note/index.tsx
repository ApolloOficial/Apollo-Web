import { AlertIcon } from '../icons/alert-icon'
import type { InfoNoteProps } from '../../types/ui.types'
import './InfoNote.css'

export function InfoNote({ title, children }: InfoNoteProps) {
  return (
    <aside className="info-note" role="note">
      <AlertIcon className="info-note__icon" />
      <div>
        <p className="info-note__title">{title}</p>
        <p className="info-note__text">{children}</p>
      </div>
    </aside>
  )
}
