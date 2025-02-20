import { Role } from "./role.model";

export interface AuthResponse {
  token?: string;
  issueDate?: Date;
  expirationDate?: Date;
  expiration?: number;
  username?: string;
  userId?: number;
  roles?: Role[];
}
