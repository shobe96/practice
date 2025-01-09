import { PaginatorState } from "primeng/paginator"

export interface CrudOperations {
  addNew: () => void,
  checkSearchFields: () => boolean,
  clear: () => void,
  delete: () => void,
  getAll: () => void,
  goToDetails: (id: number) => void,
  goToEdit: (id: number | null) => void,
  handleCancel: (event: boolean) => void,
  onKeyUp: () => void,
  onPageChange: (event: PaginatorState) => void,
  refresh: () => void,
  retrieve: () => void,
  search: () => void,
  setEditParams: (editVisible: boolean, id: number | null, modalTitle: string, disable: boolean) => void,
  showDialog: (visible: boolean, id?: number) => void,
}
