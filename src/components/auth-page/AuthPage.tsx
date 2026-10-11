import { useEffect, useRef } from 'react'
import type { AuthPageProps } from '../../types/ui.types'
import './AuthPage.css'

export function AuthPage({
  title,
  subtitle,
  illustration,
  align = 'start',
  focusTitle = false,
  children,
}: AuthPageProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (focusTitle) titleRef.current?.focus()
  }, [focusTitle])

  const className = align === 'center' ? 'auth-page auth-page--center' : 'auth-page'

  return (
    <div className={className}>
      <div className="auth-page__body">
        {illustration}
        <h1 ref={titleRef} className="auth-page__title" tabIndex={-1}>
          {title}
        </h1>
        {subtitle && <p className="auth-page__subtitle">{subtitle}</p>}
        {children}
      </div>
      <p className="auth-page__notice">
        Apenas usuários autorizados tem acesso ao sistema.
        <br />
        Em caso de dúvidas, contate oficial.apollo@outlook.com
      </p>
    </div>
  )
}
