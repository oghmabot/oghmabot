import fetch from 'node-fetch';
import { findBestStringMatch } from '../../../utils';

const ABSTRACT_SIZE = 500;

export enum FandomSubdomain {
  ForgottenRealms = 'forgottenrealms',
  FRC = 'frc',
}

export interface FandomMapper<M> {
  fromFandomApiArticle(article: FandomApiArticle, subdomain: FandomSubdomain): M;
}

export interface FandomApiArticle {
  id: number;
  title: string;
  url: string;
  ns: string;
  abstract: string;
  thumbnail: string;
}

export interface FandomApiResponseBody {
  items: FandomApiArticle[];
  basepath: string;
}

export class FandomApiProxy {
  static async fetchArticleDetails(id: number, subdomain: FandomSubdomain): Promise<FandomApiArticle | undefined>;
  static async fetchArticleDetails<M>(id: number, subdomain: FandomSubdomain, mapper: FandomMapper<M>): Promise<M | undefined>;
  static async fetchArticleDetails<M>(id: number, subdomain: FandomSubdomain = FandomSubdomain.ForgottenRealms, mapper?: FandomMapper<M>): Promise<FandomApiArticle | M | undefined> {
    if (id) {
      const url = `https://${subdomain}.fandom.com/api/v1/Articles/Details?ids=${id}&abstract=${ABSTRACT_SIZE}`;
      const response = await fetch(url);
      if (response.status !== 200) throw new Error(response.statusText);

      const json: FandomApiResponseBody = await response.json();
      const article: FandomApiArticle = { ...json.items[id], url: `${json.basepath}${json.items[id].url}` };
      return json.items[id]
        ? mapper ? mapper.fromFandomApiArticle(article, subdomain) : article
        : json.items[id];
    }
  }

  static async fetchDeityList(subdomain: FandomSubdomain = FandomSubdomain.ForgottenRealms): Promise<FandomApiArticle[]> {
    const response = await fetch(`https://${subdomain}.fandom.com/api/v1/Articles/List?category=deities&limit=1000`);
    const json: FandomApiResponseBody = await response.json();
    return json.items;
  }

  static async resolveDeityIdFromName(deityName: string, subdomain: FandomSubdomain = FandomSubdomain.ForgottenRealms): Promise<number | undefined> {
    const deities = await this.fetchDeityList(subdomain);
    const bestMatch = findBestStringMatch(deities, deityName, deity => deity?.title);
    if (bestMatch && bestMatch.title.replace(deityName, '').length < deityName.length) return bestMatch.id;
  }

  static async fetchHeresyList(subdomain: FandomSubdomain = FandomSubdomain.ForgottenRealms): Promise<FandomApiArticle[]> {
    const response = await fetch(`https://${subdomain}.fandom.com/api/v1/Articles/List?category=heresies&limit=100`);
    const json: FandomApiResponseBody = await response.json();
    return json.items;
  }

  static async resolveHeresyIdFromName(heresyName: string, subdomain: FandomSubdomain = FandomSubdomain.ForgottenRealms): Promise<number | undefined> {
    const heresies = await this.fetchHeresyList(subdomain);
    const bestMatch = findBestStringMatch(heresies, heresyName, heresy => heresy?.title);
    return bestMatch?.id;
  }
}
