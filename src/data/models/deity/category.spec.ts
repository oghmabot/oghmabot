import { DeityCategory, getDeityCategory } from './category.model';

describe('category.model', () => {
  describe('getDeityCategory', () => {
    it.each([
      [['dark seldarine', 'drow'], DeityCategory.Drow],
      [['demigods', 'demi'], DeityCategory.Demigods],
      [['draconic pantheon', 'draconic'], DeityCategory.Draconic],
      [['fey', 'seelie', 'court', 'unseelie'], DeityCategory.Fey],
      [['lords of the golden hills', 'gold', 'gnome'], DeityCategory.Gnome],
      [['heresies'], DeityCategory.Heresy],
      [['intermediate'], DeityCategory.Intermediate],
      [['lesser'], DeityCategory.Lesser],
      [['major'], DeityCategory.Major],
      [['monstrous'], DeityCategory.Monstrous],
      [['morndinsamman', 'dwarf'], DeityCategory.Dwarf],
      [['mulhorandi'], DeityCategory.Mulhorandi],
      [['planar'], DeityCategory.Planar],
      [['seldarine', 'elf'], DeityCategory.Elf],
      [['yondalla', 'children', 'yondalla\'s children', 'halfling'], DeityCategory.Halfling],
      [['yuanti'], DeityCategory.YuanTi],
    ])('should return the expected category', (str, expected) => str.forEach(s =>  expect(getDeityCategory(s)).toBe(expected)));
  });
});
