import { PageEvent } from "./data-access/page-event.model";

export function buildSearchParams(object: object): string {
  let params = "";
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const value = object[key as keyof object];
    const nextValue = object[nextKey as keyof object];
    if (value) {
      params += `${keys[i]}=${value}`;
      if ((i + 1) !== keys.length && nextValue) {
        params += `&`;
      }
    }
  }
  return params;
}

export function buildPaginationParams(page?: PageEvent): string {
  let queryParams: string = !page?.page ? `page=0` : `page=${page.page}`;
  queryParams += !page?.rows ? `` : `&size=${page.rows}`;
  return queryParams;
}


