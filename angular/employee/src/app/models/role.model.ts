export interface Role {
  [key: string]: number | string | undefined;
  id?: number;
  name?: string;
  code?: string;
  description?: string;
}
