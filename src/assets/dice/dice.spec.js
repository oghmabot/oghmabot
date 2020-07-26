const { rollSingleDie } = require('./dice');

describe('die rolls', () => {

  describe('anyRoll', () => {

  });

  describe('rollSingleDie', () => {
    it('should return between 1 and 10', () => {
      const result = rollSingleDie(10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

});
