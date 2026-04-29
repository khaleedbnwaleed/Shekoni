export type UserType = 'patient' | 'doctor' | 'admin' | 'staff';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: UserType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  userId: string;
  userType: UserType;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: UserType;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface TokenPayload {
  userId: string;
  userType: UserType;
  email: string;
}
