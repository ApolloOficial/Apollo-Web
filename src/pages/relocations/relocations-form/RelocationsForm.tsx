import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FeedbackModal } from '../../../components/feedback-modal'
import errorImage from '../../../assets/images/relocation-error.png'
import successImage from '../../../assets/images/relocation-success.png'
import { paths } from '../../../routes/paths'
import { RelocationsForm as FormFeature } from '../features/relocations-form/RelocationsForm'
import '../Relocations.css'

export default function RelocationsForm() {
  const navigate = useNavigate()
  const [successOpen, setSuccessOpen] = useState(false)
  const [error, setError] = useState('')
  const handleError = useCallback((message: string) => setError(message), [])

  return (
    <section className="relocation-form-page">
      <nav className="relocations-breadcrumb">
        <Link to={paths.home}>Início</Link>
        <span>›</span>
        <Link to={paths.relocations}>Realocações</Link>
        <span>›</span>
        <strong>Solicitar realocação</strong>
      </nav>
      <h1>Solicitar realocação</h1>
      <p>
        Preencha todos os dados da realocação. Após a conclusão,
        <br />o gerente será notificado para validação.
      </p>
      <FormFeature
        onSuccess={() => setSuccessOpen(true)}
        onError={handleError}
      />
      {successOpen && (
        <FeedbackModal
          image={successImage}
          title={'Solicitação registrada\ncom sucesso!'}
          description="Confira ela no catálogo agora."
          secondaryAction={{
            label: 'Fechar',
            onClick: () => setSuccessOpen(false),
          }}
          primaryAction={{
            label: 'Conferir',
            onClick: () => navigate(paths.relocations),
          }}
          onClose={() => setSuccessOpen(false)}
        />
      )}
      {error && (
        <FeedbackModal
          alert
          image={errorImage}
          title={'Não foi possível registrar\na solicitação.'}
          description="Aguarde alguns minutos e tente novamente."
          primaryAction={{
            label: 'Tentar novamente',
            onClick: () => setError(''),
          }}
          onClose={() => setError('')}
        />
      )}
    </section>
  )
}
