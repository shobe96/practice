export class Role {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
  constructor(id?: number,
    name?: string,
    code?: string,
    description?: string) {
      this.id = id;
      this.name = name;
      this.code = code;
      this.description = description;
    }
}
