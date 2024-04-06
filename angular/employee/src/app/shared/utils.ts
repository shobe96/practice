export function buildSearchParams(object: any): string {
  let params: string = "";
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    let value = object[keys[i]];
    if (value !== undefined) {
      params += `${keys[i]}=${value}`;
      if ((i + 1) !== length) {
        params += `&`;
      }
    }

  }
  return params;
}
