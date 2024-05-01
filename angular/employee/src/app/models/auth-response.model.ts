import { Role } from "./role";

export class AuthResponse {
  token?: string;
  issueDate?: Date;
  expirationDate?: Date;
  expiration?: number;
  username?: string;
  userId?: number;
  roles?: Role[];
  constructor(token?: string,
    issueDate?: Date,
    expirationDate?: Date,
    expiration?: number,
    username?: string,
    userId?: number,
    roles?: Role[]) {
    this.token = token;
    this.expiration = expiration;
    this.expirationDate = expirationDate;
    this.issueDate = issueDate;
    this.username = username;
    this.userId = userId;
    this.roles = roles;
  }
}
