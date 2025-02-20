export const StrongPasswordRegx =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

export const rowsPerPage = [5, 10, 20, 30];

export const messageLife = 3000;

export enum enumSeverity {
  success = 'success',
  info = 'info',
  warn = 'warn',
  danger = 'danger',
  help = 'help',
  primary = 'primary',
  secondary = 'secondary',
  contrast = 'contrast',
  error = 'error'
}

export enum enumRoles {
  ADMIN = "ADM",
  EMPLOYEE = "EMP",
  DEPARTMENT_CHIEF = "DCH"
}
