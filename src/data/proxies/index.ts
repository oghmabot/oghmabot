import { Deity } from '../models';
import { ArelithWikiScraper } from './arelith';
import { fetchAllFandomDeityData } from './fandom';

export const fetchDeity = async (deityQuery: string): Promise<Deity | undefined> => {
  const deity = await ArelithWikiScraper.fetchDeity(deityQuery);
  if (deity) {
    const fandomData = await fetchAllFandomDeityData(deity);
    return {
      ...fandomData,
      ...deity,
    };
  }
};

export const fetchAllDeities = async (): Promise<Deity[]> => {
  const deities = await ArelithWikiScraper.fetchAllDeities();
  return Promise.all(deities.map(async deity => {
    const fandomData = await fetchAllFandomDeityData(deity);
    return {
      ...fandomData,
      ...deity,
    };
  }));
};

export * from './arelith';
export * from './beamdog';
export * from './fandom';
