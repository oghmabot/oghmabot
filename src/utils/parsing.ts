const { BOT_PREFIX = '-' } = process.env;

export const KeepAlphaNumericRegExp = /[^a-z0-9æøå]/ig;

export function findBestStringMatch(arr: string[], searchTerm: string): string | undefined;
export function findBestStringMatch<T>(arr: T[], searchTerm: string, strResFunc: (el: T) => string | undefined): T | undefined;
export function findBestStringMatch<T>(arr: T[], searchTerm: string, strResFunc?: (el: T) => string | undefined): T | undefined {
  searchTerm = searchTerm?.toLowerCase().replace(KeepAlphaNumericRegExp, '');
  return arr.reduce<T | undefined>((prev, cur) => {
    const prevStr = (typeof prev === 'string'
      ? strResFunc ? strResFunc(prev) : prev
      : strResFunc && prev ? strResFunc(prev) : undefined)?.toLowerCase().replace(KeepAlphaNumericRegExp, '');
    const curStr = (typeof cur === 'string'
      ? strResFunc ? strResFunc(cur) : cur
      : strResFunc ? strResFunc(cur) : undefined)?.toLowerCase().replace(KeepAlphaNumericRegExp, '');

    return curStr?.includes(searchTerm) && (!prevStr || curStr.replace(searchTerm, '').length < prevStr.replace(searchTerm, '').length)
      ? cur
      : prev;
  }, undefined);
}

export const getUntilLastWithin = (inp: string, until: string, within: number): string => inp.substring(0, 1 + inp.substring(0, within).lastIndexOf(until));

export const stripCommandNotation = (inp: string): string => inp.replace(new RegExp(`^[${BOT_PREFIX}][a-z]+`), '');

export const trimPunctuationAndWhitespace = (inp: string): string => inp.replace(/(^[,. ]+)|([,. ]+$)/g, '');
