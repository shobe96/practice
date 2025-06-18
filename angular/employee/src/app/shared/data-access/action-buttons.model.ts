export interface ActionButtons<T> {
  icon: string,
  action: (obj: T) => void,
  severity: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger',
  tooltip: string
}
