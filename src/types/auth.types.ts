export interface LoginPayloadDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  tokenType: string;
  firstAccess: boolean;
}

export interface ApiErrorDto {
  status: number;
  message: string;
}

export interface LoginFormViewModel {
  email: string;
  password: string;
  remember: boolean;
}

export interface ChangePasswordPayloadDto {
  currentPassword: string;
  newPassword: string;
}

export interface FirstAccessFormViewModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}