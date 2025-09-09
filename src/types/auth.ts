export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  email_verified: boolean;
}

// Unified User interface
export interface User {
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

// AuthUser interface for Better Auth
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  image?: string;
  emailVerified?: boolean;
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

export interface AuthAccount {
  provider: string;
  providerAccountId: string;
  type: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface AuthSession {
  user: User;
}

export interface AuthToken {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  iat?: number;
  exp?: number;
}
