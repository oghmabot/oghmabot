import fetch from "node-fetch";
import { findBestStringMatch } from "../../../utils";

const ABSTRACT_SIZE = 500;

export enum FandomSubdomain {
  ForgottenRealms = 'forgottenrealms',
  FRC = 'frc',
}

export interface FandomMapper<M> {
  fromFandomApiArticle(el: FandomApiArticle): M;
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
  basePath: string;
}

export class FandomApiProxy {
  static async fetchDeityDetails(id: number): Promise<FandomApiArticle | undefined>;
  static async fetchDeityDetails(name: string): Promise<FandomApiArticle | undefined>;
  static async fetchDeityDetails<M>(id: number, mapper: FandomMapper<M>): Promise<M | undefined>;
  static async fetchDeityDetails<M>(name: string, mapper: FandomMapper<M>): Promise<M | undefined>;
  static async fetchDeityDetails<M>(query: number | string, mapper?: FandomMapper<M>): Promise<FandomApiArticle | M | undefined> {
    const id = typeof query === 'number'
      ? query
      : await this.resolveDeityIdFromName(query);

    if (id) {
      const url = `https://${FandomSubdomain.ForgottenRealms}.fandom.com/api/v1/Articles/Details?ids=${id}&abstract=${ABSTRACT_SIZE}`;
      const response = await fetch(url);
      if (response.status !== 200) throw new Error(response.statusText);

      const json: FandomApiResponseBody = await response.json();
      const deityObj: FandomApiArticle = { ...json.items[id], url: `${json.basePath}${json.items[id].url}` };
      return mapper && deityObj
        ? mapper.fromFandomApiArticle(deityObj)
        : deityObj;
    }
  }

  static async fetchDeityList(): Promise<FandomApiArticle[]> {
    const response = await fetch(`https://${FandomSubdomain.ForgottenRealms}.fandom.com/api/v1/Articles/List?category=deities&limit=1000`);
    const json: FandomApiResponseBody = await response.json();
    return json.items;
  }

  private static async resolveDeityIdFromName(deityName: string): Promise<number | undefined> {
    const deities = await this.fetchDeityList();
    return findBestStringMatch(
      deities,
      deityName.toLowerCase().replace(/\s+/g, ''),
      deity => deity.title.toLowerCase().replace(/\s+/g, ''))?.id;
  }
}
