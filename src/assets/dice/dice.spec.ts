import { rollAny, rollSingleDie } from './dice';

describe('Dice', () => {

  /**
   * ROLL ANY
   */
  describe('rollAny', () => {
    it('should not throw errors on correctly formatted string', () => {
      expect(() => rollAny('2d100')).not.toThrow();
    });
  });

  /**
   * ROLL SINGLE DIE
   */
  describe('rollSingleDie', () => {
    it('should return between 1 and 10', () => {
      const { result } = rollSingleDie(10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

});
