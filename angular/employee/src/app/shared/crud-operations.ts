import { PaginatorState } from "primeng/paginator"

export interface CrudOperations {
  addNew: () => void,
  checkSearchFields: () => boolean,
  clear: () => void,
  delete: () => void,
  getAll: () => void,
  goToDetails: (id: number) => void,
  goToEdit: (id: number) => void,
  onKeyUp: () => void,
  onPageChange: (event: PaginatorState) => void,
  refresh: () => void,
  retrieve: () => void,
  search: () => void,
  showDialog: (visible: boolean, id?: number) => void,
}
