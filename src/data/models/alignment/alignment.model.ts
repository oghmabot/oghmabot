import { findBestStringMatch } from '../../../utils';

export const enum Alignment {
  NA = 0,
  LG, NG, CG,
  LN, TN, CN,
  LE, NE, CE,
}

export const getAlignment = (str: string): Alignment | undefined => {
  if (!str) return;
  if (str.toLowerCase().includes('na') || str.toLowerCase().includes('no')) return Alignment.NA;
  const [p1, p2] = str.length == 2 ? str : str.split(' ');
  const x = findBestStringMatch([['lawful', 1], ['neutral', 2], ['true', 2], ['chaotic', 3]], p1, v => v[0] as string);
  const y = findBestStringMatch([['good', 0], ['neutral', 1], ['evil', 2]], p2, v => v[0] as string);
  if (x && y) return x[1] as number + (y[1] as number * 3);
};

export const getAlignmentName = (alignment: Alignment): string => {
  switch (alignment) {
    case Alignment.LG: return 'Lawful Good';
    case Alignment.NG: return 'Neutral Good';
    case Alignment.CG: return 'Chaotic Good';
    case Alignment.LN: return 'Lawful Neutral';
    case Alignment.TN: return 'True Neutral';
    case Alignment.CN: return 'Chaotic Neutral';
    case Alignment.LE: return 'Lawful Evil';
    case Alignment.NE: return 'Neutral Evil';
    case Alignment.CE: return 'Chaotic Evil';
    default: return 'No Alignment';
  }
};

export const getAlignmentAbbreviation = (alignment: Alignment): string => (getAlignmentName(alignment).match(/[A-Z]/g) as string[]).join('');
