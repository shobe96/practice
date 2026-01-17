import { PageEvent } from "./data-access/page-event.model";

export function buildSearchParams(object: object, prefix = ''): string {
  return Object.entries(object).flatMap(([key, value]) => {
    if (value === null || value === undefined || value === '') return [];

    const paramKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      return value.flatMap((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return buildSearchParams(item, `${paramKey}[${index}]`);
        } else {
          return `${encodeURIComponent(paramKey)}=${encodeURIComponent(item)}`;
        }
      });
    }

    if (typeof value === 'object') {
      return buildSearchParams(value, paramKey);
    }

    return `${encodeURIComponent(paramKey)}=${encodeURIComponent(value)}`;
  }).join('&');
}

export function buildPaginationParams(page?: PageEvent): string {
  if (!page) return '';
  return `page=${page.page}&size=${page.rows}`;
}


