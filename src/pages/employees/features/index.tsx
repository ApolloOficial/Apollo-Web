import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AppliedFilters,
  type AppliedFilter,
} from '../../../components/applied-filters'
import { Paginator } from '../../../components/paginator'
import { useCurrentUserContext } from '../../../hooks/useCurrentUserContext'
import { isManager } from '../../../utils/user'
import type { RoleDTO } from '../data-access/dto/Employees.dto'
import {
  getEmployees,
  getRoles,
  patchDeactivateEmployee,
} from '../data-access/services/Employees.service'
import {
  INITIAL_EMPLOYEE_FILTERS,
  type EmployeeFiltersVM,
} from '../data-access/vm/Employees.vm'
import '../Employees.css'
import { DeactivateEmployeeModal } from './deactivate-employee-modal'
import { EmployeesFilter } from './filters'
import type { EmployeeDto } from '../../../types/employee.types'
import { TableSkeleton } from '../../../components/table-skeleton'
import { ErrorState } from '../../../components/error-state'

export function EmployeesFeature() {
  const { user, loading: loadingUser } = useCurrentUserContext()
  const [employees, setEmployees] = useState<EmployeeDto[]>([])
  const [roles, setRoles] = useState<RoleDTO[]>([])
  const [draft, setDraft] = useState<EmployeeFiltersVM>(
    INITIAL_EMPLOYEE_FILTERS,
  )
  const [applied, setApplied] = useState<EmployeeFiltersVM>(
    INITIAL_EMPLOYEE_FILTERS,
  )
  const [searchParams, setSearchParams] = useSearchParams()
  const urlFullName = searchParams.get('name') ?? ''
  const filters = useMemo<EmployeeFiltersVM>(
    () => ({ ...applied, fullName: urlFullName }),
    [applied, urlFullName],
  )
  const [selected, setSelected] = useState<EmployeeDto | null>(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deactivating, setDeactivating] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const companyUnitId = user?.companyUnitId ?? null
  const currentUserId = user?.userId ?? null

  const loadEmployees = useCallback(async () => {
    if (loadingUser) return

    setLoading(true)
    setError('')

    try {
      const result = await getEmployees(filters, page, size, companyUnitId)

      setEmployees(result.content)
      setTotalPages(result.totalPages)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar os funcionários.',
      )
    } finally {
      setLoading(false)
    }
  }, [filters, page, size, loadingUser, companyUnitId])

  useEffect(() => {
    void (async () => {
      await Promise.resolve()
      await loadEmployees()
    })()
  }, [loadEmployees])

  useEffect(() => {
    void getRoles()
      .then(({ content }) => {
        setRoles(content.filter((role) => !isManager(role.name)))
      })
      .catch(() => setRoles([]))
  }, [])

  const emailOptions = useMemo(
    () => [...new Set(employees.map(({ email }) => email))],
    [employees],
  )

  const appliedFilters = useMemo<AppliedFilter[]>(() => {
    const result: AppliedFilter[] = []

    if (filters.fullName) {
      result.push({
        key: 'fullName',
        label: 'Nome',
        value: filters.fullName,
      })
    }

    if (filters.email) {
      result.push({
        key: 'email',
        label: 'E-mail',
        value: filters.email,
      })
    }

    if (filters.role) {
      const role = roles.find(
        (item) =>
          item.name === filters.role || String(item.id) === filters.role,
      )

      result.push({
        key: 'role',
        label: 'Cargo',
        value: role?.name ?? filters.role,
      })
    }

    if (filters.isActive && filters.isActive !== 'ALL') {
      result.push({
        key: 'isActive',
        label: 'Status',
        value: filters.isActive === 'true' ? 'Ativo' : 'Inativo',
      })
    }

    return result
  }, [filters, roles])

  function clearUrlFullName() {
    if (!searchParams.has('name')) return

    const next = new URLSearchParams(searchParams)

    next.delete('name')
    setSearchParams(next, { replace: true })
  }

  function removeAppliedFilter(key: string) {
    setPage(0)

    if (key === 'fullName') {
      clearUrlFullName()
    }

    if (key === 'email') {
      setDraft((current) => ({ ...current, email: '' }))
      setApplied((current) => ({ ...current, email: '' }))
    }

    if (key === 'role') {
      setDraft((current) => ({ ...current, role: '' }))
      setApplied((current) => ({ ...current, role: '' }))
    }

    if (key === 'isActive') {
      setDraft((current) => ({ ...current, isActive: '' }))
      setApplied((current) => ({ ...current, isActive: '' }))
    }
  }

  function clearAppliedFilters() {
    setPage(0)
    clearUrlFullName()
    setDraft(INITIAL_EMPLOYEE_FILTERS)
    setApplied(INITIAL_EMPLOYEE_FILTERS)
  }

  async function confirmDeactivation() {
    if (!selected) return

    setDeactivating(true)
    setActionError('')

    try {
      await patchDeactivateEmployee(selected.id)
      setSelected(null)
      await loadEmployees()
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível desligar o funcionário.',
      )
    } finally {
      setDeactivating(false)
    }
  }

  return (
    <main className="employees-page list-page">
      <nav
        className="employees-page__breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to="/">Início</Link>
        <span>›</span>
        <strong>Funcionários</strong>
      </nav>

      <header className="employees-page__heading">
        <div>
          <h1>Funcionários</h1>
          <p>Gerencie os funcionários da sua filial</p>
        </div>

        <Link className="employees-page__new" to="/employees/new">
          Cadastrar funcionário
        </Link>
      </header>

      <EmployeesFilter
        value={draft}
        roles={roles}
        emailOptions={emailOptions}
        onChange={setDraft}
        onApply={() => {
          setPage(0)
          clearUrlFullName()
          setApplied(draft)
        }}
      />

      <AppliedFilters
        filters={appliedFilters}
        onRemove={removeAppliedFilter}
        onClear={clearAppliedFilters}
      />

      {actionError && (
        <p className="employees-page__error" role="alert">
          {actionError}
        </p>
      )}

      <div className="employees-table list-table" aria-busy={loading}>
        <div className="employees-table__header">
          <strong>Nome</strong>
          <strong>E-mail</strong>
          <strong>Cargo</strong>
          <strong>Ativo</strong>
          <span />
        </div>

        {!loading &&
          employees.map((employee) => (
            <article className="employees-table__row" key={employee.id}>
              <span>{employee.fullName}</span>
              <span>{employee.email}</span>
              <span>{employee.role}</span>
              <span>{employee.active ? 'Sim' : 'Não'}</span>

              {employee.id !== currentUserId && !isManager(employee.role) ? (
                <button
                  type="button"
                  disabled={!employee.active}
                  onClick={() => setSelected(employee)}
                >
                  {employee.active ? 'Desligar' : 'Desligado'}
                </button>
              ) : (
                <span />
              )}
            </article>
          ))}

        {loading && <TableSkeleton />}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => void loadEmployees()} />
        )}

        {!loading && !error && employees.length === 0 && (
          <p className="employees-table__state">
            Nenhum funcionário encontrado.
          </p>
        )}
      </div>

      <Paginator
        page={page}
        totalPages={totalPages}
        size={size}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setPage(0)
          setSize(newSize)
        }}
      />

      {selected && (
        <DeactivateEmployeeModal
          employeeName={selected.fullName}
          submitting={deactivating}
          onClose={() => setSelected(null)}
          onConfirm={() => void confirmDeactivation()}
        />
      )}
    </main>
  )
}
