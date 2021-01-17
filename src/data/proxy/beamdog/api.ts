import fetch from 'node-fetch';
import { isValidBeamdogDBKey, isValidIPAndPort } from '../../../util';

const BeamdogAPI = 'https://api.nwn.beamdog.net/v1/servers';

export interface BeamdogAPIResponse {
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

export const fetchServer = async (identifier: string): Promise<BeamdogAPIResponse> => {
  if (isValidBeamdogDBKey(identifier)) {
    return await fetch(`${BeamdogAPI}/${identifier}`).then(res => res.json());
  }

  if (isValidIPAndPort(identifier)) {
    const [ip, port] = identifier.split(':');
    return await fetch(`${BeamdogAPI}/${ip}/${port}`).then(res => res.json());
  }

  throw new Error('Invalid Beamdog identifier.');
};
