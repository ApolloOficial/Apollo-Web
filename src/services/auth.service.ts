import type { ChangePasswordPayloadDto, LoginPayloadDto, LoginResponseDto } from '../types/auth.types'
import { request } from './http'

export async function login(payload: LoginPayloadDto): Promise<LoginResponseDto> {
  return request<LoginResponseDto>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export async function changePassword(payload: ChangePasswordPayloadDto): Promise<void> {
  return request<void>('/auth/password', {
    method: 'PATCH',
    body: payload,
  })
}