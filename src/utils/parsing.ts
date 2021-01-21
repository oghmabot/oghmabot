export function findBestStringMatch(arr: string[], searchTerm: string): string | undefined;
export function findBestStringMatch<T>(arr: T[], searchTerm: string, strResFunc: (el: T) => string | undefined): T | undefined;
export function findBestStringMatch<T>(arr: T[], searchTerm: string, strResFunc?: (el: T) => string | undefined): T | undefined {
  return arr.reduce<T | undefined>((prev, cur) => {
    const prevStr = typeof prev === 'string'
      ? strResFunc ? strResFunc(prev) : prev
      : strResFunc && prev ? strResFunc(prev) : undefined;
    const curStr = typeof cur === 'string'
      ? strResFunc ? strResFunc(cur) : cur
      : strResFunc ? strResFunc(cur) : undefined;

    return curStr?.includes(searchTerm) && (!prevStr || curStr.replace(searchTerm, '').length < prevStr.replace(searchTerm, '').length)
      ? cur
      : prev;
  }, undefined);
}
