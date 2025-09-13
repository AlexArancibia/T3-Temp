// Tipos centralizados para usuario - INTERFAZ PRINCIPAL
export interface User {
  id: string;
  email: string;
  password: string | null;
  firstName: string;
  lastName?: string;
  phone?: string;
  image?: string;
  isConfirmed: boolean;
  confirmationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  timezone: string;
  language: string;
  theme: string;
  defaultRiskPercentage: number;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz simplificada para autenticación (sin campos sensibles)
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  image?: string;
  isConfirmed: boolean;
  isAdmin: boolean;
  timezone: string;
  language: string;
  theme: string;
  defaultRiskPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}
