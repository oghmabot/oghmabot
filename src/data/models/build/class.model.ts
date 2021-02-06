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
