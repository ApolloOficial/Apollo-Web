import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../../components/button'
import { FormActions } from '../../../../components/form-actions'
import { Combobox } from '../../../../components/inputs/combobox'
import { SimpleInput } from '../../../../components/inputs/simple-input'
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
    <form
      className="form-layout__form"
      onSubmit={(event) => void submit(event)}
    >
      <SimpleInput
        id="employee-name"
        label="Nome"
        placeholder="Digite o nome do funcionário"
        value={form.fullName}
        maxLength={120}
        required
        onChange={(fullName) => setForm({ ...form, fullName })}
      />

      <SimpleInput
        id="employee-email"
        label="E-mail"
        type="email"
        placeholder="Digite o e-mail do funcionário"
        value={form.email}
        maxLength={120}
        required
        onChange={(email) => setForm({ ...form, email })}
      />

      <SimpleInput
        id="employee-temporary-password"
        label="Senha temporária"
        placeholder="Digite a senha temporária do funcionário"
        value={form.temporaryPassword}
        minLength={8}
        maxLength={72}
        autoComplete="off"
        required
        onChange={(temporaryPassword) =>
          setForm({ ...form, temporaryPassword })
        }
      />

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
        <p className="form-layout__error" role="alert">
          {error}
        </p>
      )}

      <FormActions>
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </FormActions>
    </form>
  )
}
