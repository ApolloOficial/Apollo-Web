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
import { request } from './http'

let currentUserRequest: Promise<CurrentUserDto> | null = null

function resetCurrentUser() {
  currentUserRequest = null
}

export async function login(
  payload: LoginPayloadDto,
): Promise<LoginResponseDto> {
  resetCurrentUser()
  return request<LoginResponseDto>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export async function checkWebAccess(email: string): Promise<void> {
  return request<void>('/auth/web-access', {
    method: 'POST',
    body: { email },
  })
}

export async function changePassword(
  payload: ChangePasswordPayloadDto,
): Promise<void> {
  resetCurrentUser()
  return request<void>('/auth/password', {
    method: 'PATCH',
    body: payload,
  })
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
  return request<RecoveryStartResponseDto>('/mobile/auth/recovery', {
    method: 'POST',
    body: payload,
  })
}

export async function sendRecoveryCode(
  payload: OtpSendPayloadDto,
): Promise<OtpSentResponseDto> {
  return request<OtpSentResponseDto>('/mobile/auth/otp/send', {
    method: 'POST',
    body: payload,
  })
}

export async function verifyRecoveryCode(
  payload: OtpVerifyPayloadDto,
): Promise<OtpVerifyResponseDto> {
  return request<OtpVerifyResponseDto>('/mobile/auth/otp/verify', {
    method: 'POST',
    body: payload,
  })
}

export async function resetPassword(
  payload: PasswordResetPayloadDto,
): Promise<void> {
  return request<void>('/mobile/auth/password/reset', {
    method: 'POST',
    body: payload,
  })
}
