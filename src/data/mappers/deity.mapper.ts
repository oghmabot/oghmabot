import { FandomApiArticle, FandomSubdomain } from '../proxies';
import { Deity } from '../models';

export class DeityMapper {
  static fromFandomApiArticle(article: FandomApiArticle, subdomain: FandomSubdomain): Deity | undefined {
    const { title, abstract, id, url, thumbnail } = article;
    const parsedThumbnail = thumbnail?.substring(0, thumbnail.indexOf('revision'));

    if (subdomain === FandomSubdomain.ForgottenRealms) {
      return {
        name: title,
        fandomFRAbstract: abstract?.replace(/\s*?[(]pronounced:.*[)]/, ''),
        fandomFRId: id,
        fandomFRUrl: url,
        fandomFRThumbnail: parsedThumbnail,
      };
    }

    if (subdomain === FandomSubdomain.FRC) {
      return {
        name: title,
        fandomFRCormyrId: id,
        fandomFRCormyrUrl: url,
        fandomFRCormyrThumbnail: parsedThumbnail,
        pronunciation: abstract?.substring(abstract?.indexOf(title) + title.length + 1).match(/^[(](.+?)[)]/)?.slice(1, 2)[0],
      };
    }
  }
}
