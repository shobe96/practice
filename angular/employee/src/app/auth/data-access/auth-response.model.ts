import { Role } from "../../roles/data-access/role.model";

export interface AuthResponse {
  token?: string;
  issueDate?: Date;
  expirationDate?: Date;
  expiration?: number;
  username?: string;
  userId?: number;
  roles?: Role[];
}
