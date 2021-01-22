import fetch, { Response } from 'node-fetch';
import { isValidBeamdogDbKey, isValidIPAndPort } from '../../../utils';

const BeamdogApi = 'https://api.nwn.beamdog.net/v1/servers/';

export interface BeamdogMapper<M> {
  fromBeamdogApiResponseBody(response: BeamdogApiResponseBody): M;
}

export interface BeamdogApiResponseBody {
  first_seen: number;
  last_advertisement: number;
  session_name: string;
  module_name: string;
  passworded: boolean;
  current_players: number;
  max_players: number;
  latency: number;
  host: string;
  port: number;
  kx_pk: string;
}

export class BeamdogApiError extends Error {
  code: number;
  response: Response;

  constructor(response: Response, message?: string) {
    super(message);
    this.name = 'BeamdogApiError';
    this.code = response.status;
    this.response = response;
  }
}

export async function fetchServer(identifier: string): Promise<BeamdogApiResponseBody>;
export async function fetchServer<M>(identifier: string, mapper: BeamdogMapper<M>): Promise<M>;
export async function fetchServer<M>(identifier: string, mapper?: BeamdogMapper<M>): Promise<BeamdogApiResponseBody | M> {
  const url = `${BeamdogApi}${
    (isValidBeamdogDbKey(identifier) && identifier) || (isValidIPAndPort(identifier) && identifier.replace(':', '/'))
  }`;

  const response = await fetch(url);
  if (response.status !== 200) throw new BeamdogApiError(response, await response.text());

  const json: BeamdogApiResponseBody = await response.json();
  return mapper
    ? mapper.fromBeamdogApiResponseBody(json)
    : json;
}
