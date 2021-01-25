import { FandomApiProxy, FandomSubdomain, FandomWikiScraper } from '..';
import { DeityMapper } from '../../mappers';
import { Deity } from '../../models';

export const fetchAllFandomDeityData = async (deity: Deity): Promise<Deity | undefined> => {
  const frData = await FandomApiProxy.fetchDeityDetails(deity.name, FandomSubdomain.ForgottenRealms, DeityMapper);
  const frcData = await FandomApiProxy.fetchDeityDetails(frData?.name ?? deity.name, FandomSubdomain.FRC, DeityMapper);

  if (frData || frcData) {
    const fandomApiData = { ...frData, ...frcData };
    const fandomWikiData = await FandomWikiScraper.fetchAndMapDeityArticles(fandomApiData);
    return {
      ...fandomApiData,
      ...fandomWikiData,
    } as Deity;
  }
};

export * from './api.proxy';
export * from './wiki.scraper';
