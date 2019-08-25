'use strict';

module.exports = {
  Arelith: {
    Status: require('./arelith/statuslib'),
    Update: require('./arelith/updatelib.js')
  },
  Crafting: {
    Craft: require('./crafting/Craft.json'),
    Lib: require('./crafting/craftinglib.js')
  },
  Dice: require('./dice/dicelib.js'),
  Lore: {
    Deity: require('./lore/deitylib.js')
  }
};
