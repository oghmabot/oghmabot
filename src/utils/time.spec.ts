import { calculateTimeBetween, convertMillisecondsToTimestamp } from './time';

describe('time', () => {
  describe('calculateTimeBetween', () => {
    it.each([
      [1610897406, 1610904850, 7444000],
    ])('should return expected number', (a, b, expected) => expect(calculateTimeBetween(a, b)).toBe(expected));
  });

  describe('convertMillisecondsToTimestamp', () => {
    it.each([
      [7444000, '02:04:04'],
      [86399999, '23:59:59'],
      [86400000, '24:00:00'],
      [96400000, '26:46:40'],
    ])('should return expected string', (ms, expected) => expect(convertMillisecondsToTimestamp(ms)).toBe(expected));
  });
});
