import { describe, expect, it } from 'vitest'
import {
  createInitialInverterFormState,
  inverterFormReducer,
} from './InverterForm.reducer'

describe('inverterFormReducer', () => {
  it('atualiza campos sem mutar o estado', () => {
    const state = createInitialInverterFormState()
    const next = inverterFormReducer(state, {
      type: 'UPDATE_FIELD',
      field: 'code',
      value: 'INV-01',
    })

    expect(next.form.code).toBe('INV-01')
    expect(state.form.code).toBe('')
  })

  it('limpa o modelo ao trocar de fabricante', () => {
    const state = inverterFormReducer(createInitialInverterFormState(), {
      type: 'UPDATE_FIELD',
      field: 'model',
      value: 'SG10RT',
    })
    const next = inverterFormReducer(state, {
      type: 'CHANGE_MANUFACTURER',
      value: 'Outro',
      keepModel: false,
    })

    expect(next.form.model).toBe('')
  })

  it('troca de etapa limpando o erro', () => {
    const failed = inverterFormReducer(createInitialInverterFormState(), {
      type: 'FAIL',
      message: 'Erro',
    })
    const next = inverterFormReducer(failed, { type: 'GO_TO_STEP', step: 2 })

    expect(next.step).toBe(2)
    expect(next.error).toBe('')
  })

  it('controla o envio', () => {
    const started = inverterFormReducer(createInitialInverterFormState(), {
      type: 'SUBMIT_START',
    })
    expect(started.submitting).toBe(true)

    const failed = inverterFormReducer(started, {
      type: 'SUBMIT_FAILURE',
      message: 'Falhou',
    })
    expect(failed).toMatchObject({ submitting: false, error: 'Falhou' })

    const done = inverterFormReducer(started, { type: 'SUBMIT_SUCCESS' })
    expect(done).toMatchObject({ submitting: false, succeeded: true })
  })
})
