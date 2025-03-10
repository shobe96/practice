import { Role } from "../../roles/data-access/role.model";

export interface User {
  id?: number;
  username?: string;
  password?: string;
  roles?: Role[];
}
