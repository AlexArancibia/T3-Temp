// Tipos centralizados para usuario
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isConfirmed: boolean;
  confirmationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
