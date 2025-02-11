export interface Department {
  [key: string]: number | string | boolean | undefined;
  id?: number;
  name?: string;
  addDate?: string;
  modDate?: string;
  addUser?: string;
  modUser?: string;
  active?: boolean;
}
