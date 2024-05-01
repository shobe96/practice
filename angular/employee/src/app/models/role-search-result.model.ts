import { Role } from "./role";

export class RoleSearchResult {
  size?: number;
  roles?: Role[];

  constructor(
    size?: number,
    roles?: Role[]
  ) {
    this.size = size;
    this.roles = roles;
  }
}
