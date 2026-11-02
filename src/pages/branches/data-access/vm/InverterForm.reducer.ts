import {
  INITIAL_INVERTER_FORM,
  type InverterFormVM,
  type InverterStepVM,
} from './Branches.vm'
import {
  createEmptyInverterString,
  type InverterStringVM,
} from './InverterStrings.vm'

export interface InverterFormState {
  form: InverterFormVM
  strings: InverterStringVM[]
  step: InverterStepVM
  error: string
  submitting: boolean
  succeeded: boolean
}

export type InverterFormAction =
  | {
      type: 'UPDATE_FIELD'
      field: keyof InverterFormVM
      value: string
    }
  | { type: 'CHANGE_MANUFACTURER'; value: string; keepModel: boolean }
  | { type: 'SET_STRINGS'; strings: InverterStringVM[] }
  | { type: 'GO_TO_STEP'; step: InverterStepVM }
  | { type: 'FAIL'; message: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_FAILURE'; message: string }

export function createInitialInverterFormState(): InverterFormState {
  return {
    form: INITIAL_INVERTER_FORM,
    strings: [createEmptyInverterString()],
    step: 1,
    error: '',
    submitting: false,
    succeeded: false,
  }
}

export function inverterFormReducer(
  state: InverterFormState,
  action: InverterFormAction,
): InverterFormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      }
    case 'CHANGE_MANUFACTURER':
      return {
        ...state,
        form: {
          ...state.form,
          manufacturer: action.value,
          model: action.keepModel ? state.form.model : '',
        },
      }
    case 'SET_STRINGS':
      return { ...state, strings: action.strings }
    case 'GO_TO_STEP':
      return { ...state, step: action.step, error: '' }
    case 'FAIL':
      return { ...state, error: action.message }
    case 'SUBMIT_START':
      return { ...state, submitting: true, error: '' }
    case 'SUBMIT_SUCCESS':
      return { ...state, submitting: false, succeeded: true }
    case 'SUBMIT_FAILURE':
      return { ...state, submitting: false, error: action.message }
  }
}
