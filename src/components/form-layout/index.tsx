import type { FormLayoutProps } from '../../types/ui.types'
import { Breadcrumb } from '../breadcrumb'
import './FormLayout.css'

export function FormLayout({
  breadcrumb,
  title,
  description,
  children,
}: FormLayoutProps) {
  return (
    <section className="form-layout">
      <Breadcrumb items={breadcrumb} />

      <header className="form-layout__header">
        <h1 className="form-layout__title">{title}</h1>
        {description && (
          <p className="form-layout__description">{description}</p>
        )}
      </header>

      <div className="form-layout__body">{children}</div>
    </section>
  )
}
