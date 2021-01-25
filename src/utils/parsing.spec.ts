import { findBestStringMatch, getUntilLastWithin, stripCommandNotation, trimPunctuationAndWhitespace } from './parsing';

describe('parsing', () => {
  describe('findBestStringMatch', () => {
    interface ExampleObject { name: string; }
    const getName = (obj: ExampleObject) => obj.name;
    const names: ExampleObject[] = [
      { name: 'Azuth' },
      { name: 'Arrur' },
      { name: 'Astra' },
      { name: 'Armag' },
      { name: 'Shar' },
      { name: 'Share' },
      { name: 'Shares' },
      { name: 'Sharess' },
    ];

    it.each([
      [names.map(obj => obj.name), 'az', 'Azuth'],
      [names.map(obj => obj.name), 'shar', 'Shar'],
    ])('should return the expected match', (arr, str, expected) => expect(findBestStringMatch(arr, str)).toBe(expected));

    it.each([
      [names, 'az', getName, { name: 'Azuth' }],
      [names, 'shar', getName, { name: 'Shar' }],
    ])('should return the expected object', (arr, str, func, expected) => expect(findBestStringMatch(arr, str, func)).toEqual(expected));
  });

  describe('getUntilLastWithin', () => {
    it.each([
      ['Short. Simple.', '.', 10, 'Short.'],
    ])('should return the expected string', (inp, until, within, expected) => expect(getUntilLastWithin(inp, until, within)).toBe(expected));
  });

  describe('stripCommandNotation', () => {
    it.each([
      ['-deity azuth', ' azuth'],
      ['-roll d20', ' d20'],
    ])('should return the expected string', (str, expected) => expect(stripCommandNotation(str)).toBe(expected));
  });

  describe('trimPunctuationAndWhitespace', () => {
    it.each([
      [' Short. Simple, ', 'Short. Simple'],
    ])('should return the expected string', (str, expected) => expect(trimPunctuationAndWhitespace(str)).toBe(expected));
  });
});
