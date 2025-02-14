import { PageEvent } from "../models/page-event.model";

export function buildSearchParams(object: any): string {
  let params: string = "";
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const value = object[keys[i]];
    const nextValue = object[keys[i + 1]];
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

export function fireToast(severity: string, summary: string, detail: string, messageService: any): void {
  messageService.add({ severity: severity, summary: summary, detail: detail });
}


