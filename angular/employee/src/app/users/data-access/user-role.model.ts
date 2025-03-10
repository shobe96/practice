import { Role } from "../../roles/data-access/role.model";
import { User } from "./user.model";

export interface UserRole {
  user?: User;
  role?: Role;
}
