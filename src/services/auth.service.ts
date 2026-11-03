import type {
  ChangePasswordPayloadDto,
  CurrentUserDto,
  LoginPayloadDto,
  LoginResponseDto,
  OtpSendPayloadDto,
  OtpSentResponseDto,
  OtpVerifyPayloadDto,
  OtpVerifyResponseDto,
  PasswordResetPayloadDto,
  RecoveryStartPayloadDto,
  RecoveryStartResponseDto,
} from '../types/auth.types'
import { request, toApiError } from './http'

let currentUserRequest: Promise<CurrentUserDto> | null = null

function resetCurrentUser() {
  currentUserRequest = null
}

export async function login(
  payload: LoginPayloadDto,
): Promise<LoginResponseDto> {
  try {
    resetCurrentUser()
    return await request<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function checkWebAccess(email: string): Promise<void> {
  try {
    return await request<void>('/auth/web-access', {
      method: 'POST',
      body: { email },
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function changePassword(
  payload: ChangePasswordPayloadDto,
): Promise<void> {
  try {
    resetCurrentUser()
    return await request<void>('/auth/password', {
      method: 'PATCH',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export function getCurrentUser(): Promise<CurrentUserDto> {
  if (!currentUserRequest) {
    currentUserRequest = request<CurrentUserDto>('/auth/me').catch(
      (error: unknown) => {
        resetCurrentUser()
        throw error
      },
    )
  }
  return currentUserRequest
}

export async function startPasswordRecovery(
  payload: RecoveryStartPayloadDto,
): Promise<RecoveryStartResponseDto> {
  try {
    return await request<RecoveryStartResponseDto>('/mobile/auth/recovery', {
      method: 'POST',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function sendRecoveryCode(
  payload: OtpSendPayloadDto,
): Promise<OtpSentResponseDto> {
  try {
    return await request<OtpSentResponseDto>('/mobile/auth/otp/send', {
      method: 'POST',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function verifyRecoveryCode(
  payload: OtpVerifyPayloadDto,
): Promise<OtpVerifyResponseDto> {
  try {
    return await request<OtpVerifyResponseDto>('/mobile/auth/otp/verify', {
      method: 'POST',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function resetPassword(
  payload: PasswordResetPayloadDto,
): Promise<void> {
  try {
    return await request<void>('/mobile/auth/password/reset', {
      method: 'POST',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}
