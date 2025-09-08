// Función de validación
export const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};
