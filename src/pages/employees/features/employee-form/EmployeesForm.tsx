import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Combobox } from '../../../../components/inputs/combobox'
import { useCurrentUserContext } from '../../../../hooks/useCurrentUserContext'
import {
  getRoles,
  postEmployee,
} from '../../data-access/services/Employees.service'
import type { RoleDTO } from '../../data-access/dto/Employees.dto'
import {
  INITIAL_EMPLOYEE_FORM,
  type EmployeeFormVM,
} from '../../data-access/vm/Employees.vm'

interface Props {
  onSuccess: () => void
}

export function EmployeesForm({ onSuccess }: Props) {
  const [form, setForm] = useState<EmployeeFormVM>(INITIAL_EMPLOYEE_FORM)
  const [roles, setRoles] = useState<RoleDTO[]>([])
  // A filial vem do gerente autenticado e não aparece no formulário.
  const { user, error: userError } = useCurrentUserContext()
  const companyUnitId = user?.companyUnitId ?? ''
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void getRoles()
      .then((rolesPage) => {
        setRoles(
          rolesPage.content.filter(
            (role) => role.name.toUpperCase() !== 'GERENTE',
          ),
        )
      })
      .catch((cause: unknown) =>
        setError(
          cause instanceof Error ? cause.message : 'Erro ao preparar cadastro.',
        ),
      )
  }, [])

  const selectedRole = useMemo(
    () =>
      roles.find(
        (role) =>
          role.name.toLocaleLowerCase('pt-BR') ===
          form.roleName.trim().toLocaleLowerCase('pt-BR'),
      ),
    [form.roleName, roles],
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!selectedRole) return setError('Selecione um cargo existente na lista.')
    if (!companyUnitId)
      return setError(userError ?? 'A filial do gerente não foi encontrada.')
    setSubmitting(true)
    try {
      await postEmployee({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        temporaryPassword: form.temporaryPassword,
        roleId: selectedRole.id,
        companyUnitId,
        active: true,
      })
      onSuccess()
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Não foi possível cadastrar.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="employee-form" onSubmit={(event) => void submit(event)}>
      <label>
        Nome
        <input
          required
          maxLength={120}
          value={form.fullName}
          placeholder="Digite o nome do funcionário"
          onChange={(event) =>
            setForm({ ...form, fullName: event.target.value })
          }
        />
      </label>
      <label>
        E-mail
        <input
          required
          type="email"
          maxLength={120}
          value={form.email}
          placeholder="Digite o e-mail do funcionário"
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
      </label>
      <label>
        Senha temporária
        <input
          required
          type="text"
          minLength={8}
          maxLength={72}
          value={form.temporaryPassword}
          placeholder="Digite a senha temporária do funcionário"
          onChange={(event) =>
            setForm({ ...form, temporaryPassword: event.target.value })
          }
        />
      </label>
      <Combobox
        required
        label="Cargo"
        placeholder="Digite o cargo do funcionário"
        value={form.roleName}
        options={roles.map((role) => ({
          value: String(role.id),
          label: role.name,
        }))}
        onChange={(roleName) => setForm({ ...form, roleName })}
      />
      {error && (
        <p className="employees-page__error" role="alert">
          {error}
        </p>
      )}
      <button
        className="employee-form__submit"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
