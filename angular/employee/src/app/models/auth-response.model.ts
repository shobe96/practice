export class AuthResponse {
  token?: string;
  issueDate?: Date;
  expirationDate?: Date;
  expiration?: number;
  username?: string;
  constructor(token?: string,
    issueDate?: Date,
    expirationDate?: Date,
    expiration?: number,
    username?: string) {
    this.token = token;
    this.expiration = expiration;
    this.expirationDate = expirationDate;
    this.issueDate = issueDate;
    this.username = username;
  }
}
