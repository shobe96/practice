export class ErrorResponse {
  status?: number;
  statusText?: string;
  ok?: boolean;
  name?: string;
  message?: string;

  constructor(status: number,
    statusText: string,
    ok: boolean,
    name: string,
    message: string) {
    this.status = status;
    this.statusText = statusText;
    this.ok = ok;
    this.name = name;
    this.message = message;
  }
}
