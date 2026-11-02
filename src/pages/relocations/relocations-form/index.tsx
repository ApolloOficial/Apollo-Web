import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FeedbackModal } from '../../../components/feedback-modal'
import { FormLayout } from '../../../components/form-layout'
import errorImage from '../../../assets/images/relocation-error.png'
import successImage from '../../../assets/images/relocation-success.png'
import { paths } from '../../../routes/paths'
import { RelocationsForm as FormFeature } from '../features/relocations-form'

export default function RelocationsForm() {
  const navigate = useNavigate()
  const [successOpen, setSuccessOpen] = useState(false)
  const [error, setError] = useState('')
  const handleError = useCallback((message: string) => setError(message), [])

  return (
    <>
      <FormLayout
        breadcrumb={[
          { label: 'Início', to: paths.home },
          { label: 'Realocações', to: paths.relocations },
          { label: 'Solicitar realocação' },
        ]}
        title="Solicitar realocação"
        description="Preencha todos os dados da realocação. Após a conclusão, o gerente será notificado para validação."
      >
        <FormFeature
          onSuccess={() => setSuccessOpen(true)}
          onError={handleError}
        />
      </FormLayout>

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
    </>
  )
}
