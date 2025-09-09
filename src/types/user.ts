// Tipos centralizados para usuario
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
