import { FandomApiArticle, FandomSubdomain } from '../proxies';
import { Deity } from '../models';
import { findBestStringMatch } from '../../utils';

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
        pronunciations,
      };
    }

    if (subdomain === FandomSubdomain.FRC) {
      const pronunciations = abstract?.substring(abstract?.indexOf(title) + title.length + 1).match(/^[(](.+?)[)]/)?.slice(1);
      return {
        name: title,
        fandomFRCormyrId: id,
        fandomFRCormyrUrl: url,
        fandomFRCormyrThumbnail: parsedThumbnail,
        pronunciations,
      };
    }
  }

  static mergePronunciations(a: string[], b: string[]): string[] {
    return [...a, ...b.filter(p => !findBestStringMatch(a, p))];
  }
}
