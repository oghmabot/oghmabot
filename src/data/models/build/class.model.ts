import { findBestStringMatch } from '../../../utils';

export enum BaseAttackBonusProgression { Half, Medium, Full }

export enum SavingThrowProgression { Low, High }

export enum Class {
  ArcaneArcher,
  Assassin,
  Barbarian,
  Bard,
  Blackguard,
  Cavalier,
  ChampionOfTorm,
  Cleric,
  Commoner,
  DivineChampion = ChampionOfTorm,
  Druid,
  DwarvenDefender,
  EarthkinDefender = DwarvenDefender,
  FavoredSoul,
  Fighter,
  HarperMage,
  HarperParagon,
  HarperPriest,
  HarperScout,
  Hexblade,
  InvisibleBlade,
  PurpleDragonKnight,
  Knight = PurpleDragonKnight,
  Loremaster,
  MasterHarper,
  Monk,
  Paladin,
  PaleMaster,
  Ranger,
  RedDragonDisciple,
  DragonDisciple = RedDragonDisciple,
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
  return findBestStringMatch(nums, str, i => Class[i]);
};
