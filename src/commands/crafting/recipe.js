'use strict';

const { Command } = require('discord.js-commando');

module.exports = class Recipe extends Command {
  constructor(client) {
    super(client, {
      name: 'recipe',
      group: 'crafting',
      memberName: 'recipe',
      aliases: ['recipes'],
      description: 'Searches the crafting recipes for a specific recipe.',
      args: [
        {
          key: 'recipe',
          type: 'string',
          prompt: 'Specify the recipe or the ID of which you want to know the ingredients.'
        }
      ]
      // Can add a key "args" which includes an array of parameters expected to
      // be passed when using the command, such as recipe id or name or searchString
      // See other commands for examples of args
    });

    this.Craft = client.assets.Crafting.Lib;
  }

  run(msg, { recipe }) {
    var recipesBuffer = this.Craft.parseRecipes(this.Craft.searchRecipes(recipe.trim()));
    if (recipesBuffer.length > 2000) recipesBuffer = 'Too many results. Please narrow your search.';
    return msg.code('ini', recipesBuffer);
    // Insert here the stuff that actually happens when the command is called???
  }
};