// Tipos centralizados para usuario
export interface User {
  lastname?: string;
  phone?: string;
  id: string;
  email: string;
  password: string | null;
  name: string;
  isConfirmed: boolean;
  confirmationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
