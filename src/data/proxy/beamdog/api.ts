import fetch, { Response } from 'node-fetch';

import { isValidBeamdogDBKey, isValidIPAndPort } from '../../../utils';

const BeamdogAPI = 'https://api.nwn.beamdog.net/v1/servers/';

export interface BeamdogMapper<M> {
  fromBeamdogAPIResponseBody: () => M;
}

export interface BeamdogAPIResponseBody {
  first_seen: number;
  last_advertisement: number;
  session_name: string;
  module_name: string;
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

export const fetchServer = async (identifier: string): Promise<BeamdogAPIResponseBody> => {
  const url = `${BeamdogAPI}${
    (isValidBeamdogDBKey(identifier) && identifier) || (isValidIPAndPort(identifier) && identifier.replace(':', '/'))
  }`;

  const response = await fetch(url);
  if (response.status !== 200) throw new BeamdogApiError(response, await response.text());

  return await response.json();
};
