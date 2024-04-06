export class PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
  sort: string;

  constructor(first: number,
    rows: number,
    page: number,
    pageCount: number,
    sort: string) {
      this.first = first;
      this.rows = rows;
      this.page = page;
      this.pageCount = pageCount;
      this.sort = sort;
    }
}
