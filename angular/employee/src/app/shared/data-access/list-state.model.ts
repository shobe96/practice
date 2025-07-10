import { PageEvent } from "./page-event.model";

export interface ListState<T> {
  data: T[],
  page: PageEvent,
  rowsPerPage: number[],
  loading: boolean
}
