import { Deity, DeityCategory } from '../models';
import { ArelithWikiScraper } from './arelith';
import { fetchAllFandomDeityData, fetchAllFandomHeresyData } from './fandom';

const resolveThumbnail = (name: string): string | undefined => {
  if (name.toLowerCase().includes('harlot\'s coin')) {
    const { DEFAULT_HARLOTSCOIN_THUMB } = process.env;
    return DEFAULT_HARLOTSCOIN_THUMB;
  }

  if (name.toLowerCase().includes('risen sun')) {
    const { DEFAULT_RISENSUN_THUMB } = process.env;
    return DEFAULT_RISENSUN_THUMB;
  }

  if (name.toLowerCase().includes('shared suffering')) {
    const { DEFAULT_SHAREDSUFFERING_THUMB } = process.env;
    return DEFAULT_SHAREDSUFFERING_THUMB;
  }
};

export const fetchDeity = async (deityQuery: string): Promise<Deity | undefined> => {
  const deity = await ArelithWikiScraper.fetchDeity(deityQuery);
  if (deity) {
    const fandomData = deity.arelithCategory === DeityCategory.Heresy
      ? await fetchAllFandomHeresyData(deity)
      : await fetchAllFandomDeityData(deity);
    return { ...fandomData, ...deity };
  }
};

export const fetchAllDeities = async (): Promise<Deity[]> => {
  const deities = await ArelithWikiScraper.fetchAllDeities();
  return Promise.all(deities.map(async deity => {
    const fandomData = deity.arelithCategory === DeityCategory.Heresy
      ? await fetchAllFandomHeresyData(deity)
      : await fetchAllFandomDeityData(deity);

    return { ...fandomData, thumbnail: resolveThumbnail(deity.name), ...deity };
  }));
};

export * from './arelith';
export * from './fandom';
