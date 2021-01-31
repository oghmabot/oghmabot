import { findBestStringMatch } from '../../../utils';

export enum DeityCategory {
  Other = 0,
  Drow,
  Demigods,
  Draconic,
  Fey,
  Gnome,
  Heresy,
  Intermediate,
  Lesser,
  Major,
  Monstrous,
  Dwarf,
  Mulhorandi,
  Planar,
  Elf,
  Halfling,
  YuanTi,
}

export const getDeityCategory = (str: string): DeityCategory => {
  if (!str) return 0;
  const nums = [...Array(Object.values(DeityCategory).length).keys()].slice(1);
  return findBestStringMatch(nums, str, i => getDeityCategoryName(i)) ?? 0;
};

export const getDeityCategoryName = (cat: DeityCategory): string => {
  switch (cat) {
    case DeityCategory.Drow: return 'Dark Seldarine (Drow)';
    case DeityCategory.Demigods: return 'Demigods';
    case DeityCategory.Draconic: return 'Draconic Pantheon';
    case DeityCategory.Fey: return 'Seelie and Unseelie Court (Fey)';
    case DeityCategory.Gnome: return 'Lords of the Golden Hills (Gnome)';
    case DeityCategory.Heresy: return 'Heresies';
    case DeityCategory.Intermediate: return 'Intermediate Deities';
    case DeityCategory.Lesser: return 'Lesser Deities';
    case DeityCategory.Major: return 'Major Deities';
    case DeityCategory.Monstrous: return 'Monstrous Deities';
    case DeityCategory.Dwarf: return 'Morndinsamman (Dwarf)';
    case DeityCategory.Mulhorandi: return 'Mulhorandi';
    case DeityCategory.Planar: return 'Planar Powers';
    case DeityCategory.Elf: return 'Seldarine (Elf)';
    case DeityCategory.Halfling: return 'Yondalla\'s Children (Halfling)';
    case DeityCategory.YuanTi: return 'Yuan Ti Pantheon';
    default: return 'Other';
  }
};
