import { Role } from "./role.model";
import { User } from "./user.model";

export class UserRole {
  user?: User;
  role?: Role;

  constructor(user?: User,
    role?: Role) {
      this.user = user;
      this.role = role;
    }
}
