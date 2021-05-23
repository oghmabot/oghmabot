import { Class, getClass, getStats } from './class.model';

describe('class.model', () => {
  describe('getClass', () => {
    it.each([
      [['arcane', 'arcane archer', 'aa'], Class.ArcaneArcher],
      [['assassin', 'ass'], Class.Assassin],
      [['barbarian', 'barb', 'bb'], Class.Barbarian],
      [['bard', 'b'], Class.Bard],
      [['blackguard', 'bg'], Class.Blackguard],
      [['cavalier', 'cav'], Class.Cavalier],
      [['champion of torm', 'cot', 'ct', 'divine champion', 'champion', 'dc'], Class.ChampionOfTormDivineChampion],
      [['cleric', 'cl'], Class.Cleric],
      [['commoner'], Class.Commoner],
      [['druid', 'dr'], Class.Druid],
      [['dwarven defender', 'dd', 'defender', 'earthkin defender', 'earthkin', 'ed', 'ekd'], Class.DwarvenDefenderEarthkinDefender],
      [['favored soul', 'fs'], Class.FavoredSoul],
      [['fighter', 'f', 'ftr'], Class.Fighter],
      [['harper mage', 'hmage', 'hm'], Class.HarperMage],
      [['harper paragon', 'paragon', 'hp'], Class.HarperParagon],
      [['harper priest', 'priest', 'hpr'], Class.HarperPriest],
      [['harper scout', 'scout', 'hs'], Class.HarperScout],
      [['hexblade', 'hex'], Class.Hexblade],
      [['invisible blade', 'ib'], Class.InvisibleBlade],
      [['purple dragon knight', 'pdk', 'knight', 'k'], Class.PurpleDragonKnight],
      [['loremaster', 'lm'], Class.Loremaster],
      [['master harper', 'mh'], Class.MasterHarper],
      [['monk', 'm'], Class.Monk],
      [['paladin', 'pal'], Class.Paladin],
      [['pale master', 'palemaster', 'pm'], Class.PaleMaster],
      [['ranger', 'r'], Class.Ranger],
      [['red dragon disciple', 'rdd', 'dragon disciple', 'dragon', 'disciple'], Class.RedDragonDisciple],
      [['rogue', 'rg'], Class.Rogue],
      [['shadow mage', 'sm'], Class.ShadowMage],
      [['shadowdancer', 'sd'], Class.Shadowdancer],
      [['shaman', 'sha'], Class.Shaman],
      [['shifter'], Class.Shifter],
      [['sorcerer', 'sorc'], Class.Sorcerer],
      [['specialist', 'spec'], Class.Specialist],
      [['spellsword', 'ss'], Class.Spellsword],
      [['swashbuckler', 'swash'], Class.Swashbuckler],
      [['warlock', 'lock'], Class.Warlock],
      [['weapon master', 'wm'], Class.WeaponMaster],
      [['wild mage', 'wild'], Class.WildMage],
      [['wizard', 'wiz'], Class.Wizard],
      [['zhentarim enforcer', 'enforcer'], Class.ZhentarimEnforcer],
      [['zhentarim fear speaker', 'fear speaker', 'fearspeaker'], Class.ZhentarimFearSpeaker],
      [['zhentarim naug-adar', 'naug-adar', 'naugadar', 'naug'], Class.ZhentarimNaugadar],
      [['zhentarim operative', 'operative'], Class.ZhentarimOperative],
    ])('should return the expected class', (str, expected) => str.forEach(s => expect(getClass(s)).toBe(expected)));
  });

  describe('getStats', () => {
    it.each([
      [
        [
          { class: Class.ArcaneArcher, level: 1 },
          { class: Class.Assassin, level: 1},
          { class: Class.Barbarian, level: 1 },
          { class: Class.Bard, level: 1 },
        ],
      ],
      [
        [
          { class: Class.ArcaneArcher, level: 31 },
        ],
      ],
      [
        [
          { class: Class.ArcaneArcher, level: 27 },
          { class: Class.Barbarian, level: 4 },
        ],
      ],
    ])('should throw errors', (classLevels) => expect(() => getStats(...classLevels)).toThrow());

    it.each([
      [
        [
          { class: Class.Bard, level: 13 },
          { class: Class.Blackguard, level: 4 },
          { class: Class.Bard, level: 13 },
        ],
        {
          totalLevels: 30,
          bab: 21,
          fortitude: 14,
          reflex: 16,
          will: 16,
        },
      ],
      [
        [
          { class: Class.Bard, level: 16 },
          { class: Class.Blackguard, level: 4 },
          { class: Class.Bard, level: 10 },
        ],
        {
          totalLevels: 30,
          bab: 21,
          fortitude: 14,
          reflex: 16,
          will: 16,
        },
      ],
    ])('should return correct stats', (classLevels, expected) => expect(getStats(...classLevels)).toEqual(expected));
  });
});
