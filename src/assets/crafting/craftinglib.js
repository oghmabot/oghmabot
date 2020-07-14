'use strict';

const cTable = require('./Craft.json');
const TradeSkill = [ 'Carpentry' , 'Herbalism' , 'Art Crafting' , 'Forging', 'Alchemy' , 'Tailoring' ];

module.exports =
{
  searchRecipes: function(recipe)
  {
    var output = {};
    TradeSkill.forEach( function(skill) {
      output[skill] = [];
    });
    var recipeCount = 0;
    for (var i in cTable) 
    {
      if (((recipe.length >= 2) && cTable[i].Name.toLowerCase().replace(/\s+/g,'').indexOf(recipe.toLowerCase().replace(/\s+/g,'')) !== -1) || cTable[i].id == recipe)
      {
        recipeCount++;
        output[TradeSkill[cTable[i].Craft-1]].push({Name: cTable[i].Name, ID: cTable[i].id, Ingredients: cTable[i].Input});	
      } 
    }
    return output;
  },
    
  parseRecipes: function (recipesObject)
  {
    var sOutput;
    var recipeCount = 0;
    for (var trade in recipesObject)
    {
      recipeCount += recipesObject[trade].length;
    }
    if (recipeCount == 1)
    {
      for (var j in recipesObject)
      {
        if (recipesObject[j].length > 0)
        {
          sOutput = 'The recipe for ' + recipesObject[j][0].Name + ' (ID:' + ('000' + recipesObject[j][0].ID).slice(-4) + ') in [' + j + '] is:';
          for (var i in recipesObject[j][0].Ingredients)
          {
            sOutput += '\n\t' + recipesObject[j][0].Ingredients[i].Qty + ' x ' + recipesObject[j][0].Ingredients[i].Name;
          }
        }
      }	
			
    }
    else if (recipeCount > 1)
    {
      sOutput = recipeCount + ' recipes found:';
      for (var j in recipesObject)
      {
        if (recipesObject[j].length > 0)
        {
          sOutput += '\n\n['+j+ ']:';
          recipesObject[j].sort(function(a, b){
            if(a.Name < b.Name) { return -1; }
            if(a.Name > b.Name) { return 1; }
            return 0;
          });
          for (var i in recipesObject[j])
          {
            sOutput += '\n\t(ID:' + ('000' + recipesObject[j][i].ID).slice(-4) + ') ' + recipesObject[j][i].Name;
          }
        }
      }
			
    }
    else
    {
      sOutput = 'No recipes found.';
    }
    return sOutput; 

  },
	
  searchIngredients: function(ingredient)
  {
    var ingredientList = {};
    for (var i in cTable) 
    {
      for (var j in cTable[i].Input)
      {
        if (((ingredient.length >= 2) && cTable[i].Input[j].Name.toLowerCase().replace(/\s+/g,'').indexOf(ingredient.toLowerCase().replace(/\s+/g,'')) !== -1))
        {
          if (!ingredientList.hasOwnProperty(cTable[i].Input[j].Name)){
            ingredientList[cTable[i].Input[j].Name] = {};
            TradeSkill.forEach( function(skill) {
              ingredientList[cTable[i].Input[j].Name][skill] = [];
            });
          }
                    
          ingredientList[cTable[i].Input[j].Name][TradeSkill[cTable[i].Craft-1]].push({Name: cTable[i].Name, ID: cTable[i].id, Ingredients: cTable[i].Input});
        }
      }				
    }
    return ingredientList;
  }

	
	
	
	

};