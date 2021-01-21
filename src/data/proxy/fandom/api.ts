import fetch from "node-fetch";

const ForgottenRealmsApi = 'https://forgottenrealms.fandom.com/api/v1/';
const ABSTRACT_SIZE = 500;

export interface FandomMapper<M> {
  fromFandomApiDeityObj(el: FandomApiDeityObj): M;
}

export interface FandomApiDeityObj {
  id: number;
  title: string;
  url: string;
  ns: string;
  abstract: string;
  thumbnail: string;
}

export interface FandomApiResponseBody {
  items: FandomApiDeityObj[];
  basePath: string;
}

export const fetchDeityList = async (): Promise<FandomApiResponseBody> => (
  await fetch(`${ForgottenRealmsApi}Articles/List?category=deities&limit=500`).then(response => response.json())
);

export const resolveDeityIdFromName = async (name: string): Promise<number | undefined> => {
  return (await fetchDeityList()).items.find(d => d.title.toLowerCase().replace(/\s+/g, '').includes(name.toLowerCase().replace(/\s+/g, '')))?.id;
};

export async function fetchDeityDetails(id: number): Promise<FandomApiDeityObj | undefined>;
export async function fetchDeityDetails(name: string): Promise<FandomApiDeityObj | undefined>;
export async function fetchDeityDetails<M>(id: number, mapper: FandomMapper<M>): Promise<M | undefined>;
export async function fetchDeityDetails<M>(name: string, mapper: FandomMapper<M>): Promise<M | undefined>;
export async function fetchDeityDetails<M>(query: number | string, mapper?: FandomMapper<M>): Promise<FandomApiDeityObj | M | undefined> {
  const id = typeof query === 'number'
    ? query
    : await resolveDeityIdFromName(query);

  if (id) {
    const url = `${ForgottenRealmsApi}Articles/Details?ids=${id}&abstract=${ABSTRACT_SIZE}`;
    const response = await fetch(url);
    if (response.status !== 200) throw new Error(response.statusText);

    const json: FandomApiResponseBody = await response.json();
    const deityObj: FandomApiDeityObj = { ...json.items[id], url: `${json.basePath}${json.items[id].url}` };
    return mapper && deityObj
      ? mapper.fromFandomApiDeityObj(deityObj)
      : deityObj;
  }
}
