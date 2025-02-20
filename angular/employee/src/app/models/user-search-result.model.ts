import { User } from "./user.model";

export interface UserSearchResult {
  users?: User[];
  size?: number;
}
