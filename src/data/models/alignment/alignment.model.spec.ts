import { Alignment, getAlignment } from './alignment.model';

describe('alignment.model', () => {
  describe('getAlignment', () => {
    it.each([
      ['lawful good', Alignment.LG], ['lg', Alignment.LG],
      ['neutral good', Alignment.NG], ['ng', Alignment.NG],
      ['chaotic good', Alignment.CG], ['cg', Alignment.CG],
      ['lawful neutral', Alignment.LN], ['ln', Alignment.LN],
      ['true neutral', Alignment.TN], ['tn', Alignment.TN],
      ['chaotic neutral', Alignment.CN], ['cn', Alignment.CN],
      ['lawful evil', Alignment.LE], ['le', Alignment.LE],
      ['neutral evil', Alignment.NE], ['ne', Alignment.NE],
      ['chaotic evil', Alignment.CE], ['ce', Alignment.CE],
    ])('should return the expected alignment', (str, expected) => expect(getAlignment(str)).toBe(expected));

    it.each(['na', 'none', 'no alignment'])('should return no alignment', str => expect(getAlignment(str)).toBe(Alignment.NA));

    it.each(['', 'rofl', 'lmao', 'dolphins'])('should return undefined', str => expect(getAlignment(str)).toBeUndefined());
  });
});
