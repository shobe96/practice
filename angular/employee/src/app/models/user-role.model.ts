import { Role } from "./role.model";
import { User } from "./user.model";

export interface UserRole {
  user?: User;
  role?: Role;
}
