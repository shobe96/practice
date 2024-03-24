export class Department {
  id: number;
  name: string;
  addDate: string;
  modDate: string;
  addUser: string;
  modUser: string;
  active: boolean;
  constructor(
    id: number,
    name: string,
    addDate: string,
    modDate: string,
    addUser: string,
    modUser: string,
    active: boolean
  ) {
    this.id = id;
    this.name = name;
    this.addDate = addDate;
    this.modDate = modDate;
    this.addUser = addUser;
    this.modUser = modUser;
    this.active = active;
  }
}
