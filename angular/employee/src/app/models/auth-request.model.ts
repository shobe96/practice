export class AuthRequest {
  username?: string;
  password?: string;
  constructor(password?: string,
    username?: string) {
    this.username = username;
    this.password = password;
  }
}
