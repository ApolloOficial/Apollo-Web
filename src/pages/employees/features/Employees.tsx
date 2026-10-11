import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Paginator } from '../../../components/paginator'
import { DeactivateEmployeeModal } from './deactivate-employee-modal'
import { EmployeesFilter } from './filters/EmployeesFilter'
import { getEmployees, getRoles, patchDeactivateEmployee } from '../data-access/services/Employees.service'
import type { EmployeeDTO, RoleDTO } from '../data-access/dto/Employees.dto'
import { INITIAL_EMPLOYEE_FILTERS, type EmployeeFiltersVM } from '../data-access/vm/Employees.vm'
import '../Employees.css'

export function EmployeesFeature() {
  const [employees, setEmployees] = useState<EmployeeDTO[]>([])
  const [roles, setRoles] = useState<RoleDTO[]>([])
  const [draft, setDraft] = useState<EmployeeFiltersVM>(INITIAL_EMPLOYEE_FILTERS)
  const [filters, setFilters] = useState<EmployeeFiltersVM>(INITIAL_EMPLOYEE_FILTERS)
  const [selected, setSelected] = useState<EmployeeDTO | null>(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deactivating, setDeactivating] = useState(false)
  const [error, setError] = useState('')

  const loadEmployees = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getEmployees(filters, page, size)
      setEmployees(result.content)
      setTotalPages(result.totalPages)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os funcionários.')
    } finally {
      setLoading(false)
    }
  }, [filters, page, size])

  useEffect(() => { void loadEmployees() }, [loadEmployees])

  useEffect(() => {
    void getRoles()
      // Gerentes não são cadastrados por este fluxo.
      .then(({ content }) => setRoles(content.filter((role) => role.name.toUpperCase() !== 'GERENTE')))
      .catch(() => setRoles([]))
  }, [])

  const emailOptions = useMemo(
    () => [...new Set(employees.map(({ email }) => email))],
    [employees],
  )

  async function confirmDeactivation() {
    if (!selected) return
    setDeactivating(true)
    try {
      await patchDeactivateEmployee(selected.id)
      setSelected(null)
      await loadEmployees()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível desligar o funcionário.')
    } finally {
      setDeactivating(false)
    }
  }

  return (
    <main className="employees-page">
      <nav className="employees-page__breadcrumb" aria-label="Navegação estrutural">
        <Link to="/">Início</Link><span>›</span><strong>Funcionários</strong>
      </nav>

      <header className="employees-page__heading">
        <div><h1>Funcionários</h1><p>Gerencie os funcionários da sua filial</p></div>
        <Link className="employees-page__new" to="/employees/new">Cadastrar funcionário</Link>
      </header>

      <EmployeesFilter value={draft} roles={roles} emailOptions={emailOptions}
        onChange={setDraft} onApply={() => { setPage(0); setFilters(draft) }} />

      {error && <p className="employees-page__error" role="alert">{error}</p>}

      <div className="employees-table" aria-busy={loading}>
        <div className="employees-table__header">
          <strong>Nome</strong><strong>E-mail</strong><strong>Cargo</strong><strong>Ativo</strong><span />
        </div>
        {!loading && employees.map((employee) => (
          <article className="employees-table__row" key={employee.id}>
            <span>{employee.fullName}</span><span>{employee.email}</span>
            <span>{employee.role}</span><span>{employee.active ? 'Sim' : 'Não'}</span>
            <button type="button" disabled={!employee.active} onClick={() => setSelected(employee)}>
              {employee.active ? 'Desligar' : 'Desligado'}
            </button>
          </article>
        ))}
        {loading && <p className="employees-table__state">Carregando...</p>}
        {!loading && employees.length === 0 && <p className="employees-table__state">Nenhum funcionário encontrado.</p>}
      </div>

      <Paginator
        page={page}
        totalPages={totalPages}
        size={size}
        onPageChange={setPage}
        onSizeChange={(newSize) => { setPage(0); setSize(newSize) }}
      />

      {selected && (
        <DeactivateEmployeeModal employeeName={selected.fullName} submitting={deactivating}
          onClose={() => setSelected(null)} onConfirm={() => void confirmDeactivation()} />
      )}
    </main>
  )
}