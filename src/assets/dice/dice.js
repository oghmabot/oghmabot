'use strict';

const diceRollRegExp = /^(\d*)(D\d+)((?:[+-]\d*(?:D\d+)?)*)/i;

const rollAny = (input) => {
  const baseRoll = input.match(diceRollRegExp);
  const baseDie = parseInt(baseRoll[2].slice(1));
  const baseMultiplier = parseInt(baseRoll[1]) || 1;

  let result = 0;
  for(let i = 0; i < baseMultiplier; i++) {
    result += rollSingleDie(baseDie);
  }
  return result;
};

const rollSingleDie = (die) => Math.floor((Math.random() * parseInt(die)) + 1);

module.exports = {
  rollAny,
  rollSingleDie,
};
