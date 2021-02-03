import { FandomApiArticle, FandomSubdomain } from '../proxies';
import { Deity } from '../models';

export class DeityMapper {
  static fromFandomApiArticle(article: FandomApiArticle, subdomain: FandomSubdomain): Deity | undefined {
    const { title, abstract, id, url, thumbnail } = article;
    const parsedThumbnail = thumbnail?.substring(0, thumbnail.indexOf('revision'));

    if (subdomain === FandomSubdomain.ForgottenRealms) {
      const pronunciations = abstract?.match(/\s*?[(]pronounced:.*?[)]/)?.slice(0)[0].replace(/([0-9]|(or|pronounced):|([/].*?[/])|listen|sometimes|misspelled|[()])/ig, '').trim().split(' ');

      return {
        name: title,
        fandomFRAbstract: abstract?.replace(/\s*?[(]pronounced:.*?[)]/, ''),
        fandomFRId: id,
        fandomFRUrl: url,
        fandomFRThumbnail: parsedThumbnail,
        pronunciation: pronunciations ? pronunciations[0] : undefined,
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
