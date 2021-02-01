import { FandomApiProxy, FandomSubdomain, FandomWikiScraper } from '..';
import { DeityMapper } from '../../mappers';
import { Deity } from '../../models';

export const fetchAllFandomDeityData = async (deity: Deity): Promise<Deity | undefined> => {
  const frId = await FandomApiProxy.resolveDeityIdFromName(deity.name, FandomSubdomain.ForgottenRealms);
  const frData = frId
    ? await FandomApiProxy.fetchArticleDetails(frId, FandomSubdomain.ForgottenRealms, DeityMapper)
    : undefined;

  const frcId = await FandomApiProxy.resolveDeityIdFromName(frData?.name ?? deity.name, FandomSubdomain.FRC);
  const frcData = frcId
    ? await FandomApiProxy.fetchArticleDetails(frcId, FandomSubdomain.FRC, DeityMapper)
    : undefined;

  if (frData || frcData) {
    const fandomApiData = { ...frData, ...frcData };
    const fandomWikiData = await FandomWikiScraper.fetchAndMapDeityArticles(fandomApiData);
    return {
      ...fandomApiData,
      ...fandomWikiData,
    } as Deity;
  }
};

export const fetchAllFandomHeresyData = async (heresy: Deity): Promise<Deity | undefined> => {
  const frId = await FandomApiProxy.resolveHeresyIdFromName(heresy.name.replace(/heresy|[(].*[)]/gi, ''), FandomSubdomain.ForgottenRealms);
  const frData = frId
    ? await FandomApiProxy.fetchArticleDetails(frId, FandomSubdomain.ForgottenRealms, DeityMapper)
    : undefined;

  if (frData) {
    const fandomApiData = { ...frData };
    const fandomWikiData = await FandomWikiScraper.fetchAndMapDeityArticles(fandomApiData);
    return {
      ...fandomApiData,
      ...fandomWikiData,
    } as Deity;
  }
};

export * from './api.proxy';
export * from './wiki.scraper';
