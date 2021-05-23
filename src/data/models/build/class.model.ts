import { FriendlyError } from 'discord.js-commando';
import { KeepAlphaNumericRegExp, findBestStringMatch } from '../../../utils';

export enum BaseAttackBonusProgression { Half, Medium, Full }

export enum SavingThrowProgression { Low, High }

export enum Class {
  ArcaneArcher,
  Assassin,
  Barbarian,
  Bard,
  Blackguard,
  Cavalier,
  ChampionOfTormDivineChampion,
  Cleric,
  Commoner,
  Druid,
  DwarvenDefenderEarthkinDefender,
  FavoredSoul,
  Fighter,
  HarperMage,
  HarperParagon,
  HarperPriest,
  HarperScout,
  Hexblade,
  InvisibleBlade,
  PurpleDragonKnight,
  Loremaster,
  MasterHarper,
  Monk,
  Paladin,
  PaleMaster,
  Ranger,
  RedDragonDisciple,
  Rogue,
  ShadowMage,
  Shadowdancer,
  Shaman,
  Shifter,
  Sorcerer,
  Specialist,
  Spellsword,
  Swashbuckler,
  Warlock,
  WeaponMaster,
  WildMage,
  Wizard,
  ZhentarimEnforcer,
  ZhentarimFearSpeaker,
  ZhentarimNaugadar,
  ZhentarimOperative,
}

export interface ClassLevelNotation {
  class: Class;
  level: number;
}

export interface Stats {
  totalLevels: number;
  bab: number;
  fortitude: number;
  reflex: number;
  will: number;
}

export const getStats = (...classLevels: ClassLevelNotation[]): Stats => {
  const { preEpicClasses, levels } = classLevels.reduce<{ preEpicClasses: Record<number, number>; levels: number; }>((acc, cur) => {
    const { preEpicClasses, levels } = acc;
    const newTotal = levels + cur.level;

    preEpicClasses[cur.class] = preEpicClasses[cur.class]
      ? preEpicClasses[cur.class] + cur.level
      : cur.level;

    if (newTotal > 20) {
      const epic = newTotal - 20;
      preEpicClasses[cur.class] -= epic;
    }

    return {
      preEpicClasses,
      levels: newTotal,
    };
  }, {
    preEpicClasses: {},
    levels: 0,
  });

  if (Object.keys(preEpicClasses).length > 3) throw new FriendlyError(`Too many classes given (${Object.keys(preEpicClasses).length}). Maximum is 3.`);
  if (levels > 30) throw new FriendlyError(`Too many levels given (${levels}). Maximum is 30.`);

  const epicLevels = levels - 20;
  const epicBab = calculateEpicBaseAttackBonusIncrease(epicLevels);
  const epicSaves = calculateEpicSavingThrowIncrease(epicLevels);

  const stats = {
    totalLevels: levels,
    bab: epicBab,
    fortitude: epicSaves,
    reflex: epicSaves,
    will: epicSaves,
  };

  for (const cl in preEpicClasses) {
    const classLevels = preEpicClasses[cl];
    stats.bab += calculateBaseAttackBonus(classLevels, getBaseAttackBonusProgression(parseInt(cl)));
    stats.fortitude += calculateSavingThrow(classLevels, getFortitudeProgression(parseInt(cl)));
    stats.reflex += calculateSavingThrow(classLevels, getReflexProgression(parseInt(cl)));
    stats.will += calculateSavingThrow(classLevels, getReflexProgression(parseInt(cl)));
  }

  return stats;
};

export const calculateBaseAttackBonus = (levels: number, progression: BaseAttackBonusProgression): number =>
  progression === BaseAttackBonusProgression.Full
    ? levels
    : progression === BaseAttackBonusProgression.Half ? Math.floor(levels * 0.5) : Math.floor(levels * 0.75);

export const calculateSavingThrow = (levels: number, progression: SavingThrowProgression): number =>
  progression === SavingThrowProgression.High
    ? 2 + Math.floor(levels / 2)
    : Math.floor(levels / 3);

export const calculateEpicBaseAttackBonusIncrease = (levels: number): number => Math.ceil(levels / 2);

export const calculateEpicSavingThrowIncrease = (levels: number): number => Math.floor(levels / 2);

export const getClass = (str: string): Class | undefined => {
  if (!str) return;
  const nums = [...Array(Object.values(Class).length).keys()];
  switch (str.toLowerCase().replace(KeepAlphaNumericRegExp, '')) {
    case 'aa': return Class.ArcaneArcher;
    case 'bb': return Class.Barbarian;
    case 'b': return Class.Bard;
    case 'bg': return Class.Blackguard;
    case 'ct':
    case 'cot':
    case 'dc': return Class.ChampionOfTormDivineChampion;
    case 'cl': return Class.Cleric;
    case 'dd':
    case 'ekd':
    case 'ed': return Class.DwarvenDefenderEarthkinDefender;
    case 'fs': return Class.FavoredSoul;
    case 'f':
    case 'ftr': return Class.Fighter;
    case 'hm':
    case 'hmage': return Class.HarperMage;
    case 'hp': return Class.HarperParagon;
    case 'hpr': return Class.HarperPriest;
    case 'hs': return Class.HarperScout;
    case 'ib': return Class.InvisibleBlade;
    case 'pdk':
    case 'k': return Class.PurpleDragonKnight;
    case 'lm': return Class.Loremaster;
    case 'mh': return Class.MasterHarper;
    case 'm': return Class.Monk;
    case 'pm': return Class.PaleMaster;
    case 'r': return Class.Ranger;
    case 'rdd': return Class.RedDragonDisciple;
    case 'rg': return Class.Rogue;
    case 'sm': return Class.ShadowMage;
    case 'sd': return Class.Shadowdancer;
    case 'ss': return Class.Spellsword;
    case 'wm': return Class.WeaponMaster;
    default: return findBestStringMatch(nums, str, i => Class[i]);
  }
};

export const getProgressions = (c: Class): number[] => {
  switch (c) {
    case Class.ArcaneArcher: return [2, 1, 1, 0];
    case Class.Assassin: return [1, 0, 1, 0];
    case Class.Barbarian: return [2, 1, 0, 0];
    case Class.Bard: return [1, 0, 1, 1];
    case Class.Blackguard: return [2, 1, 0, 0];
    case Class.Cavalier: return [2, 1, 0, 0];
    case Class.ChampionOfTormDivineChampion: return [2, 1, 1, 0];
    case Class.Cleric: return [1, 1, 0, 1];
    case Class.Commoner: return [0, 1, 0, 0];
    case Class.Druid: return [1, 1, 0, 1];
    case Class.DwarvenDefenderEarthkinDefender: return [2, 1, 0, 1];
    case Class.FavoredSoul: return [1, 1, 1, 1];
    case Class.Fighter: return [2, 1, 0, 0];
    case Class.HarperMage: return [1, 0, 1, 1];
    case Class.HarperParagon: return [2, 0, 1, 1];
    case Class.HarperPriest: return [1, 0, 1, 1];
    case Class.HarperScout: return [1, 0, 1, 1];
    case Class.Hexblade: return [2, 1, 0, 0];
    case Class.InvisibleBlade: return [2, 0, 1, 0];
    case Class.PurpleDragonKnight: return [2, 1, 0, 0];
    case Class.Loremaster: return [1, 0, 1, 1];
    case Class.MasterHarper: return [1, 0, 1, 1];
    case Class.Monk: return [1, 1, 1, 1];
    case Class.Paladin: return [2, 1, 0, 0];
    case Class.PaleMaster: return [0, 1, 0, 1];
    case Class.Ranger: return [2, 1, 0, 0];
    case Class.RedDragonDisciple: return [1, 1, 0, 1];
    case Class.Rogue: return [1, 0, 1, 0];
    case Class.Shadowdancer: return [1, 0, 1, 0];
    case Class.Shaman: return [1, 1, 0, 1];
    case Class.Shifter: return [1, 1, 1, 0];
    case Class.Sorcerer: return [0, 0, 0, 1];
    case Class.Spellsword: return [1, 0, 0, 1];
    case Class.Swashbuckler: return [2, 1, 1, 0];
    case Class.Warlock: return getProgressions(Class.Bard);
    case Class.WeaponMaster: return [2, 0, 1, 0];
    case Class.WildMage: return [0, 0, 0, 1];
    case Class.Wizard: return [0, 0, 0, 1];
    case Class.ZhentarimEnforcer: return [2, 0, 1, 1];
    case Class.ZhentarimFearSpeaker: return [1, 0, 1, 1];
    case Class.ZhentarimNaugadar: return [1, 0, 1, 1];
    case Class.ZhentarimOperative: return [1, 0, 1, 1];
    default: return [0, 0, 0, 0];
  }
};

export const getBaseAttackBonusProgression = (c: Class): BaseAttackBonusProgression => getProgressions(c)[0];

export const getFortitudeProgression = (c: Class): SavingThrowProgression => getProgressions(c)[1];

export const getReflexProgression = (c: Class): SavingThrowProgression => getProgressions(c)[2];

export const getWillProgression = (c: Class): SavingThrowProgression => getProgressions(c)[3];
