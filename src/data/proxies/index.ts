import { Deity, DeityCategory } from '../models';
import { ArelithWikiScraper } from './arelith';
import { fetchAllFandomDeityData, fetchAllFandomHeresyData } from './fandom';

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

    return { ...fandomData, ...deity };
  }));
};

export * from './arelith';
export * from './beamdog';
export * from './fandom';
