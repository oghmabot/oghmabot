'use strict';

const {Command} = require('discord.js-commando');
const Commando = require('discord.js-commando');

module.exports = class Ingredient extends Command {
  constructor(client) {
    super(client, {
      name: 'ingredient',
      group: 'crafting',
      memberName: 'ingredient',
      aliases: ['ingredients'],
      description: 'Searches the crafting recipes for a specific ingredient.',
	  args: [
        {
          key: 'ingredient',
          type: 'string',
          prompt: 'Specify the ingredient for which you want to find recipes.'
        }
      ]
      // Can add a key "args" which includes an array of parameters expected to
      // be passed when using the command, such as recipe id or name or searchString
      // See other commands for examples of args
    });

    this.Craft = client.assets.Crafting.Lib;
  }

  async run(msg, {ingredient} ) {

    const searchResults = this.Craft.searchIngredients(ingredient.trim());
    var formattedResult;
    if (Object.keys(searchResults).length == 0)
    {
      formattedResult = `No recipes found which use ${ingredient.trim()}.`;
    }
    else if (Object.keys(searchResults).length == 1)
    {
      formattedResult = formatToIngredient(this.Craft.parseRecipes(searchResults[Object.keys(searchResults)[0]]), Object.keys(searchResults)[0]);
    }
    else
    {
      formattedResult = 'Ingredient not specified.';
      const optionsIngredients = Object.keys(searchResults);
      const optionsNumbers = [...Array(Object.keys(searchResults).length).keys()].map(x => ++x);
      var formattedPrompt = 'Please specify an ingredient:';
      for (var i = 1; i <= optionsIngredients.length; i++)
      {
        formattedPrompt += `\n${i}. ${optionsIngredients[i-1]}`;
      }
      const ingredientPicker = new Commando.ArgumentCollector(msg.client,
        [
          {
            key: 'specificIngredient',
            prompt: formattedPrompt,
            type: 'string',
          }
        ],
        1
      );

      const ingredientSelection = await ingredientPicker.obtain(msg, [], 1);
      if (ingredientSelection.values)
      {
        for (var i =0; i < optionsIngredients.length; i++)
        {
          if (optionsIngredients[i].toLowerCase().replace(/\s+/g,'') == ingredientSelection.values.specificIngredient.toLowerCase().replace(/\s+/g,'')
                    || parseInt(ingredientSelection.values.specificIngredient) == i+1)
          {
            formattedResult = formatToIngredient(this.Craft.parseRecipes(searchResults[optionsIngredients[i]]), optionsIngredients[i]);
            break;
          }

        }
      }
      ingredientSelection.prompts[0].delete();
    }

    if (formattedResult.length > 2000) formattedResult = 'Too many results. Please narrow your search.';
	  return msg.code('ini', formattedResult);
    // Insert here the stuff that actually happens when the command is called???
  }
};

function formatToIngredient(recipes, ingredient)
{
  return recipes.replace('found:', `found which use ${ingredient}:`);
}