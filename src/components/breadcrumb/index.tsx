import { Link } from 'react-router-dom'
import type { BreadcrumbProps } from '../../types/ui.types'
import { ChevronRightIcon } from '../icons/chevron-right-icon'
import './Breadcrumb.css'

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Navegação estrutural">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li className="breadcrumb__item" key={`${item.label}-${index}`}>
              {item.to && !isLast ? (
                <Link className="breadcrumb__link" to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className="breadcrumb__current"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRightIcon className="breadcrumb__separator" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
