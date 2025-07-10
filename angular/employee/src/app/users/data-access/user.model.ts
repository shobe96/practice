import { Role } from "../../roles/data-access/role.model";

export interface User {
  [key: string]: number | string | undefined | Role[];
  id?: number;
  username?: string;
  password?: string;
  roles?: Role[];
}
