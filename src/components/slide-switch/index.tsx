import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import './SlideSwitch.css'

const EXIT_MS = 220
const BAR_MS = 260
const ENTER_MS = 320

type Phase = 'idle' | 'bar' | 'enter'

interface SlideSwitchProps {
  transitionKey: string
  children: ReactNode
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SlideSwitch({ transitionKey, children }: SlideSwitchProps) {
  const [shown, setShown] = useState({ key: transitionKey, node: children })
  const [phase, setPhase] = useState<Phase>('idle')

  if (transitionKey === shown.key && children !== shown.node) {
    setShown({ key: shown.key, node: children })
  }

  const changed = transitionKey !== shown.key

  useEffect(() => {
    const reduced = prefersReducedMotion()
    let timer: number | undefined

    if (changed && phase === 'idle') {
      timer = window.setTimeout(() => setPhase('bar'), reduced ? 0 : EXIT_MS)
    } else if (changed && phase === 'bar') {
      timer = window.setTimeout(
        () => {
          setShown({ key: transitionKey, node: children })
          setPhase('enter')
        },
        reduced ? 0 : BAR_MS,
      )
    } else if (phase === 'enter') {
      timer = window.setTimeout(() => setPhase('idle'), reduced ? 0 : ENTER_MS)
    }

    return () => window.clearTimeout(timer)
  }, [changed, phase, transitionKey, children])

  const leaving = changed && phase === 'idle'
  const waiting = changed && phase === 'bar'
  const entering = phase === 'enter'

  const className = [
    'slide-switch',
    leaving ? 'slide-switch--leaving' : '',
    entering ? 'slide-switch--entering' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} aria-busy={changed}>
      {waiting ? (
        <div className="slide-switch__bar" role="progressbar" />
      ) : (
        <div className="slide-switch__content">
          {leaving ? shown.node : children}
        </div>
      )}
    </div>
  )
}
