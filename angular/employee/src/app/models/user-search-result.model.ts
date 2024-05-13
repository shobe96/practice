import { User } from "./user.model";

export class UserSearchResult {
  users?: User[];
  size?: number;

  constructor(users?: User[],
    size?: number) {
    this.users = users;
    this.size = size;
  }
}
