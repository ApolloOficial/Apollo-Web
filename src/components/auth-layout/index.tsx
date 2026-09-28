import { Outlet } from 'react-router-dom'
import './index.css'

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__panel">
        <img
          className="auth-layout__logo"
          src="/apollo-logo.svg"
          alt="Apollo"
          width={41}
          height={70}
        />
        <div className="auth-layout__tagline">
          <p className="auth-layout__headline">Energia para seguir em frente.</p>
          <p className="auth-layout__description">
            Gestão inteligente de ativos solares, do planejamento à operação.
          </p>
        </div>
      </aside>
      <main className="auth-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
