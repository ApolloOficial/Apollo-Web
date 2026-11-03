import {
  changePassword,
  checkWebAccess,
  login,
  resetPassword,
  sendRecoveryCode,
  startPasswordRecovery,
  verifyRecoveryCode,
} from '../services/auth.service'
import { ApiError } from '../services/http'

const authActions = {
  checkWebAccess,
  login,
  changePassword,
  startPasswordRecovery,
  sendRecoveryCode,
  verifyRecoveryCode,
  resetPassword,
}

export function useAuthActions() {
  return authActions
}

export function isForbiddenError(cause: unknown): boolean {
  return cause instanceof ApiError && cause.status === 403
}
