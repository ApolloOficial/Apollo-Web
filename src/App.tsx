import { AuthProvider } from './contexts/AuthProvider'
import { useRouteAccessibility } from './hooks/useRouteAccessibility'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  const pageTitle = useRouteAccessibility()

  return (
    <AuthProvider>
      <div className="sr-only" role="status" aria-live="polite">
        {pageTitle}
      </div>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
