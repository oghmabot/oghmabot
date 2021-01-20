import fetch from "node-fetch";

const ForgottenRealmsApi = 'https://forgottenrealms.fandom.com/api/v1/';

export interface FandomMapper<M> {
  fromForgottenRealmsApiDeityElement(el: ForgottenRealmsApiDeityElement): M;
}

export interface ForgottenRealmsApiDeityElement {
  id: number;
  title: string;
  url: string;
  ns: string;
  abstract: string;
  thumbnail: string;
}

export interface ForgottenRealmsApiResponseBody {
  items: ForgottenRealmsApiDeityElement[];
  basePath: string;
}

export const fetchDeityList = async (): Promise<ForgottenRealmsApiResponseBody> => (
  await fetch(`${ForgottenRealmsApi}Articles/List?category=deities&limit=500`).then(response => response.json())
);

export const resolveDeityIdFromName = async (name: string): Promise<number | undefined> => {
  return (await fetchDeityList()).items.find(d => d.title.toLowerCase().replace(/\s+/g, '').includes(name.toLowerCase().replace(/\s+/g, '')))?.id;
}

export async function fetchDeityDetails(id: number, abstractSize?: number): Promise<ForgottenRealmsApiDeityElement | undefined>;
export async function fetchDeityDetails(name: string, abstractSize?: number): Promise<ForgottenRealmsApiDeityElement | undefined>;
export async function fetchDeityDetails(query: number | string, abstractSize: number = 100): Promise<ForgottenRealmsApiDeityElement | undefined> {
  const id = typeof query === 'number'
    ? query
    : await resolveDeityIdFromName(query);

  if (id) {
    const json: ForgottenRealmsApiResponseBody = await fetch(`${ForgottenRealmsApi}Articles/Details?ids=${id}&abstract=${abstractSize}`).then(response => response.json());
    return json.items[id];
  }
};
