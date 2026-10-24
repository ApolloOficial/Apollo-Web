import { useNavigate } from 'react-router-dom'
import { FormLayout } from '../../../components/form-layout'
import { paths } from '../../../routes/paths'
import { EmployeesForm } from '../features/employee-form/EmployeesForm'

export default function EmployeeForm() {
  const navigate = useNavigate()

  return (
    <FormLayout
      breadcrumb={[
        { label: 'Início', to: paths.home },
        { label: 'Funcionários', to: paths.employees },
        { label: 'Cadastrar funcionário' },
      ]}
      title="Cadastre novo funcionário"
      description="Preencha todos os dados atentamente."
    >
      <EmployeesForm onSuccess={() => navigate(paths.employees)} />
    </FormLayout>
  )
}
