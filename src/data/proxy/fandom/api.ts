import fetch from "node-fetch";

const ForgottenRealmsApi = 'https://forgottenrealms.fandom.com/api/v1/';

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

export const fetchDeityDetails = async (id: number, abstractSize: number = 100): Promise<ForgottenRealmsApiDeityElement | undefined> => (
  (await fetch(`${ForgottenRealmsApi}Articles/Details?ids=${id}&abstract=${abstractSize}`).then(response => response.json()))[id]
);
