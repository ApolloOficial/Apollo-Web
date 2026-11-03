import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../../components/button'
import { FormActions } from '../../../../components/form-actions'
import { Combobox } from '../../../../components/inputs/combobox'
import { SimpleInput } from '../../../../components/inputs/simple-input'
import { useCurrentUserContext } from '../../../../hooks/useCurrentUserContext'
import { getRoles, postEmployee } from '../../../../services/employees.service'
import {
  EMPLOYEE_EMAIL_MAX_LENGTH,
  EMPLOYEE_NAME_MAX_LENGTH,
  validateEmployeeForm,
  type EmployeeFormInput,
} from '../../../../utils/validators/employee'
import { PASSWORD_MAX_LENGTH } from '../../../../utils/validators/auth'
import { isManager } from '../../../../utils/user'
import type { RoleDTO } from '../../../../types/employee.types'
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
  const { user, error: userError } = useCurrentUserContext()
  const companyUnitId = user?.companyUnitId ?? ''
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof EmployeeFormInput, string>>
  >({})

  useEffect(() => {
    void getRoles()
      .then((rolesPage) => {
        setRoles(rolesPage.content.filter((role) => !isManager(role.name)))
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
    const validation = validateEmployeeForm(form, Boolean(selectedRole))
    setFieldErrors(validation.errors)
    if (!validation.isValid || !selectedRole) return
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
        maxLength={EMPLOYEE_NAME_MAX_LENGTH}
        required
        error={fieldErrors.fullName}
        onChange={(fullName) => setForm({ ...form, fullName })}
      />

      <SimpleInput
        id="employee-email"
        label="E-mail"
        type="email"
        placeholder="Digite o e-mail do funcionário"
        value={form.email}
        maxLength={EMPLOYEE_EMAIL_MAX_LENGTH}
        required
        error={fieldErrors.email}
        onChange={(email) => setForm({ ...form, email })}
      />

      <SimpleInput
        id="employee-temporary-password"
        label="Senha temporária"
        placeholder="Digite a senha temporária do funcionário"
        value={form.temporaryPassword}
        minLength={8}
        maxLength={PASSWORD_MAX_LENGTH}
        autoComplete="off"
        required
        error={fieldErrors.temporaryPassword}
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

      {(error || fieldErrors.roleName) && (
        <p className="form-layout__error" role="alert">
          {error || fieldErrors.roleName}
        </p>
      )}

      <FormActions>
        <Button type="submit" fullWidth loading={submitting}>
          Cadastrar
        </Button>
      </FormActions>
    </form>
  )
}
