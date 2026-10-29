import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

export function useTabIndicator(activeKey: string) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined)
  const [animated, setAnimated] = useState(false)

  useLayoutEffect(() => {
    const list = ref.current
    if (!list) return

    function measure() {
      const active = list?.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]',
      )
      if (!active) {
        setStyle(undefined)
        return
      }
      setStyle({
        transform: `translateX(${active.offsetLeft}px)`,
        width: active.offsetWidth,
        opacity: 1,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [activeKey])

  useLayoutEffect(() => {
    if (!style || animated) return
    const frame = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(frame)
  }, [style, animated])

  return {
    ref,
    indicatorProps: {
      'aria-hidden': true as const,
      className: animated
        ? 'tabs-indicator tabs-indicator--animated'
        : 'tabs-indicator',
      style,
    },
  }
}
