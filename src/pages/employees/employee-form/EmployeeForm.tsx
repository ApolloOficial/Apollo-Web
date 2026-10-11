import { Link, useNavigate } from 'react-router-dom'
import { EmployeesForm } from '../features/employee-form/EmployeesForm'
import '../Employees.css'

export default function EmployeeForm() {
  const navigate = useNavigate()
  return (
    <main className="employee-form-page">
      <nav className="employees-page__breadcrumb"><Link to="/">Início</Link><span>›</span>
        <Link to="/employees">Funcionários</Link><span>›</span><strong>Cadastrar funcionário</strong></nav>
      <h1>Cadastre novo funcionário</h1>
      <p>Preencha todos os dados atentamente.</p>
      <EmployeesForm onSuccess={() => navigate('/employees')} />
    </main>
  )
}