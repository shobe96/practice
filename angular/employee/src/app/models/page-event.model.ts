export class PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;

  constructor(first: number,
    rows: number,
    page: number,
    pageCount: number) {
      this.first = first;
      this.rows = rows;
      this.page = page;
      this.pageCount = pageCount;
    }
}
