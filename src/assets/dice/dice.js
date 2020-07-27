'use strict';

const diceRollRegExp = /^(\d*)(D\d+)((?:[+-]\d*(?:D\d+)?)*)/i;

const rollAny = (input) => {
  const baseRoll = input.match(diceRollRegExp);
  const baseDie = parseInt(baseRoll[2].slice(1));
  const baseMultiplier = parseInt(baseRoll[1]) || 1;

  let result = 0;
  for(let i = 0; i < baseMultiplier; i++) {
    result += rollSingleDie(baseDie).result;
  }
  return Roll(baseDie, baseMultiplier, result);
};

const rollSingleDie = (die) => Roll(die, 1, Math.floor((Math.random() * parseInt(die)) + 1));

const Roll = (die, multiplier, result) => {
  return {
    die,
    multiplier,
    result,
    rollString: `${multiplier}d${die}`,
  };
};

module.exports = {
  diceRollRegExp,
  rollAny,
  rollSingleDie,
};
