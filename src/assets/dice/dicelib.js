'use strict';

const diceRollRegExp = /^(\d*)(D\d+)((?:[+-]\d*(?:D\d+)?)*)/i;
const rollModifierRegExp = /([+-](?=\d|D)\d*)(D\d+)?/gi;

module.exports =
{
    minimumRoll : minimumRoll,
    
    maximumRoll : maximumRoll,
    
    averageRoll : averageRoll,
    
    randomRoll : randomRoll
	
}

function minimumRoll(dice){
    return new Promise( async (resolve,reject) => {
        var baseRoll = dice.match(diceRollRegExp);
        const baseMultiplier = parseInt(baseRoll[1]) || 1;
        const baseDie = 1;
        
        var totalRoll = baseMultiplier * baseDie;
        
        getMatches(baseRoll[3],rollModifierRegExp).forEach( modifiers =>
        {
            var sign = modifiers[1].charAt(0);
            const baseMultiplier = parseInt(modifiers[1].slice(1)) || 1;
            
            switch (sign)
            {
                case "+":
                    if (modifiers[2])
                    {
                        totalRoll += baseMultiplier;
                        
                    }
                    else
                    {
                        totalRoll += baseMultiplier; 
                    }
                    break;
                case "-":
                    if (modifiers[2])
                    {
                        totalRoll -= baseMultiplier * parseInt(modifiers[2].slice(1));
                        
                    }
                    else
                    {
                        totalRoll -= baseMultiplier; 
                    }
                    break;
            }
        });
        resolve (totalRoll); 
    });
}

function maximumRoll(dice){
    return new Promise( async (resolve,reject) => {
        var baseRoll = dice.match(diceRollRegExp);
        const baseMultiplier = parseInt(baseRoll[1]) || 1;
        const baseDie = parseInt(baseRoll[2].slice(1));
        
        var totalRoll = baseMultiplier * baseDie;
        
        getMatches(baseRoll[3],rollModifierRegExp).forEach( modifiers =>
        {
            var sign = modifiers[1].charAt(0);
            const baseMultiplier = parseInt(modifiers[1].slice(1)) || 1;
            
            switch (sign)
            {
                case "+":
                    if (modifiers[2])
                    {
                        totalRoll += baseMultiplier * parseInt(modifiers[2].slice(1));
                    }
                    else
                    {
                        totalRoll += baseMultiplier; 
                    }
                    break;
                case "-":
                    if (modifiers[2])
                    {
                        totalRoll -= baseMultiplier;
                    }
                    else
                    {
                        totalRoll -= baseMultiplier; 
                    }
                    break;
            }
        });
        resolve (totalRoll); 
        
    });
}

function averageRoll(dice){
    return new Promise( async (resolve,reject) => {
        const avgRoll = (await minimumRoll(dice) + await maximumRoll(dice))/2;
        resolve(avgRoll);
    });
}

function randomRoll(dice){
    return new Promise( async (resolve,reject) => {
        var baseRoll = dice.match(diceRollRegExp);
        const baseDie = parseInt(baseRoll[2].slice(1));
        var totalRoll = 0;
        const baseMultiplier = parseInt(baseRoll[1]) || 1;
        
        for (var i = 0; i < baseMultiplier; i++)
        {
            totalRoll += Math.floor(Math.random() * baseDie) + 1;
        }
        
        getMatches(baseRoll[3],rollModifierRegExp).forEach( modifiers =>
        {
            var sign = modifiers[1].charAt(0);
            const baseMultiplier = parseInt(modifiers[1].slice(1)) || 1;
            
            switch (sign)
            {
                case "+":
                    if (modifiers[2])
                    {
                        for (var i = 0; i < baseMultiplier; i++)
                        {
                            totalRoll += Math.floor(Math.random() * parseInt(modifiers[2].slice(1))) + 1;
                        }
                    }
                    else
                    {
                        totalRoll += baseMultiplier; 
                    }
                    break;
                case "-":
                    if (modifiers[2])
                    {
                        for (var i = 0; i < baseMultiplier; i++)
                        {
                            totalRoll -= Math.floor(Math.random() * parseInt(modifiers[2].slice(1))) + 1;
                        }
                    }
                    else
                    {
                        totalRoll -= baseMultiplier; 
                    }
                    break;
            }
        });
        resolve (totalRoll); 
        
    });
}

function getMatches(str, regex) {
    var matches = [];
    var match;

    if (regex.global) {
        regex.lastIndex = 0;
    } else {
        regex = new RegExp(regex.source, 'g' +
            (regex.ignoreCase ? 'i' : '') +
            (regex.multiline ? 'm' : '') +
            (regex.sticky ? 'y' : ''));
    }

    while (match = regex.exec(str)) {

        matches.push(match);

        if (regex.lastIndex === match.index) {
            regex.lastIndex++;
        }
    }

    return matches;
}