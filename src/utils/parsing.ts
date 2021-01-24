const { BOT_PREFIX = '-' } = process.env;

export const stripCommandNotation = (inp: string): string => inp.replace(new RegExp(`^[${BOT_PREFIX}][a-z]+`), '');

export const trimPunctuationAndWhitespace = (inp: string): string => inp.replace(/(^[,. ]+)|([,. ]+$)/g, '');

export function findBestStringMatch(arr: string[], searchTerm: string): string | undefined;
export function findBestStringMatch<T>(arr: T[], searchTerm: string, strResFunc: (el: T) => string | undefined): T | undefined;
export function findBestStringMatch<T>(arr: T[], searchTerm: string, strResFunc?: (el: T) => string | undefined): T | undefined {
  searchTerm = searchTerm?.toLowerCase().replace(/\s+/g, '');
  return arr.reduce<T | undefined>((prev, cur) => {
    const prevStr = (typeof prev === 'string'
      ? strResFunc ? strResFunc(prev) : prev
      : strResFunc && prev ? strResFunc(prev) : undefined)?.toLowerCase().replace(/\s+/g, '');
    const curStr = (typeof cur === 'string'
      ? strResFunc ? strResFunc(cur) : cur
      : strResFunc ? strResFunc(cur) : undefined)?.toLowerCase().replace(/\s+/g, '');

    return curStr?.includes(searchTerm) && (!prevStr || curStr.replace(searchTerm, '').length < prevStr.replace(searchTerm, '').length)
      ? cur
      : prev;
  }, undefined);
}
