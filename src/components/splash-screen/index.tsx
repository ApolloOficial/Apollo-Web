import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import './SplashScreen.css'

interface SplashScreenProps {
  duration?: number
  onFinish: () => void
}

export function SplashScreen({ duration = 3000, onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, duration)

    return () => window.clearTimeout(timer)
  }, [duration, onFinish])

  const style = { '--splash-duration': `${duration}ms` } as CSSProperties

  return (
    <div
      className="splash-screen"
      role="status"
      aria-label="Apollo"
      style={style}
    >
      <span className="splash-screen__zoom">
        <img
          className="splash-screen__logo"
          src="/apollo-logo.svg"
          alt=""
          width={82}
          height={140}
        />
      </span>
    </div>
  )
}
