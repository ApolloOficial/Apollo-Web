import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { paths } from '../../routes/paths'
import type { SidebarProps } from '../../types/ui.types'
import { normalizeRole } from '../../utils/user'
import './Sidebar.css'

interface IndicatorPosition {
  top: number
  left: number
  width: number
  height: number
}

export function Sidebar({ items, role }: SidebarProps) {
  const { pathname } = useLocation()
  const listRef = useRef<HTMLUListElement>(null)
  const [indicator, setIndicator] = useState<IndicatorPosition | null>(null)
  const [animated, setAnimated] = useState(false)
  const currentRole = role === undefined ? undefined : normalizeRole(role)
  const visibleItems = items.filter(
    (item) =>
      !item.roles ||
      (currentRole !== undefined && item.roles.includes(currentRole)),
  )

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    function measure() {
      const active = list?.querySelector<HTMLElement>('.sidebar__link--active')
      if (!list || !active) {
        setIndicator(null)
        return
      }
      const listRect = list.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      setIndicator({
        top: activeRect.top - listRect.top,
        left: activeRect.left - listRect.left,
        width: activeRect.width,
        height: activeRect.height,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [pathname, role])

  useLayoutEffect(() => {
    if (!indicator || animated) return
    const frame = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(frame)
  }, [indicator, animated])

  return (
    <aside className="sidebar">
      <img
        className="sidebar__logo"
        src="/apollo-logo.svg"
        alt="Apollo"
        width={41}
        height={70}
      />

      <nav className="sidebar__nav" aria-label="Menu principal">
        <ul className="sidebar__list" ref={listRef}>
          <li
            aria-hidden="true"
            className={
              animated
                ? 'sidebar__indicator sidebar__indicator--animated'
                : 'sidebar__indicator'
            }
            style={
              indicator
                ? ({
                    '--indicator-top': `${indicator.top}px`,
                    '--indicator-left': `${indicator.left}px`,
                    '--indicator-width': `${indicator.width}px`,
                    '--indicator-height': `${indicator.height}px`,
                    opacity: 1,
                  } as CSSProperties)
                : undefined
            }
          />
          {visibleItems.map(({ to, label, icon: ItemIcon, children }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === paths.home}
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar__link sidebar__link--active'
                    : 'sidebar__link'
                }
              >
                <ItemIcon className="sidebar__icon" />
                <span>{label}</span>
              </NavLink>

              {children && pathname.startsWith(to) && (
                <ul className="sidebar__sublist">
                  {children.map((child) => (
                    <li key={child.to}>
                      <NavLink
                        to={child.to}
                        className={({ isActive }) =>
                          isActive
                            ? 'sidebar__sublink sidebar__sublink--active'
                            : 'sidebar__sublink'
                        }
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
