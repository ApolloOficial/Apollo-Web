import illustration from '../../assets/images/load-error.png'
import { Button } from '../button'
import './ErrorState.css'

interface ErrorStateProps {
  title?: string
  message: string
  retrying?: boolean
  onRetry: () => void
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message,
  retrying = false,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <img
        className="error-state__illustration"
        src={illustration}
        alt=""
        width={160}
        height={160}
      />
      <h2 className="error-state__title">{title}</h2>
      <p className="error-state__message">{message}</p>
      <div className="error-state__actions">
        <Button fullWidth loading={retrying} onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
